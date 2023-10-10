import { Config } from "jest"

const config: Config = {
  preset: "ts-jest/presets/js-with-ts",
  rootDir: ".",
  projects: [
    {
      displayName: "spec",
      preset: "ts-jest/presets/js-with-ts",
      testMatch: ["<rootDir>/src/**/*.spec.ts"],
      setupFilesAfterEnv: ["./jest-setup.ts"],
    },
  ],
}

export default config
