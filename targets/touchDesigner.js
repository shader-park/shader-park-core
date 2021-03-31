import {sculptToGLSL, baseUniforms, uniformsToGLSL} from '../generators/sculpt.js'
import {
    defaultVertexSource, 
    usePBRHeader,
    useHemisphereLight,
    sculptureStarterCode
} from '../glsl/glsl-lib.js'


/**
 *  TD target for GLSL and  Sculpt/JS api.
 * 
 *  TODO: make these materials 'plug in' to Touch Designer's ' PBR lighting model.
 */

let TDHeader = `
uniform vec4 uDiffuseColor;
uniform vec4 uAmbientColor;
uniform vec3 uSpecularColor;
uniform float uShininess;
uniform float uShadowStrength;
uniform vec3 uShadowColor;
uniform vec3 cameraPosition;
uniform vec3 sculptureCenter;


in Vertex
{
	vec4 color;
	vec3 worldSpacePos;
	vec3 worldSpaceNorm;
	flat int cameraIndex;
} iVert;
#define GLSL_NEED_ROUND
#define worldPos iVert.worldSpacePos
layout(location = 0) out vec4 oFragColor[TD_NUM_COLOR_BUFFERS];
`;

let TDFooter = `
void main()
{
	// This allows things such as order independent transparency
	// and Dual-Paraboloid rendering to work properly
	TDCheckDiscard();

	vec4 outcol = vec4(0.0, 0.0, 0.0, 0.0);
	vec3 diffuseSum = vec3(0.0, 0.0, 0.0);
	vec3 specularSum = vec3(0.0, 0.0, 0.0);

	vec3 worldSpaceNorm = normalize(iVert.worldSpaceNorm.xyz);
	vec3 normal = normalize(worldSpaceNorm.xyz);

	vec3 viewVec = normalize(uTDMats[iVert.cameraIndex].camInverse[3].xyz - iVert.worldSpacePos.xyz );

	// Flip the normals on backfaces
	// On most GPUs this function just return gl_FrontFacing.
	// However, some Intel GPUs on macOS have broken gl_FrontFacing behavior.
	// When one of those GPUs is detected, an alternative way
	// of determing front-facing is done using the position
	// and normal for this pixel.
	if (!TDFrontFacing(iVert.worldSpacePos.xyz, worldSpaceNorm.xyz))
	{
		normal = -normal;
	}

	// Your shader will be recompiled based on the number
	// of lights in your scene, so this continues to work
	// even if you change your lighting setup after the shader
	// has been exported from the Phong MAT
	for (int i = 0; i < TD_NUM_LIGHTS; i++)
	{
		vec3 diffuseContrib = vec3(0);
		vec3 specularContrib = vec3(0);
		TDLighting(diffuseContrib,
			specularContrib,
			i,
			iVert.worldSpacePos.xyz,
			normal,
			uShadowStrength, uShadowColor,
			viewVec,
			uShininess);
		diffuseSum += diffuseContrib;
		specularSum += specularContrib;
	}

	// Final Diffuse Contribution
	diffuseSum *= uDiffuseColor.rgb * iVert.color.rgb;
	vec3 finalDiffuse = diffuseSum;
	outcol.rgb += finalDiffuse;

	// Final Specular Contribution
	vec3 finalSpecular = vec3(0.0);
	specularSum *= uSpecularColor;
	finalSpecular += specularSum;

	outcol.rgb += finalSpecular;

	// Ambient Light Contribution
	outcol.rgb += vec3(uTDGeneral.ambientColor.rgb * uAmbientColor.rgb * iVert.color.rgb);


	// Apply fog, this does nothing if fog is disabled
	outcol = TDFog(outcol, iVert.worldSpacePos.xyz, iVert.cameraIndex);

	// Alpha Calculation
	float alpha = uDiffuseColor.a * iVert.color.a ;

	// Dithering, does nothing if dithering is disabled
	outcol = TDDither(outcol);

	outcol.rgb *= alpha;

	// Modern GL removed the implicit alpha test, so we need to apply
	// it manually here. This function does nothing if alpha test is disabled.
	TDAlphaTest(alpha);

	outcol.a = alpha;
	//oFragColor[0] = TDOutputSwizzle(outcol);

	vec3 rayOrigin = worldPos.xyz-sculptureCenter;
	vec3 rayDirection = getRayDirection();
	rayOrigin -= rayDirection*2.0;
	float t = intersect(rayOrigin, rayDirection, stepSize);
	if(t < 2.5) {
		vec3 p = (rayOrigin + rayDirection*t);
		vec3 normal = calcNormal(p);
		vec3 c = shade(p, normal);
		oFragColor[0] = TDOutputSwizzle(vec4(c, 1.0));
		
	} else {
		discard;
	}

	// TD_NUM_COLOR_BUFFERS will be set to the number of color buffers
	// active in the render. By default we want to output zero to every
	// buffer except the first one.
	for (int i = 1; i < TD_NUM_COLOR_BUFFERS; i++)
	{
		oFragColor[i] = vec4(0.0);
	}
}
`;

export function glslToTouchDesignerShaderSource(source) {
    return {
        uniforms: baseUniforms(),
        frag: TDHeader + 'const float STEP_SIZE_CONSTANT = 0.9;\n' + uniformsToGLSL(baseUniforms()) + sculptureStarterCode + source + TDFooter,
        vert: defaultVertexSource
    }
}

export function sculptToTouchDesignerShaderSource(source) {
    const src = sculptToGLSL(source);
    if (src.error) {
        console.log(src.error);
    }
    let frg = 
          TDHeader
        + usePBRHeader
        + useHemisphereLight
        + uniformsToGLSL(src.uniforms) 
        + 'const float STEP_SIZE_CONSTANT = ' + src.stepSizeConstant + ';\n'
        + sculptureStarterCode 
        + src.geoGLSL 
        + '\n' 
        + src.colorGLSL 
        + '\n' 
        + TDFooter;

    return {
        uniforms: src.uniforms,
        frag: frg,
        vert: defaultVertexSource,
        error: src.error,
        geoGLSL: src.geoGLSL,
        colorGLSL: src.colorGLSL
    };
}