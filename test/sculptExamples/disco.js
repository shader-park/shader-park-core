let p = getSpace();
let nsz = sphericalDistribution(p,100.0);
// this can be replaced with a hash
let v = (sin(5775.0*nsz.x+4.06)+cos(1524.2*nsz.y+32.9)+sin(2932.0*nsz.z))*0.2+0.8;
let cl = hsv2rgb(vec3(v,1.0,1.0));
let ms = 1.0*max(dot(normalize(mouse),vec3(nsz.x,nsz.y,nsz.z)),0.0);
ms = min(pow(ms,10.0),1.0);
let dsp = max(0.5*sin(time+v*190.0),2.0*ms)*0.02*exp(-1*pow(8.0*nsz.w,6.0));
let glo = max(1.0-2.0*dot(-1.0*normal,getRayDirection()),0.0);
shine(0.95);
metal(0.3);
color(cl*dsp*200.0+0.001);
sphere(0.3);
expand(dsp);