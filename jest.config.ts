import { Config } from "jest"

const config: Config = {
  preset: "ts-jest/presets/js-with-ts",
  rootDir: ".",
  projects: [
    {
      displayName: "docs",
      runner: "./scripts/jest-runner-docs/entry.cjs",
      testMatch: ["<rootDir>/src/**/*.ts"],
    },
  ],
  passWithNoTests: true,
}

export default config
