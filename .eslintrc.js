module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2020: true,
	},
	globals: {
		process: true,
	},
	extends: 'eslint:recommended',
	parserOptions: {
		ecmaVersion: 11,
	},
	rules: {
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
		'no-irregular-whitespace': ['error', {
			skipStrings: true,
			skipComments: true,
			skipRegExps: true,
			skipTemplates: true,
		}],
	},
};
