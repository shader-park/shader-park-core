float d1(vec3 p) {
    float k = 2.0;
    float s1 = 0.75*sin(2.0*k*time);
    float s2 = 1.5*cos(k*time);
    vec3 p1 = p;
    p1.xz = rot2(PI*0.25)*p1.xz;
    p1.x += 0.6*s1;
    p1.z += 0.6*s2;
    return sphere(p1,0.15);
}

float d2(vec3 p) {
    float k = 2.0;
    float s3 = 0.75*sin(2.0*k*(time+PI*0.166666));
    float s4 = 1.5*cos(k*(time+PI*0.166666));
    vec3 p2 = p;
    p2.xy = rot2(PI*0.25)*p2.xy;
    p2.x += 0.6*s3;
    p2.y += 0.6*s4;
    return sphere(p2,0.15);
}

float d3(vec3 p) {
    float k = 2.0;
    float s3 = 0.75*sin(2.0*k*(time+PI*0.333333));
    float s4 = 1.5*cos(k*(time+PI*0.333333));
    vec3 p2 = p;
    p2.yz = rot2(PI*0.25)*p2.yz;
    p2.y += 0.6*s3;
    p2.z += 0.6*s4;
    return sphere(p2,0.15);
}

// Define the signed distance function (SDF) of your object here
float surfaceDistance(vec3 p) {
    p *= 2.0;
    vec3 op = p;
    float d = box(p,vec3(0.4));
    d += 0.02*length(sin(7.5*p));
    p = abs(p);
    d = subtract(sphere(p-vec3(0.3),0.2),d);
    d = subtract(infCylinder(op,vec3(0.0,0.0,0.18)),d);
    d = subtract(infCylinder(op.yxz,vec3(0.0,0.0,0.18)),d);
    d = subtract(infCylinder(op.yzx,vec3(0.0,0.0,0.18)),d);
    d = add(d1(op),d);
    d = add(d2(op),d);
    d = add(d3(op),d);
    
	return d*0.5;
}

// Here you can define how your object at point p will be colored.
vec3 shade(vec3 p, vec3 normal) {
    vec3 lightDirection = vec3(0.0,1.0,0.0);
    float light = simpleLighting(p, normal, lightDirection);
    vec3 color = vec3(1.000,0.980,0.980);
    float occ = occlusion(p,normal)*1.+0.3;
    p *= 2.0;
    if (d1(p)<0.01) {
        color = vec3(0.536,1.000,0.245);
    }
    if (d2(p)<0.01) {
        color = vec3(1.000,0.878,0.269);
    }
    if (d3(p)<0.01) {
        color = vec3(1.000,0.059,0.050);
    }
	return color*light*pow(occ,0.5);
}
