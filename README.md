# JSONSchema mask

A lightweight library that takes in a JSON schema and a JSON object and ensures that extra properties are removed from the object. It requires two peer dependencies of [ajv](https://github.com/ajv-validator/ajv) and [jsonpointer](https://github.com/janl/node-jsonpointer)

## Installation

```bash
$ npm i jsonschema-mask
$ # Or
$ yarn add jsonschema-mask
```

## Usage

Usage
First, you need to validate your payload with ajv. If it's invalid then you can pass validate.errors object into better-ajv-errors.

```typescript
import Ajv from 'ajv';
import betterAjvErrors from 'better-ajv-errors';
// const Ajv = require('ajv');
// const betterAjvErrors = require('better-ajv-errors').default;
// Or
// const { default: betterAjvErrors } = require('better-ajv-errors');

// You need to pass `{ jsonPointers: true }` for older versions of ajv
const ajv = new Ajv();

// Load schema and data
const schema = ...;
const data = ...;

const validate = ajv.compile(schema);
const valid = validate(data);

if (!valid) {
  const output = betterAjvErrors(schema, data, validate.errors);
  console.log(output);
}
```
