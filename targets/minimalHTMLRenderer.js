
/**
 * for fast tesing
 * input - sculpt code
 * output - self-contained lightweight html which renders the sculpture
 **/

export function sculptToMinimalHTMLRenderer(spCode, libPath) {
    return makeHTML(spCode, 'sculptToMinimalRenderer', libPath);
}

export function glslToMinimalHTMLRenderer(spCode, libPath) {
    return makeHTML(spCode, 'glslToMinimalRenderer', libPath);
}

function makeHTML(spCode, minRenderFunc, libPath) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <title>Shader Park</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
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
    import {${minRenderFunc}} from '${libPath}';
    let canvas = document.querySelector('.my-canvas');
    ${minRenderFunc}(canvas, \`${spCode}\`);          
    </script>
</body>
</html>`;
}
