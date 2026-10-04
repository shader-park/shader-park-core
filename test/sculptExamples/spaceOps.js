// Space transforms: rotate, mirror, flip, setSpace, scaleShape, getSpherical,
// revolve2D and extrude2D
shape(() => {
  displace(-0.5, 0.25, 0);
  rotateX(0.6);
  rotateY(0.6);
  rotateZ(0.3);
  box(0.12, 0.06, 0.06);
})();

shape(() => {
  displace(0, 0.25, 0);
  mirrorX();
  displace(0.08, 0, 0);
  flipY();
  roundCone(vec3(0, -0.08, 0), vec3(0, 0.08, 0), 0.06, 0.02);
})();

shape(() => {
  displace(0.5, 0.25, 0);
  let scaledTorus = scaleShape(torus, 0.5);
  scaledTorus(0.25, 0.06);
})();

let circle2D = (q, r) => length(q) - r;

shape(() => {
  displace(-0.5, -0.25, 0);
  let revolve = revolve2D(circle2D);
  revolve(0.1, 0.04);
})();

shape(() => {
  displace(0, -0.25, 0);
  let extrude = extrude2D(circle2D);
  extrude(0.05, 0.12);
})();

shape(() => {
  displace(0.5, -0.25, 0);
  let sp = getSpherical();
  color(vec3(nsin(sp.y * 8), nsin(sp.z * 8), 0.5));
  sphere(0.15);
})();
