// Define the signed distance function (SDF) of your object here
float surfaceDistance(vec3 p) {
    
    vec3 op = p;
    const int iters = 2;
    float its = float(iters);
    float size = 0.2;
    for (int i=0; i<iters; i++) {
        float fi = float(i);
        p = abs(p);
        p -= size;
        size *= 0.5;
        //d = add(d, sphere(p,0.02));
    }
    
    
	return sphere(p, 1.9*size);
}

float fractal(vec3 p) {
    float v = 0.0;
    float amp = 1.0;
    for (int i=0; i<10; i++) {
        v += noise(p)*amp;
        amp *= 0.5;
        p *= 2.0;
    }
    return v;
} 

// Here you can define how your object at point p will be colored.
vec3 shade(vec3 p, vec3 normal) {
    vec3 lightDirection = mouse;
    float n = fractal(1.0*p)*0.5+0.65;
    n = sin(55.0*n)*0.5+0.7;
    float light = simpleLighting(p, normal, lightDirection);
    float dim = 0.1*n+0.1*pow(n,16.0);
    float spec = 0.2*clamp(pow(light,520.0*dim),0.0,1.0);
    spec += 0.2*clamp(pow(light,10.0*dim),0.0,1.0);
    light *= 0.7 + 0.5*clamp(p.y,-0.5,0.0);
    light += 1.3*spec;
    light += 0.02*n;
    light *= 0.9;
    
    vec3 color = vec3(1.0-0.90*dim, 1.0-dim*0.9*(sin(63.0*p.y)*0.5+0.5), 1.0-dim*0.7*(sin(143.0*p.x)*0.5+0.5));
    light -= 0.03*noise(30.0*p);
    float occ = occlusion(p,normal);
	return color*light*sqrt(occ);
}
