export function unitySurfaceShader(name, body, header, footer) {
    
    return `
    Shader "Custom/${name}"
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
${fullConv(header)}

        /////////// GENERATED //////////////

${fullConv(body)}

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
${fullConv(footer)}
            // Metallic and smoothness come from slider variables
            o.Metallic = _Metallic;
            o.Smoothness = _Glossiness;
            o.Alpha = c.a;
        }
        ENDCG
    }
    FallBack "Diffuse"
}

`;

}

function fullConv(src) {
    return convertGLSLtoHLSL(convertNamesToUnity(src));
}

function convertGLSLtoHLSL(src) {
    let keywords = [
        ['vec2', 'float2'],
        ['vec3', 'float3'],
        ['vec4', 'float4'],
        ['mat2', 'float2x2'],
        ['mat3', 'float3x3'],
        ['mat4', 'float4x4'],
        ['mix', 'lerp'],
        ['atan', 'atan2'],
        ['mod(', 'fmod('],
        ['fract(', 'frac(']
    ];
    return replaceALL(src,keywords);
}

function convertNamesToUnity(src) {
    let keywords = [
        ['time', '_Time.y'],
        ['gl_FragColor = vec4(c, opacity);', 'o.Albedo = c; \n            o.Normal = -normal;'],
       // ['worldPos.xyz-sculptureCenter', '_WorldSpaceCameraPos'],
        ['worldPos', 'IN.worldPos'],
        ['cameraPosition', '_WorldSpaceCameraPos']
    ];
    return replaceALL(src, keywords);
}

function replaceALL(src, lst) {
    for (let rep of lst) {
        src = src.split(rep[0]).join(rep[1]);
    }
    return src;
}
