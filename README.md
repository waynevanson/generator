# @waynevanson/generator

Generate data using simple stuctures and beautiful combinators.

## Installation

```sh
npm install @waynevanson/generator
yarn add @waynevanson/generator
pnpm add @waynevanson/generator
```

## Quickstart

```ts
import * as gen from "@waynevanson/generator"

interface Person {
  name: string
  age: number
  friendly: boolean
  // some people don't have eyes due to accidents and some could be albino
  eyes?: "green" | "hazel" | "brown" | "blue" | "red"
  foods: Array<string>
}

interface Food {
  name: string
  category: string
}

const name = gen
  .tuple([
    gen.constants(["james", "gregory"]),
    gen.constants(["bond", "house"]),
  ])
  .map(([first, last]) => [first, last].join(" "))

const person = gen.intersect([
  gen.required({
    name,
    age: gen.integer({ min: 0, max: 100 }),
    friendly: gen.boolean,
    // we can use generators that are not yet defined using the `lazy` combinator
    foods: gen.array(
      gen.lazy(() => food),
      { min: 1, max: 2 }
    ),
  }),
  gen.partial({
    eyes: gen.constants(["green", "hazel", "brown", "blue", "red"]),
  }),
])

// defined after `person.foods`
const food = gen.constants(["sultanas", "apricot", "wheat"])

const people = gen.array(person, { min: 5, max: 5 })

// 0 <= seed < (2**32)
const data = people.run(0)

console.log(JSON.stringify(data, null, 2))
```

The above prints the following:

```json
[
  {
    "name": "james house",
    "age": 67,
    "friendly": true,
    "foods": ["apricot", "apricot"],
    "eyes": "blue"
  },
  {
    "name": "gregory house",
    "age": 89,
    "friendly": false,
    "foods": ["sultanas", "apricot"],
    "eyes": "brown"
  },
  {
    "name": "gregory bond",
    "age": 25,
    "friendly": true,
    "foods": ["apricot"]
  },
  {
    "name": "james bond",
    "age": 2,
    "friendly": true,
    "foods": ["apricot"],
    "eyes": "green"
  },
  {
    "name": "gregory house",
    "age": 23,
    "friendly": true,
    "foods": ["sultanas", "sultanas"]
  }
]
```

## Docs

Please visit the code for more information.
The code has docs and the code examples are the tests.

## Upcoming

- Distribution options for all applicable generators (about half are done)
- Use new distrubtion pattern for integer values
- 100% test coverage and carefully considered tests
- Generated documents from code
