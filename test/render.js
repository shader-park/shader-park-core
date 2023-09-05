import fs from 'fs';
import http from 'http';
import puppeteer from 'puppeteer';
import pngJS from 'png-js';
import { assert } from 'chai';
import * as converters from '../dist/shader-park-core.esm.js';

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
        this.timeout(15000);
        server = http.createServer((req, res) => {
            fs.readFile('./' + req.url, (err,data) => {
                if (err) {
                    res.writeHead(404);
                    res.end(JSON.stringify(err));
                    return;
                }
                const mimeType = mimeTypes[req.url.split('.').pop()];
                if (!mimeType) {
                    mimeType = 'text/plain';
                }
                res.writeHead(200, { "Content-Type": mimeType });
                res.end(data);
            });
        });
        server.listen(port);
        browser = await puppeteer.launch();
    });

    after(async () => {
        server.close();
        await browser.close();
    });

    // Test GLSL minimal renderer

    const glslFiles = generateHTMLFiles(testGLSLDir, outDir, 'glsl', converters.glslToMinimalHTMLRenderer);
    testExamples(glslFiles, outDir);

    // Test sculpt minimal renderer

    const sculptFiles = generateHTMLFiles(testSculptDir, outDir, 'js', converters.sculptToMinimalHTMLRenderer);
    testExamples(sculptFiles, outDir);

    const p5Files = generateHTMLFiles(testp5Dir, outDir, 'html', (x) => x);
    testExamples(p5Files, outDir);

    function generateHTMLFiles(inputDir, outputDir, fileType, convertFunc) {
        const testFiles = fs.readdirSync(inputDir).map(filePath => {
            const pieces = filePath.split('.');
            return pieces[pieces.length - 2];
        });
    
        console.log(`Testing ${fileType} examples: `, testFiles);
    
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
            }).timeout(12000);
            it(`Check pixels '${fname}'`, (done) => {
                pngJS.decode(`${outputDir}${fname}.png`, function(pixels) {
                    // pixels is a 1d array (in rgba order) of decoded pixel data
                    let sum = 0;
                    for (const v of pixels) {
                        sum += v;
                    }
                    const avg = sum/pixels.length;
                    //console.log(`${fname} average pixel value : ${avg}`);
                    assert.isAbove(avg, 2, 'average pixel value is less than 2. This may mean the rendered image is all white/blank.');
                    assert.isBelow(avg, 254, 'average pixel value greater than 254. This may mean the rendering has failed.');
                    done();
                });
            });
        });
    }

    async function verifyRender(fname, outputDir) {
        const pagename = `http://localhost:${port}/${outputDir}${fname}.html`;
        const outpath = `${outputDir}${fname}.png`;
        const page = await browser.newPage();
        await page.setViewport({ width: pageX, height: pageY });
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
        await page.screenshot({ path: outpath, fullPage: true });
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
        await page.close();
    }

});

