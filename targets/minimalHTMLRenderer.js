
/**
 * for fast tesing
 * input - sculpt code
 * output - self-contained lightweight html which renders the sculpture
 **/

export function sculptToMinimalHTMLRenderer(spCode) {
    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <title>Shader Park</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body {
                font-family: helvetica, arial, sans-serif;
                margin: 2em;
                width: 100vw; 
                height: 100vh; 
                margin : 0px; 
                padding : 0px; 
                border : 0px; 
                background-color : white;
            }
            canvas {
                width: 100%;
                height:100%;
                margin : 0px;
                padding : 0px;
                border : 0px;
                background-color : transparent;
            }
        </style>
      </head>  
      <body>    
        <canvas class="my-canvas"></canvas>
        <script type="module">
          import {sculptToMinimalRenderer} from '../dist/shader-park-core.esm.js';
          let canvas = document.querySelector('.my-canvas');          
          // This converts your Shader Park code into a shader and renders it to the my-canvas element
          sculptToMinimalRenderer(canvas, 
            \`${spCode}\`
          );
        </script>
      </body>
    </html>`
}
