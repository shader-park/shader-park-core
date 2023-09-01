occlusion(0.5);
sphere(0.5);
const d = getSDF();
overwrite();
color(0.1,0.1,0.1);
setSDF(abs(d)-0.2);
displace(-0.9);
difference();
box(vec3(0.9));
