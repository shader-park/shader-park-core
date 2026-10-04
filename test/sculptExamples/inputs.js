// input() / input2D() sliders become uniforms. The harness renders them at
// their default values; the minimal renderer leaves them at 0.
let size = input(0.5, 0, 1);
let offset = input2D(0.2, 0.1);
color(0.2, 0.5 + size * 0.5, 0.8);
displace(offset.x - 0.2, offset.y - 0.1, 0);
sphere(0.15 + size * 0.15);
