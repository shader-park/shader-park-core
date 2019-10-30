const fs = require('fs');
const converters = require('../dist/sculpture-park-core.cjs.js');

const fileToRead = process.argv[2];

const src = fs.readFileSync(fileToRead).toString();

const pieces = fileToRead.split('/');

const fileName = pieces[pieces.length-1].split('.')[0];

//factor out and make version for each target

fs.writeFileSync('./out/' + fileName + '.glsl', converters.sculptToThreeJSShaderSource(src).frag);
