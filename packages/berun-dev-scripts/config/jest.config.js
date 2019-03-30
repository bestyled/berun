module.exports = {
    testEnvironment: "node",
    moduleDirectories: [
        "./node_modules",
        "./src"
    ],
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json"
    ],
    resolver: "@berun/dev-scripts/lib/jest/resolver.js",
    testRegex: "(/test/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "@berun/dev-scripts/lib/jest/babelTransform.js"
    },
    transformIgnorePatterns: [
        "[\\\/]node_modules[\\\/](?!(@berun|@bestatic))"
      ]
}