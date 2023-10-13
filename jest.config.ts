import { Config } from "jest"

const config: Config = {
  preset: "ts-jest/",
  rootDir: ".",
  setupFilesAfterEnv: ["./jest-setup.ts"],
}

export default config
