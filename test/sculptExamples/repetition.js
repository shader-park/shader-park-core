// Domain repetition: repeat, repeatRadial, repeatLinear, mirrorN, grid
shape(() => {
  displace(-0.45, 0.25, 0);
  rotateX(PI / 2);
  let i = repeatRadial(6);
  color(hsv2rgb(vec3(i / 6, 0.7, 1)));
  displace(0.15, 0, 0);
  sphere(0.05);
})();

shape(() => {
  displace(0.45, 0.25, 0);
  let r = repeatLinear(vec3(0.03), vec3(1.5), vec3(3, 3, 1));
  color(vec3(0.3) + 0.2 * r.index);
  sphere(0.03);
})();

shape(() => {
  displace(-0.45, -0.3, 0);
  repeat(vec3(0.1, 0.1, 0.1), vec3(1, 1, 0));
  box(0.03, 0.03, 0.03);
})();

shape(() => {
  displace(0.45, -0.3, 0);
  grid(2, 0.03, 0.05);
})();
