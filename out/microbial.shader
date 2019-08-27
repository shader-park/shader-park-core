
    Shader "Custom/microbial"
{
    Properties
    {
        _Color ("Color", Color) = (1,1,1,1)
        _MainTex ("Albedo (RGB)", 2D) = "white" {}
        _Glossiness ("Smoothness", Range(0,1)) = 0.5
        _Metallic ("Metallic", Range(0,1)) = 0.0
    }
    SubShader
    {
        Tags { "RenderType"="Opaque" }
        LOD 200

        CGPROGRAM
        // Physically based Standard lighting model, and enable shadows on all light types
        #pragma surface surf Standard fullforwardshadows

        // Use shader model 3.0 target, to get nicer looking lighting
        #pragma target 3.0

        sampler2D _MainTex;

        struct Input
        {
            float2 uv_MainTex;
            float4 screenPos;
            float3 worldPos;
        };

        half _Glossiness;
        half _Metallic;
        fixed4 _Color;
        #define USE_HLSL



float surfaceDistance(float3 p);

#define PI 3.14159265
#define TAU = 6.283185
#define TWO_PI 6.283185307179586
#define stepSize 0.9
#ifdef USE_HLSL
#define max_dist 25.0
#else
#define max_dist 4.0
#endif
#define intersection_threshold 0.00007

// Trig functions normalized to the range 0.0-1.0
float nsin(float x) {
    return sin(x)*0.5+0.5;
}

float ncos(float x) {
    return cos(x)*0.5+0.5;
}

float round(float x) {
    return floor(x+0.5);
}

float softSquare(float x, int pw) {
    return 1.0/(pow(tan(x),float(pw+1)*2.0)+1.0);
}

// Simple oscillators 

float osc(float freq, float amp, float base, float phase) {
    return base+amp*sin(TWO_PI*(freq*_Time.y+phase));
}

float osc(float freq, float amp, float base) {
    return osc(freq, amp, base, 0.0);
}

float osc(float freq, float amp) {
    return osc(freq, amp, 1.0);
}

float osc(float freq) {
    return osc(freq, 0.5);
}

float osc() {
    return osc(1.0);
}

// Color Conversion
// https://www.shadertoy.com/view/lsS3Wc
float3 hsv2rgb( in float3 c )
{
    float3 rgb = clamp( abs(fmod(c.x*6.0+float3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
    return c.z * lerp( float3(1.0,1.0,1.0), rgb, c.y);
}

float3 rgb2hsv( in float3 c)
{
    const float eps = 0.0000001;
    float4 k = float4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
    float4 p = lerp(float4(c.zy, k.wz), float4(c.yz, k.xy), (c.z<c.y) ? 1.0 : 0.0);
    float4 q = lerp(float4(p.xyw, c.x), float4(c.x, p.yzx), (p.x<c.x) ? 1.0 : 0.0);
    float d = q.x - min(q.w, q.y);
    return float3(abs(q.z + (q.w - q.y) / (6.0*d+eps)), d / (q.x+eps), q.x);
}


// Primitives

float lineGeo(float3 p, float3 a, float3 b) {
	float3 pa = p-a;
  	float3 ba = b-a;
	float t = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.);
  	return length(pa - ba*t);
}

//line with radius
float lineGeo( float3 p, float3 a, float3 b, float radius ){
    float3 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h ) - radius;
}

float sphere( float3 p, float size ){
  return length(p)-size;
}

float uBox( float3 p, float3 b ){
  return length(max(abs(p)-b,0.0));
}

float uRoundBox( float3 p, float3 b, float r ){
  return length(max(abs(p)-b,0.0))-r;
}

float box( float3 p, float3 box ){
  float3 d = abs(p) - box;
  return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float box( float3 p, float bx, float by, float bz) {
    float3 box = float3(bx,by,bz);
    float3 d = abs(p) - box;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float roundedBox( float3 p, float3 box , float r){
  return length(max(abs(p)-box,0.0))-r;
}

float torus( float3 p, float2 t ){
  float2 q = float2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

float torus( float3 p, float tx, float ty ){
    float2 q = float2(length(p.xz)-tx,p.y);
    return length(q)-ty;
}

float infCylinder( float3 p, float3 c )
{
  return length(p.xz-c.xy)-c.z;
}

float cylinder( float3 p, float2 h )
{
  float2 d = abs(float2(length(p.xz),p.y)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float cone( float3 p, float2 c )
{
    // c must be normalized
    float q = length(p.xy);
    return dot(c,float2(q,p.z));
}

float plane( float3 p, float4 n )
{
  // n must be normalized
  return dot(p,n.xyz) + n.w;
}

float plane( float3 p, float nx, float ny, float nz, float nw)
{
  // n must be normalized
  return dot(p,normalize(float3(nx,ny,nz))) + nw;
}

float hexPrism( float3 p, float2 h )
{
    float3 q = abs(p);
    return max(q.z-h.y,max((q.x*0.866025+q.y*0.5),q.y)-h.x);
}

float triPrism( float3 p, float2 h )
{
    float3 q = abs(p);
    return max(q.z-h.y,max(q.x*0.866025+p.y*0.5,-p.y)-h.x*0.5);
}

float capsule( float3 p, float3 a, float3 b, float r )
{
    float3 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h ) - r;
}


float triangularPrism( float3 p, float2 h ) {
    float3 q = abs(p);
    return max(q.z-h.y,max(q.x*0.866025+p.y*0.5,-p.y)-h.x*0.5);
}

float cappedCone( in float3 p, in float3 c )
{
    float2 q = float2( length(p.xz), p.y );
    float2 v = float2( c.z*c.y/c.x, -c.z );
    float2 w = v - q;
    float2 vv = float2( dot(v,v), v.x*v.x );
    float2 qv = float2( dot(v,w), v.x*w.x );
    float2 d = max(qv,0.0)*qv/vv;
    return sqrt( dot(w,w) - max(d.x,d.y) ) * sign(max(q.y*v.x-q.x*v.y,w.y));
}

float roundCone(float3 p, float3 a, float3 b, float r1, float r2)
{
    // sampling independent computations (only depend on shape)
    float3  ba = b - a;
    float l2 = dot(ba,ba);
    float rr = r1 - r2;
    float a2 = l2 - rr*rr;
    float il2 = 1.0/l2;
    
    // sampling dependant computations
    float3 pa = p - a;
    float y = dot(pa,ba);
    float z = y - l2;
    float3 rv = pa*l2 - ba*y;
    float x2 = dot(rv,rv);
    float y2 = y*y*l2;
    float z2 = z*z*l2;

    // single square root!
    float k = sign(rr)*rr*rr*x2;
    if( sign(z)*a2*z2 > k ) return  sqrt(x2 + z2)        *il2 - r2;
    if( sign(y)*a2*y2 < k ) return  sqrt(x2 + y2)        *il2 - r1;
                            return (sqrt(x2*a2*il2)+y*rr)*il2 - r1;
}

float ellipsoid( in float3 p, in float3 r )
{
    return (length( p/r ) - 1.0) * min(min(r.x,r.y),r.z);
}

float3 toSpherical(float3 p) {
    float phi = atan2(p.x,p.z);
    float r = length(p);
    float theta = acos(-p.y/r);
    return float3(r,theta,phi);
}

float3 fromSpherical(float3 p) {
    return float3(p.x*sin(p.y)*cos(p.z), p.x*sin(p.y)*sin(p.z), p.x*cos(p.y));
}

float dot2( in float3 v ) { return dot(v,v); }

float uTriangle( float3 p, float3 a, float3 b, float3 c )
{
    float3 ba = b - a; float3 pa = p - a;
    float3 cb = c - b; float3 pb = p - b;
    float3 ac = a - c; float3 pc = p - c;
    float3 nor = cross( ba, ac );
    return sqrt(
    (sign(dot(cross(ba,nor),pa)) +
     sign(dot(cross(cb,nor),pb)) +
     sign(dot(cross(ac,nor),pc))<2.0)
     ?
     min( min(
     dot2(ba*clamp(dot(ba,pa)/dot2(ba),0.0,1.0)-pa),
     dot2(cb*clamp(dot(cb,pb)/dot2(cb),0.0,1.0)-pb) ),
     dot2(ac*clamp(dot(ac,pc)/dot2(ac),0.0,1.0)-pc) )
     :
     dot(nor,pa)*dot(nor,pa)/dot2(nor) );
}

float add( float d1, float d2 )
{
    return min(d1,d2);
}

float add(float d1, float d2, float d3) {
   return min(d1, min(d2,d3));
}

float add(float d1, float d2, float d3, float d4) {
    return min(min(d1,d2),min(d3,d4));
}

float add(float d1, float d2, float d3, float d4, float d5) {
    return min(min(min(d1,d2), min(d3,d4)),d5);
}

float add(float d1, float d2, float d3, float d4, float d5, float d6) {
    return min(min(min(d1,d2),min(d3,d4)),min(d5,d6));
}

float add(float d1, float d2, float d3, float d4, float d5, float d6, float d7) {
    return min(min(min(d1,d2),min(d3,d4)),min(min(d5,d6),d7));
}

float subtract( float d1, float d2 )
{
    return max(-d1,d2);
}

float intersect( float d1, float d2 )
{
    return max(d1,d2);
}

float shell(float d, float thickness) {
    return abs(d)-thickness;
}

float3 repeat3D(float3 p, float3 c )
{
    return fmod(p,c)-0.5*c;
}

float repeat1D(inout float p, float size)
{
	float halfSize = size * 0.5;
	float c = floor((p + halfSize) / size);
  	p = fmod(p + halfSize, size)-halfSize;
  	return c;
}

float2x2 rot2(float a){
    float c = cos(a); float s = sin(a);
	return float2x2(c, s, -s, c);
}

// polynomial smooth min (k = 0.1) (from IQ)
float smoothAdd( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return lerp( b, a, h ) - k*h*(1.0-h);
}

float smoothSubtract(float a,float b, float k)
{
    return -smoothAdd(-a,-b,k);
}

float2 _hash( float2 p ) // replace this by something better
{
	p = float2( dot(p,float2(127.1,311.7)),
			  dot(p,float2(269.5,183.3)) );
	return -1.0 + 2.0*frac(sin(p)*43758.5453123);
}

float noise( in float2 p )
{
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;
	float2 i = floor( p + (p.x+p.y)*K1 );
	
    float2 a = p - i + (i.x+i.y)*K2;
    float2 o = step(a.yx,a.xy);    
    float2 b = a - o + K2;
	float2 c = a - 1.0 + 2.0*K2;
    float3 h = max( 0.5-float3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
	float3 n = h*h*h*h*float3( dot(a,_hash(i+0.0)), dot(b,_hash(i+o)), dot(c,_hash(i+1.0)));
    return dot( n, float3(70.0,70.0,70.0) );
}

float3 _hash33(float3 p3)
{
    p3 = frac(p3 * float3(.1031,.11369,.13787));
    p3 += dot(p3, p3.yxz+19.19);
    return -1.0 + 2.0 * frac(float3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
}

// simplex noise from https://www.shadertoy.com/view/4sc3z2
float noise(float3 p)
{
    const float K1 = 0.333333333;
    const float K2 = 0.166666667;
    
    float3 i = floor(p + (p.x + p.y + p.z) * K1);
    float3 d0 = p - (i - (i.x + i.y + i.z) * K2);
    
    // thx nikita: https://www.shadertoy.com/view/XsX3zB
    float3 e = step(float3(0.0,0.0,0.0), d0 - d0.yzx);
	float3 i1 = e * (1.0 - e.zxy);
	float3 i2 = 1.0 - e.zxy * (1.0 - e);
    
    float3 d1 = d0 - (i1 - 1.0 * K2);
    float3 d2 = d0 - (i2 - 2.0 * K2);
    float3 d3 = d0 - (1.0 - 3.0 * K2);
    
    float4 h = max(0.6 - float4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0);
    float4 n = h * h * h * h * float4(dot(d0, _hash33(i)), dot(d1, _hash33(i + i1)), dot(d2, _hash33(i + i2)), dot(d3, _hash33(i + 1.0)));
    
    return dot(float4(31.316,31.316,31.316,31.316), n);
}

float fractalNoise(float3 p, float falloff, int iterations) {
    float v = 0.0;
    float amp = 1.0;
    float invFalloff = 1.0/falloff;
    for (int i=0; i<10; i++) {
        v += noise(p)*amp;
	if (i>=iterations) break;
        amp *= invFalloff;
        p *= falloff;
    }
    return v;
} 

float fractalNoise(float3 p) {
    return fractalNoise(p, 2.0, 5);
}

// Adapted from IQ's usage at https://www.shadertoy.com/view/lllXz4
// Spherical Fibonnacci points, Benjamin Keinert, Matthias Innmann,
// Michael Sanger and Marc Stamminger

const float PHI = 1.61803398875;

float4 sphericalDistribution( float3 p, float n )
{
    p = normalize(p);
    float m = 1.0 - 1.0/n;

    float phi = min(atan2(p.y, p.x), PI), cosTheta = p.z;

    float k = max(2.0, floor( log(n * PI * sqrt(5.0) * (1.0 - cosTheta*cosTheta))/ log(PHI+1.0)));
    float Fk = pow(PHI, k)/sqrt(5.0);
    float2 F = float2( round(Fk), round(Fk * PHI) ); // k, k+1

    float2 ka = 2.0*F/n;
    float2 kb = 2.0*PI*( frac((F+1.0)*PHI) - (PHI-1.0) );

    float2x2 iB = float2x2( ka.y, -ka.x,
    kb.y, -kb.x ) / (ka.y*kb.x - ka.x*kb.y);
    #ifdef USE_HLSL
    float2 c = floor( mul(float2(phi, cosTheta - m),iB));
    #else
    float2 c = floor( iB * float2(phi, cosTheta - m));
    #endif
    float d = 8.0;
    float j = 0.0;
    float3 bestQ = float3(0.0,0.0,8.0);
    for( int s=0; s<4; s++ )
    {
        float2 uv = float2( float(s-2*(s/2)), float(s/2) );

        float i = dot(F, uv + c); // all quantities are ingeters (can take a round() for extra safety)

        float phi = 2.0*PI*frac(i*PHI);
        float cosTheta = m - 2.0*i/n;
        float sinTheta = sqrt(1.0 - cosTheta*cosTheta);

        float3 q = float3( cos(phi)*sinTheta, sin(phi)*sinTheta, cosTheta );
        float squaredDistance = dot(q-p, q-p);
        if (squaredDistance < d)
        {
            d = squaredDistance;
            j = i;
            bestQ = q;
        }
    }
    return float4(bestQ,sqrt(d));
}

// Compute intersection of ray and SDF. You probably won't need to modify this.
float intersect(float3 ro, float3 rd, float stepFraction) {
	float t = 0.;
	for(int i = 0; i < 300; ++i) {
		float h = surfaceDistance(ro+rd*t);
		if(h < intersection_threshold || t > max_dist) break;
		t += h*stepFraction;
	}
	return t;
}

float3 getRayDirection(float3 pos) {
	return normalize(pos-_WorldSpaceCameraPos);
}

#ifndef USE_HLSL
float3 mouseIntersection(float3 pos) {
    float3 rayDirection = getRayDirection(pos);
    return mouse+rayDirection*intersect(mouse, rayDirection, 0.8);
}
#endif

// Calculate the normal of a SDF
float3 calcNormal( in float3 pos )
{
    float2 e = float2(1.0,-1.0)*0.0005;
    return normalize( e.xyy*surfaceDistance( pos + e.xyy ) + 
		      e.yyx*surfaceDistance( pos + e.yyx ) + 
		      e.yxy*surfaceDistance( pos + e.yxy ) + 
		      e.xxx*surfaceDistance( pos + e.xxx ) );
}

float simpleLighting(float3 p, float3 normal, float3 lightdir) {
    // Simple phong-like shading
    float value = clamp(dot(normal, normalize(lightdir)),0.0, 1.0);
	return value * 0.27 + 0.63;
}

float specularLighting(float3 p, float3 normal, float3 lightDirection, float shine) {
    float lamb = clamp(dot(normal,normalize(lightDirection)),0.0,1.0);
    float spec = pow(lamb, exp(10.0*shine));
    lamb = 0.4*lamb + 0.4 + 0.2*spec;
    return lamb;
}

float shadow(float3 p, float3 lightDirection, float amount) {
    float t = intersect(p+0.001*lightDirection, lightDirection, stepSize);
    return t < (max_dist - 0.1) ? 1.0-amount : 1.0;
}

// From https://www.shadertoy.com/view/XslSWl
float occlusion(float3 p,float3 n) { 
    const int AO_SAMPLES = 8;
    const float INV_AO_SAMPLES = 1.0/float(AO_SAMPLES);
    const float R = 0.9;
    const float D = 0.8;
    float r = 0.0;
    for(int i = 0; i < AO_SAMPLES; i++) {
        float f = float(i)*INV_AO_SAMPLES;
        float h = 0.05+f*R;
        float d = surfaceDistance(p + n * h) - 0.003;
        r += clamp(h*D-d,0.0,1.0) * (1.0-f);
    }    
    return clamp(1.0-r,0.0,1.0);
}


        /////////// GENERATED //////////////


float spikey(float3 p, float s) {
  //float4 sp = sphericalDistribution(p, 50.0);
  float disp = 0.0;//sp.w*0.15;
  return sphere(p, s-disp);
}

float surfaceDistance(float3 p) {
    float d = 1.0;//sphere(p, 0.3);
  
    float3 sv = float3(0.0);
    float sd = 1.0;
    int idx = 0;
    for (int i=0; i<15; i++) {
        //float tf = _Time.y*0.5;
        //float it = float(i)*3.0;
        float offy = float(i)*0.5;
  		float tm = 0.3;
        float3 pl = 0.15*float3(sin(0.73*_Time.y*tm+2.0*offy), cos(3.0*_Time.y*tm+1.5*offy), sin(2.0*_Time.y*tm+5.2*offy));
        float nd = spikey(p+pl,0.05);
        float df = abs(nd-d);
        if (df < sd) {
          sd = df; 
        }
        if (nd < d) {
          sv = pl;
          idx = i;
        }
    	d = smoothAdd(d,nd,0.06);
    }
  
     if (d < 0.1) {
      float vi = float(idx);
      float nz = fractalNoise((p+sv)*30.0)*0.005;
      //sv += nz;
      float4 sp = sphericalDistribution(p+sv, 160.0);
      float v = 0.1*(-exp(-808.0*sp.w*sp.w)+1.0)+1.0*sp.w;//1.0*pow(sp.w*0.5,0.15);//7.0*sp.w*sp.w+0.5*sp.w;
      //d += v*1.54*sd*sd;
      d += nz*0.3*sd*sd*500.0;
     }
  
  
	return d;
}

float3 shade(float3 p, float3 normal) {
    float3 lightDirection = float3(0.0, 1.0, 0.0);
    float light = simpleLighting(p, normal, lightDirection);
  
    float lt = 1.0-max(dot(-1.0*normal,getRayDirection()),0.0);
    lt = lt*lt*lt*lt*lt;
    float3 cl = float3(1.0,1.0,1.0)*0.94+1.3*lt;
    
    float3 color = cl;//float3(1.0, 1.0, 1.0);
    float occ = sqrt(occlusion(p,normal))*0.5+0.5;
	return color*light*occ;
}



        ////////////////////////////////////

        // Add instancing support for this shader. You need to check 'Enable Instancing' on materials that use the shader.
        // See https://docs.unity3d.com/Manual/GPUInstancing.html for more information about instancing.
        // #pragma instancing_options assumeuniformscaling
        UNITY_INSTANCING_BUFFER_START(Props)
            // put more per-instance properties here
        UNITY_INSTANCING_BUFFER_END(Props)

        void surf (Input IN, inout SurfaceOutputStandard o)
        {
            // Albedo comes from a texture tinted by color
            fixed4 c = tex2D (_MainTex, IN.uv_MainTex) * _Color;

    #ifdef USE_HLSL
    #define sculptureCenter mul(_Object2World, float4(0.0,0.0,0.0,1.0) ).xyz
    #endif
	float3 rayOrigin = IN.worldPos.xyz-sculptureCenter;
	float3 rayDirection = getRayDirection(IN.worldPos.xyz);
	rayOrigin -= rayDirection*2.0;
    float t = intersect(rayOrigin, rayDirection, stepSize);
    #ifdef USE_HLSL
    if(t < 20.0) {
    #else
	if(t < 2.5) {
    #endif
		float3 p = (rayOrigin + rayDirection*t);
		//float4 sp = projectionMatrix*viewMatrix*float4(p,1.0);
		float3 normal = calcNormal(p);
		float3 c = shade(p, normal);
		o.Albedo = c; 
            o.Normal = -normal;
		
	} else {
		discard;
	}

            // Metallic and smoothness come from slider variables
            o.Metallic = _Metallic;
            o.Smoothness = _Glossiness;
            o.Alpha = c.a;
        }
        ENDCG
    }
    FallBack "Diffuse"
}

