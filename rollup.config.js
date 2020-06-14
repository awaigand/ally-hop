import vue from "rollup-plugin-vue";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";

export default {
  external: ["vue"],
  input: "src/main-lib.ts",
  output: {
    format: "esm",
    file: "./dist/library.js"
  },
  plugins: [
    commonjs(),
    typescript({
      experimentalDecorators: true,
      module: "es2015"
    }),
    vue()
  ]
};
