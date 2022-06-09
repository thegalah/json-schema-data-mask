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

```typescript
import { maskData } from "jsonschema-mask";

const schema = {
    type: "object",
    properties: {
        username: {
            type: "string",
        },
    },
    required: ["username"],
    additionalProperties: false,
};

const rawData = {
    username: "mock-username",
    password: "mock-hash",
    email: "mock-email",
};

const maskedData = maskData(schema, rawData);
/*
data now has extra properties stripped
{
    username: "mock-username",
};
*/
```
