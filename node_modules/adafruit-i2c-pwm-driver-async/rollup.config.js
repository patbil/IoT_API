import pkg from './package.json';
import resolve from 'rollup-plugin-node-resolve';

export default [
	{
		input: 'src/main.js',
		external: ['ms'],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		],
		plugins: [ resolve() ]
	}
];