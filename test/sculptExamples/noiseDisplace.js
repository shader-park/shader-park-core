// Noise-driven displacement. Displacing an SDF overestimates distance, so the
// step size is reduced to keep the raymarch from overshooting.
setGeometryQuality(80);
let s = getSpace();
let n = fractalNoise(s * 3 + vec3(0, 0, time * 0.2));
color(hsv2rgb(vec3(0.6 + n * 0.3, 0.6, 0.9)));
sphere(0.4 + n * 0.08);
