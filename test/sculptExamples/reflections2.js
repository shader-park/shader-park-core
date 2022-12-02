color(vec3(.1))
metal(0)
reflectiveColor(vec3(1))
box(vec3(1.2));
shell(.005);
difference();
displace(0, 0, -1);
box(2, 2, .5)
displace(1);
union();
reset();
setMaxReflections(5)

shape(() => {
	shine(.0)
	color(1, 0, 0)
	displace(-.4, 0, 0);
	sphere(.3);
	reset();
})()
displace(0, -.8, 0);
shine(1)
color(vec3(1))
box(.5, .3, .5)
reset();
displace(.4, 0, 0);
color(0, 0, 1)
sphere(.3);      
            