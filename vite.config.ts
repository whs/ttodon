import { defineConfig } from 'vite';
// import sri from '@small-tech/vite-plugin-sri';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import license from 'rollup-plugin-license';
import * as path from 'path';

export default defineConfig({
	// plugins: [sri()],
	define: {
		__APP_NAME__: JSON.stringify(process.env.npm_package_name),
		__APP_VERSION__: JSON.stringify(process.env.npm_package_version),
	},
	esbuild: {
		banner: '/*! Third party license: vendor.LICENSE.txt */',
		legalComments: 'none',
	},
	build: {
		sourcemap: true,
		rollupOptions: {
			plugins: [
				(minifyHTML as any).default(),
				license({
					thirdParty: {
						output: path.join(
							__dirname,
							'dist',
							'assets',
							'vendor.LICENSE.txt'
						),
					},
				}),
			],
		},
	},
});
