import {sourceGenerator} from './jsapi/generate.js'
import {
    defaultVertexSource, 
    defaultFragSourceJS, 
    defaultFragSourceGLSL, 
    sculptureStarterCode, 
    fragFooter
} from './jsapi/default-shader.js'
import {unitySurfaceShader} from './jsapi/unity-surface-shader.js'

module.exports = {
    sourceGenerator,
    defaultVertexSource,
    defaultFragSourceJS,
    defaultFragSourceGLSL,
    sculptureStarterCode,
    fragFooter
}

let src = sourceGenerator( `

basicLighting();
let ringCount = 6;

for (let i=0; i<ringCount; i++) {
	let ringCycle = 2*Math.PI*i/ringCount+time;
	let radius = 0.25-0.2*cos(ringCycle);

	displace(0.0, 0.2*sin(ringCycle), 0.0);
	let val = i/ringCount;
	color(val*0.5,val+sin(3.0*x),val*0.5);
	torus( radius, 0.04);
	reset();
}

intersect();
torus(0.25,0.22);

`);

let shaderName = "testMatG";

let unityshader = unitySurfaceShader(shaderName,src.geoGLSL+src.colorGLSL,sculptureStarterCode,fragFooter);

const fs = require('fs');
fs.writeFile("./out/"+shaderName+".shader", unityshader, ()=>{}); 

//console.log(unityshader);
//console.log( sculptureStarterCode + src.geoGLSL + src.colorGLSL + fragFooter );

