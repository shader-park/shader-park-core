const axis = vec3(0.5, 0.5, 0);
const s = getSpace();
const rotated = rotateVec(s, axis, time);
setSpace(rotated);
displace(0.2);
box(0.1, 0.1, 0.1);