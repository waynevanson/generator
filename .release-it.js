const version = "${version}"

module.exports = {
  plugins: {
    "@release-it/conventional-changelog": {
      path: ".",
      infile: "CHANGELOG.md",
      preset: "conventionalcommits",
    },
  },
  git: {
    push: true,
    tagName: `${version}`,
    pushRepo: "git@github.com:waynevanson/generator.git",
    commitMessage: `chore: released version ${version} [no ci]`,
    requireCommits: true,
  },
  npm: {
    publish: false,
    skipChecks: true,
  },
  github: {
    release: true,
    releaseName: `${version}`,
  },
}
