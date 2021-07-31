import {sculptToGLSL, baseUniforms, uniformsToGLSL} from '../generators/sculpt.js'
import {
    minimalVertexSource, 
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
uniform float uShadowStrength;
uniform vec3 uShadowColor;
uniform vec4 uBaseColor;
uniform float uMetallic;
uniform float uRoughness;
uniform float uSpecularLevel;
uniform float uAmbientOcclusion;
uniform vec3 cameraPosition;
uniform sampler2D sBaseColorMap;
uniform float useTDLighting;


in Vertex
{
	vec4 color;
	vec3 worldSpacePos;
	vec3 worldSpaceNorm;
	flat int cameraIndex;
	vec2 texCoord0;
	vec3 sculptureCenter;
} iVert;

#define sculptureCenter iVert.sculptureCenter;
#define GLSL_NEED_ROUND
#define worldPos iVert.worldSpacePos
layout(location = 0) out vec4 oFragColor[TD_NUM_COLOR_BUFFERS];
out float depthTexture;
`;

let TDFooter = `
void main()
{
	// This allows things such as order independent transparency
	// and Dual-Paraboloid rendering to work properly
	TDCheckDiscard();

	// Raymarching
	vec3 rayOrigin = worldPos.xyz-sculptureCenter;
	vec3 rayDirection = getRayDirection();
	rayOrigin -= rayDirection*2.0;
	float t = intersect(rayOrigin, rayDirection, stepSize);
    depthTexture = t;

	vec4 outcol = vec4(0.0, 0.0, 0.0, 0.0);
	vec3 diffuseSum = vec3(0.0, 0.0, 0.0);
	vec3 specularSum = vec3(0.0, 0.0, 0.0);

	vec3 worldSpaceNorm = normalize(iVert.worldSpaceNorm.xyz);
	// vec3 normal = normalize(worldSpaceNorm.xyz);
	if(t < 2.5) {
		vec3 p = (rayOrigin + rayDirection*t);
		vec3 normal = calcNormal(p);
		vec3 raymarchedColor = shade(p, normal);
	
		vec3 baseColor = uBaseColor.rgb;

		// 0.08 is the value for dielectric specular that
		// Substance Designer uses for it's top-end.
		float specularLevel = 0.08 * uSpecularLevel;
		float metallic = uMetallic;

		float roughness = uRoughness;

		float ambientOcclusion = uAmbientOcclusion;

		vec3 finalBaseColor = baseColor.rgb * iVert.color.rgb;

		vec2 texCoord0 = iVert.texCoord0.st;
		vec4 baseColorMap = texture(sBaseColorMap, texCoord0.st);
		finalBaseColor *= baseColorMap.rgb;


		// A roughness of exactly 0 is not allowed
		roughness = max(roughness, 0.0001);

		vec3 pbrDiffuseColor = finalBaseColor * (1.0 - metallic);
		vec3 pbrSpecularColor = mix(vec3(specularLevel), finalBaseColor, metallic);

		vec3 viewVec = normalize(uTDMats[iVert.cameraIndex].camInverse[3].xyz - iVert.worldSpacePos.xyz );


		// Your shader will be recompiled based on the number
		// of lights in your scene, so this continues to work
		// even if you change your lighting setup after the shader
		// has been exported from the Phong MAT
		for (int i = 0; i < TD_NUM_LIGHTS; i++)
		{
			TDPBRResult res;
			res = TDLightingPBR(i,
								pbrDiffuseColor,
								pbrSpecularColor,
								iVert.worldSpacePos.xyz,
								normal,
								uShadowStrength, uShadowColor,
								viewVec,
								roughness);
			diffuseSum += res.diffuse;
			specularSum += res.specular;
		}

		// Environment lights
		for (int i = 0; i < TD_NUM_ENV_LIGHTS; i++)
		{
			TDPBRResult res;
			res = TDEnvLightingPBR(i,
						pbrDiffuseColor,
						pbrSpecularColor,
						normal,
						viewVec,
						roughness,
						ambientOcclusion);
			diffuseSum += res.diffuse;
			specularSum += res.specular;
		}
		// Final Diffuse Contribution
		vec3 finalDiffuse = diffuseSum;
		outcol.rgb += finalDiffuse;

		// Final Specular Contribution
		vec3 finalSpecular = vec3(0.0);
		finalSpecular += specularSum;

		outcol.rgb += finalSpecular;


		// Apply fog, this does nothing if fog is disabled
		outcol = TDFog(outcol, iVert.worldSpacePos.xyz, iVert.cameraIndex);

		// Alpha Calculation
		float alpha = uBaseColor.a * iVert.color.a ;

		// Dithering, does nothing if dithering is disabled
		outcol = TDDither(outcol);

		outcol.rgb *= alpha;

		// Modern GL removed the implicit alpha test, so we need to apply
		// it manually here. This function does nothing if alpha test is disabled.
		TDAlphaTest(alpha);

		outcol.a = alpha;
		outcol = mix(vec4(raymarchedColor, 1.0), outcol, useTDLighting);
		oFragColor[0] = TDOutputSwizzle(outcol);


		// TD_NUM_COLOR_BUFFERS will be set to the number of color buffers
		// active in the render. By default we want to output zero to every
		// buffer except the first one.
		for (int i = 1; i < TD_NUM_COLOR_BUFFERS; i++)
		{
			oFragColor[i] = vec4(0.0);
		}
	} else {
		discard;
	}
}
`;

export function glslToTouchDesignerShaderSource(source) {
    return {
        uniforms: baseUniforms(),
        frag: TDHeader + 'const float STEP_SIZE_CONSTANT = 0.9;\n' + 'const int MAX_ITERATIONS = 300;\n' + uniformsToGLSL(baseUniforms()) + sculptureStarterCode + source + TDFooter,
        vert: minimalVertexSource
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
		+ 'const int MAX_ITERATIONS = ' + src.maxIterations + ';\n'
        + sculptureStarterCode 
        + src.geoGLSL 
        + '\n' 
        + src.colorGLSL 
        + '\n' 
        + TDFooter;
	
	let sdf = 'const float STEP_SIZE_CONSTANT = ' + src.stepSizeConstant + ';\n'
			+ 'const int MAX_ITERATIONS = ' + src.maxIterations + ';\n'
			+ sculptureStarterCode 
			+ src.geoGLSL ;

    return {
        uniforms: src.uniforms,
        frag: frg,
        vert: minimalVertexSource,
        error: src.error,
        geoGLSL: src.geoGLSL,
        colorGLSL: src.colorGLSL,
		sdf: sdf,
		glslUniforms: uniformsToGLSL(src.uniforms) 
    };
}