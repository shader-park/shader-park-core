const fs = require('fs');
const http = require('http');
const puppeteer = require('puppeteer');
const pngJS = require('png-js');
const assert = require('chai').assert;
const converters = require('../dist/shader-park-core.cjs.js'); 

describe('Compiling, rendering, checking pixels', () => {

    const port = 8080;
    const mimeTypes = {
        "html": "text/html",
        "js": "text/javascript"
    };

    const pageX = 400;
    const pageY = 300;
    const testDir = './examples/'
    const ouputDir = 'out/';

    let browser;
    let server;

    before(async () => {
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

    testFiles = fs.readdirSync(testDir).map(filePath => {
        const pieces = filePath.split('.');
        return pieces[pieces.length - 2];
    });

    console.log('Testing examples: ', testFiles);

    testFiles.forEach(fileName => {
        const src = fs.readFileSync(testDir + fileName + '.js').toString();
        fs.writeFileSync('./' + ouputDir + fileName + '.html', converters.sculptToMinimalHTMLRenderer(src));
    });

    testFiles.forEach(fname => {
        it(`Example: '${fname}'`, async () => {
            await verifyRender(fname);
        }).timeout(12000);
        it(`Check pixels '${fname}'`, (done) => {
            pngJS.decode(`${ouputDir}${fname}.png`, function(pixels) {
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

    after(async () => {
        server.close();
        await browser.close();
    });  

    async function verifyRender(fname) {
        const pagename = `http://localhost:${port}/${ouputDir}${fname}.html`;
        const outpath = `${ouputDir}${fname}.png`;
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
        await page.goto(pagename);
        await page.screenshot({ path: outpath, fullPage: true });
        for (let perr of pageErrors) {
            assert.fail(`Page javascript error: ${perr}`);
        }
        for (let err of errors) {
            assert.fail(`error: ${err}`);
        }
        await page.close();
    }

});

