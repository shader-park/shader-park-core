let square = glslFunc("float squareit(float x) { return x * x; }");

sphere(square(0.4));
