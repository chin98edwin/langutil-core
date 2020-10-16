module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2020: true,
		jest: true,
	},
	globals: {
		process: true,
	},
	extends: 'eslint:recommended',
	parserOptions: {
		ecmaVersion: 11,
	},
	rules: {
		quotes: ['warn', 'single'],
		semi: ['warn', 'always'],
		'no-irregular-whitespace': ['warn', {
			skipStrings: true,
			skipComments: true,
			skipRegExps: true,
			skipTemplates: true,
		}],
	},
};
