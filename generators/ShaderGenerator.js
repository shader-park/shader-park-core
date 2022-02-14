import {sphere, box, rect} from './sdfs.js'
import {getSpace, getRayDirection} from './ops.js'
import {union, difference, blend, intersect, mixGeo} from './modes.js'

class ShaderGenerator {
  constructor() {
    this.shaderSource = '';
    this.stack = [];
  }

  getFunctions() {

    return {
        sphere: this.sphere.bind(this),
        appendSource: this.appendSource.bind(this)
    }
  }

  sphere(radius) {
    radius = collapseToString(radius);
    // appendSource(`'length(p) - ${radius};'`);
    return sub(length(this.getSpace()), radius);
  }

  appendSource(src) {
    this.shaderSource += src;
  }
}

export function createShape() {
    return new ShaderGenerator().getFunctions()
}