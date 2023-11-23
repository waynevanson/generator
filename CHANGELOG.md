

## [14.0.0](https://github.com/waynevanson/generator/compare/13.2.1...14.0.0) (2023-11-23)


### ⚠ BREAKING CHANGES

* update many things

### Features

* update many things ([795bc47](https://github.com/waynevanson/generator/commit/795bc4796b75be1308d393d7e99f657b9ba44c2b))

## [13.2.1](https://github.com/waynevanson/generator/compare/13.2.0...13.2.1) (2023-10-24)

## [13.2.0](https://github.com/waynevanson/generator/compare/13.1.0...13.2.0) (2023-10-24)


### Features

* add `expand` combinator ([5b696b7](https://github.com/waynevanson/generator/commit/5b696b7f66e96a5804defec8211fc047bf2d77ae))

## [13.1.0](https://github.com/waynevanson/generator/compare/13.0.1...13.1.0) (2023-10-23)


### Features

* `record` no longer requires options ([f3e4f0a](https://github.com/waynevanson/generator/commit/f3e4f0a8b38476d301d57b426d6a4f72bdcba2ee))

## [13.0.1](https://github.com/waynevanson/generator/compare/13.0.0...13.0.1) (2023-10-23)

## [13.0.0](https://github.com/waynevanson/generator/compare/12.2.0...13.0.0) (2023-10-23)


### ⚠ BREAKING CHANGES

* `sequenced` and `tuple` contained duplicated code.
Please replace uses of `seqence` with `tuple`
* `sequenced` and `tuple` contained duplicated code.
Please replace uses of `seqence` with `tuple`

### Features

* remove `sequenced` ([8f65c2d](https://github.com/waynevanson/generator/commit/8f65c2d4e75bf88448cbc2c09b3eb3bdaa82b9b2))
* remove `sequenced` ([f3501bc](https://github.com/waynevanson/generator/commit/f3501bc0f7a21b5ce729a4397ba57baee650cb1a))

## [12.2.0](https://github.com/waynevanson/generator/compare/12.1.0...12.2.0) (2023-10-23)


### Features

* add `spliced` constructor ([59e8c2b](https://github.com/waynevanson/generator/commit/59e8c2b2fad954b9abaabdf2656baf2fd7fa681e))

## [12.1.0](https://github.com/waynevanson/generator/compare/12.0.0...12.1.0) (2023-10-22)


### Features

* use `sized` for `integer` and `number` ([04f657a](https://github.com/waynevanson/generator/commit/04f657a975f9d30c1af65383ea2cebcf6afd408c))

## [12.0.0](https://github.com/waynevanson/generator/compare/11.0.3...12.0.0) (2023-10-21)


### ⚠ BREAKING CHANGES

* add distribution option to `partial`

### Features

* add distribution option to `partial` ([a54d4fa](https://github.com/waynevanson/generator/commit/a54d4fa7cd98b589755474b32fe8b584a4514659))

## [11.0.3](https://github.com/waynevanson/generator/compare/11.0.2...11.0.3) (2023-10-20)


### Bug Fixes

* boolean uses constants internally ([7e4dc11](https://github.com/waynevanson/generator/commit/7e4dc11660d5f938e46ab3600d9c23b9e63f8030))

## [11.0.2](https://github.com/waynevanson/generator/compare/11.0.1...11.0.2) (2023-10-20)

## [11.0.1](https://github.com/waynevanson/generator/compare/11.0.0...11.0.1) (2023-10-20)

## [11.0.0](https://github.com/waynevanson/generator/compare/10.0.0...11.0.0) (2023-10-20)


### ⚠ BREAKING CHANGES

* distribution of default impl
* add distribution as parameter to `union`

### Features

* add distribution as parameter to `union` ([a9d863f](https://github.com/waynevanson/generator/commit/a9d863f4a486711584e5129eae4b2154cdb5f3ea))


### Bug Fixes

* add better error for bad distribution ([d15621c](https://github.com/waynevanson/generator/commit/d15621c1e19439af3c1e1d0939d5030cb3d750d3))
* distribution of default impl ([f37293c](https://github.com/waynevanson/generator/commit/f37293cd819b2935c74538975516830ebf7e3f8b))

## [10.0.0](https://github.com/waynevanson/generator/compare/9.0.0...10.0.0) (2023-10-20)


### ⚠ BREAKING CHANGES

* simplify state to be the seed only
* add distribution option for `sized`

### Features

* add distribution option for `sized` ([e04a218](https://github.com/waynevanson/generator/commit/e04a21867995a0201ae70f65a82ac1533e9bdf79))
* simplify state to be the seed only ([126ad78](https://github.com/waynevanson/generator/commit/126ad78ea511ae0ceaaec27c077bc702bea26bb0))

## [9.0.0](https://github.com/waynevanson/generator/compare/8.0.1...9.0.0) (2023-10-17)


### ⚠ BREAKING CHANGES

* lcg values as constants

### Features

* lcg values as constants ([591f2a9](https://github.com/waynevanson/generator/commit/591f2a9e23978092d990392f1aab7bb77d186824))

## [8.0.1](https://github.com/waynevanson/generator/compare/8.0.0...8.0.1) (2023-10-13)

## [8.0.0](https://github.com/waynevanson/generator/compare/7.0.5...8.0.0) (2023-10-13)


### ⚠ BREAKING CHANGES

* add `number` constructor

### Features

* add `number` constructor ([e0a8339](https://github.com/waynevanson/generator/commit/e0a8339267781606be55ae478397c30545938b06))


### Bug Fixes

* make `sized` non-uniform for low integers ([e5efb13](https://github.com/waynevanson/generator/commit/e5efb1353c72c7eedc4749fd77fbe12aabbbf9a8))

## [7.0.5](https://github.com/waynevanson/generator/compare/7.0.4...7.0.5) (2023-10-13)


### Bug Fixes

* union should return values, not eh generator ([fb5b715](https://github.com/waynevanson/generator/commit/fb5b7151802c74520ab032841612c3c7d72c4e1d))

## [7.0.4](https://github.com/waynevanson/generator/compare/7.0.3...7.0.4) (2023-10-13)

## [7.0.3](https://github.com/waynevanson/generator/compare/7.0.2...7.0.3) (2023-10-13)


### Bug Fixes

* remove dist items from ci ([f50c50a](https://github.com/waynevanson/generator/commit/f50c50a37307da1dd57beda1b2f86fc4038ad2e0))

## [7.0.2](https://github.com/waynevanson/generator/compare/7.0.1...7.0.2) (2023-10-13)


### Bug Fixes

* remove dist from git ([03ad263](https://github.com/waynevanson/generator/commit/03ad263799718dce1eec3131c2ca3c4276d1b9eb))

## [7.0.1](https://github.com/waynevanson/generator/compare/7.0.0...7.0.1) (2023-10-13)


### Bug Fixes

* dont run husky on client machine ([7f8bef8](https://github.com/waynevanson/generator/commit/7f8bef8f8f379edf733d1e6d0bfdf8fabaca3d47))

## [7.0.0](https://github.com/waynevanson/generator/compare/6.0.4...7.0.0) (2023-10-13)


### ⚠ BREAKING CHANGES

* rename `intersect` and `union` to `and` and `or`

### Features

* add intersect and union as normal fns ([5467f58](https://github.com/waynevanson/generator/commit/5467f58c35aa789b9b605bf81908e711751382f5))
* rename `intersect` and `union` to `and` and `or` ([b50971a](https://github.com/waynevanson/generator/commit/b50971aeab205019ebd645ca69cadb9e7d19e677))

## [6.0.4](https://github.com/waynevanson/generator/compare/6.0.2...6.0.4) (2023-10-12)

## [6.0.2](https://github.com/waynevanson/generator/compare/v1.0.0...6.0.2) (2023-10-11)