

/**
 * FROM https://github.com/martinlaxenaire/three-multipass-post-processing
 *
 * Add post processing to a scene
 * Taken from https://medium.com/@luruke/simple-postprocessing-in-three-js-91936ecadfb7
 * and improved to add the ability to handle multiple passes
 *
 * To use it, simply declare:
 * `const post = new MultiPostFX({renderer: rendering});`
 *
 * Then on update, instead of:
 * `rendering.render(scene, camera);`
 * replace with:
 * `post.render(scene, camera);`
 *
 * To resize it, just use:
 * `post.resize();`
 *
 * To update a specific uniform just do:
 * `post.passes.myPassName.material.uniforms.myUniform.value = value;`
 *
 * See init params below to see how to add passes with specific shaders, uniforms, etc.
 *
 */

import {
    WebGLRenderTarget,
    OrthographicCamera,
    RGBAFormat,
    BufferGeometry,
    BufferAttribute,
    Mesh,
    Scene,
    RawShaderMaterial,
    Vector2,
} from 'three';

/**
 *
 * @params: (object)
 * renderer: (THREE.WebGLRenderer) renderer used to render your original scene
 * passes: (object) object describing the passes applied consecutively
 *  - passName (object):
 *      - format: (THREE texture constants format, optionnal) format to use for your pass texure (default to THREE.RGBAFormat)
 *      - uniforms: (object, optionnal) additional uniforms to use (see THREE Uniform)
 *      - vertexShader: (string, optionnal) vertexShader to use. Use one if you want to specify varyings to your fragment shader. Uses the default const vertexShader if none specified
 *      - fragmentShader: (string optionnal) fragmentShader to use. Uses the default const fragmentShader (that just display your scene) if none specified.
 *
 */
export class MultiPostFX {
    constructor(params) {
        this.renderer = params.renderer;

        if(!this.renderer) return;

        // three.js for .render() wants a camera, even if we're not using it :(
        this.dummyCamera = new OrthographicCamera();
        this.geometry = new BufferGeometry();

        // Triangle expressed in clip space coordinates
        const vertices = new Float32Array([
            -1.0, -1.0,
            3.0, -1.0,
            -1.0, 3.0
        ]);

        this.geometry.setAttribute('position', new BufferAttribute(vertices, 2));

        this.resolution = new Vector2();
        this.renderer.getDrawingBufferSize(this.resolution);

        // default shaders
        this.defaultVertexShader = `
            precision highp float;
            attribute vec2 position;
            void main() {
                gl_Position = vec4(position, 1.0, 1.0);
            }
        `;

        this.defaultFragmentShader = `
            precision highp float;
            uniform sampler2D uScene;
            uniform vec2 uResolution;
            void main() {
                vec2 uv = gl_FragCoord.xy / uResolution.xy;
                gl_FragColor = texture2D(uScene, uv);
            }
        `;

        // add our passes
        this.nbPasses = 0;
        this.passes = {};
        params.passes = params.passes || {};

        for(let passName in params.passes) {
            this.addPass(passName, params.passes[passName]);
        }
    }

    addPass(passName, passParams) {
        // create a pass object that will contain a scene, a render target
        // a material and its uniforms and finally a mesh
        let pass = {
            scene: new Scene(),
            target: new WebGLRenderTarget(this.resolution.x, this.resolution.y, {
                format: passParams.format || RGBAFormat, // allow transparency
                stencilBuffer: false,
                depthBuffer: true,
            }),
        };

        let uniforms = {
            uScene: { value: pass.target.texture },
            uResolution: { value: this.resolution },
        };

        // merge default uniforms with params
        if(passParams.uniforms) {
            uniforms = Object.assign(uniforms, passParams.uniforms);
        }

        pass.material = new RawShaderMaterial({
            fragmentShader: passParams.fragmentShader || this.defaultFragmentShader,
            vertexShader: passParams.vertexShader || this.defaultVertexShader,
            uniforms: uniforms
        });

        pass.mesh = new Mesh(this.geometry, pass.material);
        pass.mesh.frustumCulled = false;

        pass.scene.add(pass.mesh);

        this.passes[passName] = pass;
        this.nbPasses++;
    }

    resize() {
        this.renderer.getDrawingBufferSize(this.resolution);

        // resize all passes
        const passes = Object.keys(this.passes);
        for(let i = 0; i < this.nbPasses; i++) {
            this.passes[passes[i]].target.setSize(this.resolution.x, this.resolution.y);
            this.passes[passes[i]].material.uniforms.uResolution.value = this.resolution;
        }
    }

    render(scene, camera) {
        if(this.nbPasses === 0) {
            // no passes defined, just render the scene
            this.renderer.render(scene, camera);
        }
        else {
            const passes = Object.keys(this.passes);

            for(let i = 0; i < this.nbPasses; i++) {
                this.renderer.setRenderTarget(this.passes[passes[i]].target);
                this.renderer.render(this.passes[passes[i]].scene, this.dummyCamera);
            }
            
            // switch the renderer back to the main canvas
            this.renderer.setRenderTarget(null);
            // this.renderer.render(this.passes[passes[this.nbPasses - 1]].scene, this.dummyCamera);
        }
    }
}