
Compiles sculpt to threejs/glsl, sculpt-renderer/glsl, unity/hlsl  
  
### CLI usage:  
  
```npm run toThreeJS my-sculpture.js```  
or  
```yarn toOffline my-sculpture.js```  

### For development with SP website:  
  
```sp-core$ npm link```   
```sp-website$ npm link sculpture-park-core```     

### API usage:  
  The simple cli tools in the converters directory are simple examples of how the API can be used. (TODO, put more examples in readme, and examples folder)
  For now, explore the available functions in index.js, and see their implementations in the targets directory.   
   
### To add new targets:
1. Implement a class in targets that converts sculpt to the format your target requires (see existing targets for example of available tools for this)
2. Expose the functions externally in index.js
3. Implement a basic cli converter, (for now this means just copy-pasting an existing converter and swapping out the single converter function. The boilerplate could be factored out and the cli converters could be automatically generated) and use as a cli tool, or use API directly.
