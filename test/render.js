import fs from 'fs';
import http from 'http';
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
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

    // Test the three.js target through the real user path: createSculpture from
    // the bundle, rendered by THREE.WebGLRenderer. The camera reproduces the
    // minimal renderer's view, so both renders should show the same sculpture.

    const threeFiles = generateHTMLFiles(testSculptDir, outDir, 'js', threeJSHTML, '.three');
    testExamples(threeFiles, outDir, (fname) => compareToMinimal(fname, outDir));

    function threeJSHTML(src) {
        // The minimal renderer casts rays from (0, 0, -2) through a plane at
        // z = 0 that is 1.75 units tall, and its image is mirrored horizontally
        // relative to a camera at that position (compareToMinimal flips it back)
        const fov = 2 * Math.atan(0.875 / 2) * 180 / Math.PI;
        return `<!DOCTYPE html>
<html>
<head>
    <style>html, body { margin: 0; padding: 0; background: white; }</style>
    <script type="importmap">{ "imports": { "three": "/node_modules/three/build/three.module.js" } }</script>
</head>
<body>
    <script type="module">
    import * as THREE from 'three';
    import { createSculpture } from '/dist/shader-park-core.esm.js';
    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(1);
    renderer.setSize(${pageX}, ${pageY});
    renderer.setClearColor(0xffffff, 1);
    document.body.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(${fov}, ${pageX} / ${pageY}, 0.1, 100);
    camera.position.set(0, 0, -2);
    camera.lookAt(0, 0, 0);
    // radius 1 keeps _scale at 1 like the minimal renderer; the larger
    // geometry just bounds the area the raymarcher runs in
    const mesh = createSculpture(${JSON.stringify(src).replace(/</g, '\\u003c')}, () => ({}), {
        radius: 1,
        geometry: new THREE.SphereGeometry(1.6, 48, 24),
    });
    // the minimal renderer leaves input() sliders at 0; do the same here
    const base = ['time', 'opacity', '_scale', 'mouse', 'stepSize', 'resolution'];
    for (const u of mesh.material.uniformDescriptions) {
        if (base.includes(u.name)) continue;
        const value = mesh.material.uniforms[u.name].value;
        if (typeof value === 'number') mesh.material.uniforms[u.name].value = 0;
        else value.setScalar(0);
    }
    scene.add(mesh);
    function frame() {
        renderer.render(scene, camera);
        requestAnimationFrame(frame);
    }
    frame();
    </script>
</body>
</html>`;
    }

    function compareToMinimal(fname, outputDir) {
        const name = fname.replace(/\.three$/, '');
        const three = readPNG(`${outputDir}${fname}.png`);
        const minimal = readPNG(`${outputDir}${name}.png`);
        const { width, height } = three;
        const flipped = new PNG({ width, height });
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                three.data.copy(flipped.data, (y * width + x) * 4,
                    (y * width + (width - 1 - x)) * 4, (y * width + (width - 1 - x)) * 4 + 4);
            }
        }
        const diff = new PNG({ width, height });
        const changed = pixelmatch(flipped.data, minimal.data, diff.data, width, height, { threshold: 0.1 });
        const ratio = changed / (width * height);
        fs.writeFileSync(`${outputDir}${fname}.diff.png`, PNG.sync.write(diff));
        // small differences come from interpolated ray directions on the mesh
        assert.isAtMost(ratio, 0.005, `${name}: the three.js render differs from the minimal renderer on ` +
            `${(ratio * 100).toFixed(2)}% of pixels. See ${outputDir}${fname}.diff.png`);
    }

    function generateHTMLFiles(inputDir, outputDir, fileType, convertFunc, suffix = '') {
        const testFiles = fs.readdirSync(inputDir).map(filePath => {
            const pieces = filePath.split('.');
            return pieces[pieces.length - 2];
        });

        testFiles.forEach(fileName => {
            const src = fs.readFileSync(inputDir + fileName + '.' + fileType).toString();
            fs.writeFileSync('./' + outputDir + fileName + suffix + '.html', convertFunc(src, libPath));
        });

        return testFiles.map((name) => name + suffix);
    }

    function testExamples(files, outputDir, extraCheck) {
        files.forEach(fname => {
            it(`Example: '${fname}'`, async () => {
                await verifyRender(fname, outputDir);
                checkNotBlank(fname, outputDir);
                if (extraCheck) extraCheck(fname);
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
        const response = await page.goto(pagename);
        if (!response.ok()) {
            await page.close();
            assert.fail(`Loading ${pagename} failed: HTTP ${response.status()}`);
        }
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
