setMaxReflections(3)


function twirl(pn, tm) {
    let r = length(vec2(pn.x,pn.y));
    let th = atan(pn.x,pn.y);
    let r2 = r-0.3;
    let f = 7.0;
    let amp = 0.1;
    let r3 = r2 + amp*sin(f*th+tm);
    let v = p.z;
    let v2 = v + amp*cos(f*th-tm);
    let d = sqrt(v2*v2+r3*r3)-0.09;
	return [d*0.28, v2, r3];
}

let p = getSpace();
let rad = length(p);

let ds = twirl(p,time);
color(nsin(35*ds[1]),0,nsin(35*ds[2]));

sphere(.7)
shell(.01)
difference();
displace(0, 0, -.5)
box(1, 1, .5)

union()

setSDF(ds[0]);