module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    "src/components/**/*.{js,jsx,ts,tsx}",
    "!src/components/**/*.d.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "cobertura"], 
  testEnvironment: "jsdom",
};
