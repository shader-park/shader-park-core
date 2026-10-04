// Combination modes: union, difference, intersect, blend, mixGeo, shell, expand
shape(() => {
  displace(-0.5, 0.25, 0);
  sphere(0.18);
  difference();
  displace(0.1, 0, -0.1);
  sphere(0.14);
})();

shape(() => {
  displace(0, 0.25, 0);
  box(0.15, 0.15, 0.15);
  intersect();
  sphere(0.19);
})();

shape(() => {
  displace(0.5, 0.25, 0);
  blend(0.08);
  box(0.1, 0.1, 0.1);
  displace(0.12, 0.1, 0);
  sphere(0.1);
})();

shape(() => {
  displace(-0.5, -0.25, 0);
  box(0.15, 0.15, 0.15);
  // mixGeo blends the next shape with everything so far in this scope
  mixGeo(0.5);
  sphere(0.18);
})();

shape(() => {
  displace(0, -0.25, 0);
  sphere(0.18);
  shell(0.02);
  difference();
  displace(0, 0, -0.2);
  box(0.2, 0.2, 0.2);
})();

shape(() => {
  displace(0.5, -0.25, 0);
  box(0.1, 0.1, 0.1);
  expand(0.05);
})();
