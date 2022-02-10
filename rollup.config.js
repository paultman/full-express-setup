import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';
// import purgecss from 'rollup-plugin-purgecss';
import postcss from 'rollup-plugin-postcss';
import cssnano from 'cssnano';
import path from 'path';

export default {
  input: 'client/scripts/index.js',
  output: {
    file: 'dist/index.min.js',
    format: 'iife',
    sourcemap: process.env.NODE_ENV === 'production' ? false : 'inline',
    plugins: [process.env.NODE_ENV === 'production' && terser()],
  },
  // output: { file: 'dist/scripts/index.min.js', format: 'iife', sourcemap: 'inline', plugins: [terser()] },
  watch: {
    include: './client/**',
    exclude: './node_modules/**',
  },
  plugins: [
    postcss({
      // extract: path.resolve('dist/styles/index.min.css'),
      extract: 'index.min.css',
      plugins: [process.env.NODE_ENV === 'production' && cssnano()],
      extensions: ['.css'],
    }),
    copy({
      targets: [{ src: ['client/index.html', 'client/home.html'], dest: 'dist/' }],
    }),
  ],
};
