
module.exports = {
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.(tsx?)$",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    collectCoverageFrom: [
        "src/**/*.ts",
        "!**/node_modules/**",
        "!src/custom-typings.d.ts",
    ],
    bail: true,
    coverageThreshold: {
      global: {
        branches: 60,
        functions: 60,
        lines: 60,
        statements: 60
      }
    }
    // coverageReporters: [
    //     "json",
    //     "lcov",
    //     "text",
    //     "cobertura"
    //   ]
};