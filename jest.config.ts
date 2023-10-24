import { Config } from "jest"

const config: Config = {
  preset: "ts-jest/",
  rootDir: ".",
  setupFilesAfterEnv: ["./jest-setup.ts"],
  coverageReporters: ["cobertura"],
}

export default config
