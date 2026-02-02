import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import * as path from "path";
import { terser } from "rollup-plugin-terser";
import packageJson from "./package.json";

// Paths to exclude from the bundle
const externalPaths = [
  /^.*\/node_modules\/.*$/,
  /^terriajs-cesium\/.*$/,
  /^.*@babel\/runtime.*$/,
  /^.*\/terriajs\/.*$/
];

export default {
  input: "src/index.ts",
  output: {
    format: "esm",
    dir: "dist/"
  },
  // preserveSymlinks is required to prevent rollup from expanding references to packages in yarn workspace to relative paths
  preserveSymlinks: true,
  external: (depPath) => {
    // exclude files in exclusionList from the build pipeline
    return externalPaths.some((ext) => {
      if (typeof ext === "string") {
        return depPath === ext;
      } else if (ext instanceof RegExp) {
        return ext.test(depPath);
      } else {
        return false;
      }
    });
  },
  plugins: [
    nodeResolve(),
    resolveSvgIcons(),
    typescript()
    /*terser() // enable terser if you want to minify your code */
  ]
};

/**
 * Resolve `asset/icons/*.svg` imports and transform it to be picked up by the terriamap webpack loader.
 * See: "terriamap/buildprocess/configureWebpackForPlugins.js"
 */
function resolveSvgIcons() {
  return {
    name: "resolve-svg-icons",
    resolveId(importee) {
      // rewrite `assets/icons` path to absolute path
      return importee.startsWith(path.join("assets", "icons"))
        ? path.resolve("./", importee)
        : null;
    },
    transform(code, id) {
      // Transform icon asset files to require() the original svg file
      const isIconAsset =
        id.endsWith(".svg") &&
        path.relative(path.join("assets", "icons"), path.dirname(id)) === "";

      if (isIconAsset) {
        const relativeIconPath = path.relative(path.join("."), id);
        return {
          code: `export default require("${packageJson.name}/${relativeIconPath}")`
        };
      } else {
        return null;
      }
    }
  };
}
