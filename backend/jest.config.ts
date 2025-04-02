// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: './src',
  testRegex: '.*\\.spec\\.ts$',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};

export default config;
