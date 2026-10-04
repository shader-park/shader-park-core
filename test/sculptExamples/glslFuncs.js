// Binding GLSL functions: scalar, vector return, and an ES3-parsed function
let wave = glslFunc(`
float wave(float x, float k) {
    return sin(x * k) * 0.5 + 0.5;
}
`);
let swirl = glslFunc(`
vec3 swirl(vec3 p, float a) {
    float c = cos(a * p.y);
    float s = sin(a * p.y);
    return vec3(c * p.x - s * p.z, p.y, s * p.x + c * p.z);
}
`);
let tint = glslFuncES3(`
vec3 tint(vec3 n) {
    return abs(n) * 0.8 + 0.2;
}
`);
let s = getSpace();
setSpace(swirl(s, 4));
color(tint(normal) * wave(s.y, 20));
box(0.2, 0.35, 0.2);
