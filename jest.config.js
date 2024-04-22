module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@middlewares/(.*)$": "<rootDir>/src/middleware/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
