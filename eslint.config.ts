import antfu from '@antfu/eslint-config'

export default antfu({
  files: ["**/*.ts"],
  rules: {
    "no-nested-ternary": "error",
    "ts/explicit-function-return-type": [
      "error",
      {
        allowExpressions: true,
        allowHigherOrderFunctions: true,
      },
    ],
    "curly": ["error", "all"],
    'node/prefer-global/process': 0,
    'ts/consistent-type-definitions': 0,
    "brace-style": ["error", "1tbs", { allowSingleLine: false }],
    "unused-imports/no-unused-imports": "error",
    "no-unused-vars": ["error", { vars: "all", args: "all", ignoreRestSiblings: false, argsIgnorePattern: "^_" }],
  },
})

