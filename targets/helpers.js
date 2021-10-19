export function convertFunctionToString(source) {
    if (typeof source === "function") {
        source = source.toString();
        return source.slice(source.indexOf("{") + 1, source.lastIndexOf("}"));
    } else if (!(typeof source === "string")) {
        throw "your Shader Park code requires the source code to be a function, or a string"
    }
    return source;
}