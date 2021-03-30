let scale = .3;
let count = 7;

let s = getSpace();
let n = noise(s+vec3(0, 0, -1*time*.1));
n = sin(12.0*abs(n))*0.5+0.5;

let col = pow(sin(normal.y * n*10), 40)*.2;
blend(0.1);

color(col, col + normal.y * .2, col + normal.y * .4);

for(let i = 0; i < count; i ++) {
  let inc = (i/count)*PI*2;
  displace(sin(inc)*scale, cos(inc)*scale, 0);
  let rot = (i/count)*PI*(count-2);
  rotateY(.2)
  rotateZ(rot);
  rotateX(rot + time);
  box(.2, .1, .1);
  reset();
}
reset();
rotateX(PI/2);
