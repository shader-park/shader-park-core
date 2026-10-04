import fs from 'fs';
import http from 'http';
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';
import { assert } from 'chai';
import {
    glslToMinimalHTMLRenderer,
    sculptToMinimalHTMLRenderer
} from '../dist/shader-park-core.esm.js';

// End-to-end check: builds pages that use the bundled library (dist/), renders
// every example in headless Chrome and fails on page errors, shader errors or a
// blank image. Pixel-level regressions against main are checked by the faster
// harness: npm run harness
//
// Rendering uses SwiftShader (Chrome's software GL) so results match across
// machines and CI, and time is pinned to 0 so animated sculptures are stable.

// number of animation frames to wait for before taking the screenshot
const FRAMES_BEFORE_CAPTURE = 2;

describe('Compiling, rendering, checking pixels', () => {

    const port = 8080;
    const mimeTypes = {
        "html": "text/html",
        "js": "text/javascript"
    };

    const pageX = 400;
    const pageY = 300;
    const testSculptDir = 'test/sculptExamples/';
    const testGLSLDir = 'test/glslExamples/';
    const testp5Dir = 'test/p5Examples/';
    const outDir = 'test/out/';
    const libPath = '../../dist/shader-park-core.esm.js';

    let browser;
    let server;

    before(async function() {
        this.timeout(30000);
        server = http.createServer((req, res) => {
            if (req.url === '/favicon.ico') {
                res.writeHead(204);
                res.end();
                return;
            }
            fs.readFile('./' + req.url, (err,data) => {
                if (err) {
                    res.writeHead(404);
                    res.end(JSON.stringify(err));
                    return;
                }
                let mimeType = mimeTypes[req.url.split('.').pop()];
                if (!mimeType) {
                    mimeType = 'text/plain';
                }
                res.writeHead(200, { "Content-Type": mimeType });
                res.end(data);
            });
        });
        server.listen(port);
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--use-angle=swiftshader',
                '--enable-unsafe-swiftshader',
                '--ignore-gpu-blocklist',
                // GitHub's Ubuntu runners don't allow Chrome's sandbox
                ...(process.env.CI ? ['--no-sandbox'] : []),
            ],
        });
    });

    after(async function() {
        this.timeout(15000);
        await browser.close();
        server.closeAllConnections();
        server.close();
    });

    // Test GLSL minimal renderer

    const glslFiles = generateHTMLFiles(testGLSLDir, outDir, 'glsl', glslToMinimalHTMLRenderer);
    testExamples(glslFiles, outDir);

    // Test sculpt minimal renderer

    const sculptFiles = generateHTMLFiles(testSculptDir, outDir, 'js', sculptToMinimalHTMLRenderer);
    testExamples(sculptFiles, outDir);

    const p5Files = generateHTMLFiles(testp5Dir, outDir, 'html', (x) => x);
    testExamples(p5Files, outDir);

    function generateHTMLFiles(inputDir, outputDir, fileType, convertFunc) {
        const testFiles = fs.readdirSync(inputDir).map(filePath => {
            const pieces = filePath.split('.');
            return pieces[pieces.length - 2];
        });

        testFiles.forEach(fileName => {
            const src = fs.readFileSync(inputDir + fileName + '.' + fileType).toString();
            fs.writeFileSync('./' + outputDir + fileName + '.html', convertFunc(src, libPath));
        });

        return testFiles;
    }

    function testExamples(files, outputDir) {
        files.forEach(fname => {
            it(`Example: '${fname}'`, async () => {
                await verifyRender(fname, outputDir);
                checkNotBlank(fname, outputDir);
            }).timeout(30000);
        });
    }

    function readPNG(path) {
        return PNG.sync.read(fs.readFileSync(path));
    }

    // Catches renders that failed outright (all white / all black)
    function checkNotBlank(fname, outputDir) {
        const { data } = readPNG(`${outputDir}${fname}.png`);
        let sum = 0;
        let drawn = 0;
        for (let i = 0; i < data.length; i += 4) {
            sum += data[i] + data[i + 1] + data[i + 2];
            // anything visibly different from the white page background
            if (data[i] < 250 || data[i + 1] < 250 || data[i + 2] < 250) drawn++;
        }
        const pixels = data.length / 4;
        const avg = sum / (pixels * 3);
        assert.isAbove(avg, 2, `${fname}: average pixel value is less than 2. This may mean the rendered image is all black/blank.`);
        assert.isAbove(drawn / pixels, 0.001, `${fname}: fewer than 0.1% of pixels differ from the white background. This may mean the rendering has failed.`);
    }

    async function verifyRender(fname, outputDir) {
        const pagename = `http://localhost:${port}/${outputDir}${fname}.html`;
        const outpath = `${outputDir}${fname}.png`;
        const page = await browser.newPage();
        await page.setViewport({ width: pageX, height: pageY, deviceScaleFactor: 1 });

        // Pin time to 0 and count animation frames so we can screenshot
        // as soon as the sculpture has actually been drawn.
        await page.evaluateOnNewDocument(() => {
            const fixedNow = Date.now();
            Date.now = () => fixedNow;
            window.__spFrames = 0;
            const raf = window.requestAnimationFrame.bind(window);
            window.requestAnimationFrame = (cb) => raf((t) => {
                window.__spFrames++;
                cb(t);
            });
        });

        const pageErrors = [];
        page.on('pageerror', (e) => {
            pageErrors.push(e);
        });
        const errors = [];
        page.on('error', (e) => {
            errors.push(e);
        });
        const logs = [];
        page.on('console', (msg) => {
            logs.push(msg);
        });
        await page.goto(pagename);
        await page.waitForFunction(
            (n) => window.__spFrames >= n,
            { timeout: 20000 },
            FRAMES_BEFORE_CAPTURE
        ).catch(() => {
            errors.push(new Error(`Timed out waiting for ${FRAMES_BEFORE_CAPTURE} rendered frames`));
        });
        await page.screenshot({ path: outpath });
        await page.close();

        for (const perr of pageErrors) {
            assert.fail(`Page javascript error: ${perr}`);
        }
        for (const err of errors) {
            assert.fail(`error: ${err}`);
        }
        for (const msg of logs) {
            if (msg.type() === 'error') {
                assert.fail(`console error: ${msg.text()}`);
            }
        }
    }

});
