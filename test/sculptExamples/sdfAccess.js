// Reading and composing distances: getSDF, setSDF, extractSDF, shape() with
// arguments and a return value
let ring = shape((r) => {
  torus(r, 0.03);
  return r;
});
ring(0.3);
let inner = extractSDF(sphere)(0.15);
let d = getSDF();
setSDF(min(d, inner + 0.01));
let returned = ring(0.15);
displace(0, returned, 0);
sphere(0.05);
