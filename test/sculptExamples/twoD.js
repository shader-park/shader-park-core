// enable2D(): no raymarching; color is computed per pixel from 2D coordinates
let s = enable2D();
let d = length(s) - 0.25;
let ring = abs(d) - 0.02;
let fill = 1 - step(0, d);
let edge = 1 - smoothstep(0, 0.01, ring);
color(vec3(0.95, 0.9, 0.8) * (1 - edge) * (0.6 + 0.4 * fill) + vec3(0.1, 0.2, 0.6) * edge);
