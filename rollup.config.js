import svelte from 'rollup-plugin-svelte'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import fs from 'fs'

const production = !process.env.ROLLUP_WATCH

export default {
    input: 'src/client/index.js',
    output: {
        sourcemap: true,
        format: 'iife',
        name: 'app',
        file: 'public/bundle.js',
    },
    plugins: [
        svelte({
            // enable run-time checks when not in production
            dev: !production,
            // we'll extract any component CSS out into
            // a separate file — better for performance
            css: css => {
                css.write('public/bundle.css')
            },
        }),

        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration —
        // consult the documentation for details:
        // https://github.com/rollup/rollup-plugin-commonjs
        resolve({ browser: true }),
        commonjs(),

        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        !production && livereload({
            watch: 'public',
            https: {
                key: fs.readFileSync('src/server/localhost.key'),
                cert: fs.readFileSync('src/server/localhost.crt'),
            },
        }),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser(),
    ],
    watch: {
        clearScreen: false,
        include: 'src/client/**',
    },
}
