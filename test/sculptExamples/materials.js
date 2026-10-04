// Materials and lighting: metal, shine, mixMat, fresnel, occlusion,
// lightDirection, backgroundColor
lightDirection(0.5, 1, -0.5);
backgroundColor(0.9, 0.95, 1);
occlusion(0.8);

shape(() => {
  displace(-0.45, 0, 0);
  metal(0.9);
  shine(0.8);
  color(0.9, 0.7, 0.3);
  sphere(0.2);
})();

shape(() => {
  metal(0);
  shine(0.2);
  color(vec3(0.2, 0.4, 0.9) + fresnel(2) * 0.5);
  sphere(0.2);
})();

shape(() => {
  displace(0.45, 0, 0);
  color(1, 0, 0);
  box(0.12, 0.12, 0.12);
  mixMat(0.5);
  color(0, 0, 1);
  displace(0, 0.1, 0);
  sphere(0.15);
})();
