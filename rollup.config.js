import babel from 'rollup-plugin-babel'
import { nodeResolve } from "@rollup/plugin-node-resolve";
import VuePlugin from 'rollup-plugin-vue'
import unassert from 'rollup-plugin-unassert';
import commonjs from "@rollup/plugin-commonjs"
import css from 'rollup-plugin-css-only' // 提取css，压缩能力不行
import CleanCSS from 'clean-css' // 压缩css
import { writeFileSync } from 'fs' // 写文件
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'
// import svg from 'rollup-plugin-vue-inline-svg';
import dts from "rollup-plugin-dts";
const extensions = [".js"];


export default [{
  input: './src/index.js',
  // output: {
  //   file: './dist/bundle.esm.js',
  //   format: 'esm', //若打包commonjs
  //   assetFileNames: "[name]-[hash][extname]"
  // },
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' }
  ],
  external: ["vue", "@vue/compiler-sfc", "./index.css"],
  plugins: [

    nodeResolve({
      browser: true,
      extensions: ['.ts', '.mjs', '.js', '.json', '.node']
    }),

    VuePlugin({ css: true }),
    babel({
      exclude: "node_modules/**",
      extensions,
      runtimeHelpers: true,
    }),

    commonjs(),

    css({
      output(style) {
        // 压缩 css 写入 dist/vue-rollup-component-template.css
        writeFileSync('./dist/index.css', new CleanCSS().minify(style).styles)
      }
    }),
    // css: false 将<style>块转换为导入语句，rollup-plugin-css-only可以提取.vue文件中的样式       
    unassert(),
    // terser()
  ],
  treeshake: {
    moduleSideEffects: false,
  }
}]