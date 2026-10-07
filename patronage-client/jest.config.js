const tsJest = ['ts-jest', { tsconfig: 'tsconfig.json' }];

const common = {
  resetMocks: true,
  transform: {
    '^.+\\.tsx?$': tsJest,
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.(css|scss|sass)$': '<rootDir>/src/tests/__mocks__/styleMock.js',
    '\\.(png|svg|webp|jpe?g|gif|ico|woff2?|ttf|eot)$': '<rootDir>/src/tests/__mocks__/fileMock.js',
  },
};

module.exports = {
  projects: [
    {
      ...common,
      displayName: 'services',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/src/**/*.test.ts'],
    },
    {
      ...common,
      displayName: 'ui',
      testEnvironment: 'jest-environment-jsdom',
      testMatch: ['<rootDir>/src/**/*.test.tsx'],
      setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    },
  ],
};
