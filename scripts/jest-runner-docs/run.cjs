const { TSDocParser, DocExcerpt, ExcerptKind } = require("@microsoft/tsdoc")
const { readFileSync } = require("node:fs")
const { transpile } = require("typescript")
const ts = require("typescript")
const path = require("node:path")

// https://jestjs.io/docs/ecmascript-modules
module.exports = function main({ config, testPath }) {
  const start = Date.now()

  const parser = new TSDocParser()

  const contents = readFileSync(testPath, { encoding: "utf8" })

  const comments = Array.from(contents.matchAll(/\/\*\*.*?\*\//gms)).flatMap(
    (a) => Array.from(a.values())
  )

  const transpilerOptions = {
    target: ts.ScriptTarget.ESNext,
    allowJs: true,
    module: ts.ModuleKind.CommonJS,
  }

  const examples = comments
    .map((example) => parser.parseString(example))
    .flatMap((context) => context.docComment.customBlocks)
    .filter((block) => block.blockTag.tagName === "@example")
    .flatMap((block) => block.content.nodes)
    .filter((node) => node.kind === "FencedCode")
    .flatMap((node) => node.getChildNodes())
    .filter((node) => node instanceof DocExcerpt)
    .filter((node) => node.excerptKind === ExcerptKind.FencedCode_Code)
    .flatMap((node) => node.content.toString())
    .map((esm) =>
      transpile(esm, transpilerOptions).replace(
        /(?!require\(")(chansheng)(?="\))/,
        "../../"
      )
    )

  const results = examples.map((js) => {
    const start = Date.now()
    try {
      // transpile to esm
      eval(js)
      const end = Date.now()
      return {
        ancestorTitles: [],
        duration: end - start,
        failureMessages: [],
        fullName: "",
        invocations: 1,
        location: null,
        numPassingAsserts: 1,
        status: "passed",
        title: "",
      }
    } catch (error) {
      const end = Date.now()
      console.log({ error })
      return {
        ancestorTitles: [],
        duration: end - start,
        failureMessages: [error],
        fullName: "",
        invocations: 1,
        location: null,
        numPassingAsserts: 0,
        status: "failed",
        title: "",
      }
    }
  })

  const end = Date.now()

  return {
    leaks: false,
    numFailingTests: results.filter((result) => result.status === "failed")
      .length,
    numPassingTests: results.filter((result) => result.status === "passed")
      .length,
    numPendingTests: 0,
    numTodoTests: 0,
    openHandles: [],
    perfStats: { start, end },
    skipped: results.length === 0,
    snapshot: {
      added: 0,
      fileDeleted: 0,
      matched: false,
      unchecked: 0,
      uncheckedKeys: 0,
      unmatched: 0,
      updated: 0,
    },
    testFilePath: testPath,
    testResults: results.length > 0 ? results : [{ status: "skipped" }],
  }
}
