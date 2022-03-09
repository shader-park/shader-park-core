// Format is Key (Javascript function name), Value: GLSL Source
// SDFs from
// https://iquilezles.org/www/articles/distfunctions/distfunctions.htm
// Make sure to destruct the name in sculpt.js (search for DESTRUCT SDFs)

export const sdfs = {
    boxFrame: 
`float sdBoxFrame( vec3 p, vec3 b, float e )
{
    p = abs(p  )-b;
vec3 q = abs(p+e)-e;
return min(min(
    length(max(vec3(p.x,q.y,q.z),0.0))+min(max(p.x,max(q.y,q.z)),0.0),
    length(max(vec3(q.x,p.y,q.z),0.0))+min(max(q.x,max(p.y,q.z)),0.0)),
    length(max(vec3(q.x,q.y,p.z),0.0))+min(max(q.x,max(q.y,p.z)),0.0));
}`,
    link:
`float sdLink( vec3 p, float le, float r1, float r2 )
{
    vec3 q = vec3( p.x, max(abs(p.y)-le,0.0), p.z );
    return length(vec2(length(q.xy)-r1,q.z)) - r2;
}`
    }