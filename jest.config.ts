import { Config } from "jest"

const config: Config = {
  preset: "ts-jest/presets/js-with-ts",
  rootDir: ".",
  projects: [
    {
      displayName: "spec",
      preset: "ts-jest/presets/js-with-ts",
      testMatch: ["<rootDir>/src/**/*.spec.ts"],
      setupFilesAfterEnv: ["jest-extended/all"],
    },
    {
      displayName: "docs",
      runner: "./scripts/jest-runner-docs/entry.cjs",
      testMatch: ["<rootDir>/src/**/*.ts"],
    },
  ],
}

export default config
