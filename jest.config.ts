import type { Config } from '@jest/types';

const configuration: Config.InitialOptions = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: './coverage',
  errorOnDeprecated: true,
  setupFiles: ['./jest.setup.ts'],
}

export default configuration;
