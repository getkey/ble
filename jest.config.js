const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.test.json');

module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	globals: {
		'ts-jest': {
			tsConfig: 'tsconfig.test.json',
		},
	},
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
};
