<img width="1536" alt="Shader Park HeroF Crop2" src="https://user-images.githubusercontent.com/6014011/159131472-2f26c33f-2023-4980-b6e0-3d2c5bd53d6f.png">


## The library powering [Shader Park 🔮](https://shaderpark.com)     
![Build Status](https://github.com/shader-park/shader-park-core/actions/workflows/build_test.yml/badge.svg)


Shader Park simplifies creating procedural graphics using javascript.  
With just a few lines of code, create shaders which are:
- Animated
- Interactive
- 2D or 3D

![Alt Text](https://i.imgur.com/okVONOu.gif)



### Try the [live editor ✍️](https://shaderpark.com/new)
### Browse the [Interactive Documentation 📖](https://shader-park-docs.netlify.app/references-js/)
### Build from working [Template/Example Projects 🛠️](https://github.com/shader-park/shader-park-examples)
### Join the community on [Discord 💬](https://discord.gg/vuBnVuBvvK) 

### Easily integrated with:
- webpages
- threejs
- touchdesigner
- unity (under development)

## Explore [hundreds of examples](https://shaderpark.com/explore)

![Alt Text](https://i.imgur.com/dFI9g12.gif)


### Install   
`npm install shader-park-core`

### Usage
See examples on [glitch](https://glitch.com/@torinmb/shader-park-examples)

### CLI usage:  
  
```npm run toThreeJS my-sculpture.js```    
```npm run toOffline my-sculpture.js```    
```npm run toRawSDF4Meshing my-sculpture.js```    

### For development with SP website:  
In shader-park-core repo run
```npm link```
or
```yarn link```

In shader-park-website repo run
```npm link shader-park-core```
or 
```yarn link shader-park-core```

### API usage:  
  The simple cli tools in the converters directory are simple examples of how the API can be used. (TODO, put more examples in readme, and examples folder)
  For now, explore the available functions in index.js, and see their implementations in the targets directory.   
   
### To add new targets:
1. Implement a class in targets that converts sculpt to the format your target requires (see existing targets for example of available tools for this)
2. Expose the functions externally in index.js
3. Implement a basic cli converter, (for now this means just copy-pasting an existing converter and swapping out the single converter function. The boilerplate could be factored out and the cli converters could be automatically generated) and use as a cli tool, or use API directly.
