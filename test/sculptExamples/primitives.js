// Built-in and bound SDF primitives, laid out in a grid
color(0.9, 0.6, 0.3);
displace(-0.6, 0.3, 0);
torus(0.12, 0.04);
reset();
displace(-0.2, 0.3, 0);
cylinder(0.08, 0.12);
reset();
// cone() is infinite, so cap it with a sphere
shape(() => {
  displace(0.2, 0.42, 0);
  cone(vec2(0.5, 0.3));
  intersect();
  sphere(0.15);
})();
displace(0.6, 0.3, 0);
roundCone(vec3(0, -0.1, 0), vec3(0, 0.1, 0), 0.08, 0.04);
reset();
displace(-0.6, -0.3, 0);
line(vec3(-0.1, -0.1, 0), vec3(0.1, 0.1, 0), 0.03);
reset();
displace(-0.2, -0.3, 0);
boxFrame(vec3(0.12), 0.015);
reset();
displace(0.2, -0.3, 0);
link(0.06, 0.07, 0.025);
reset();
displace(0.6, -0.3, 0);
cappedTorus(vec2(sin(2.0), cos(2.0)), 0.1, 0.03);
reset();

// plane() is infinite, so cut a sphere with it
shape(() => {
  sphere(0.12);
  intersect();
  plane(0, 1, 0, 0);
})();
