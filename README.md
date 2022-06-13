# JSONSchema mask

A well tested lightweight library that takes in a JSON schema and a JSON object and ensures that extra properties are removed from the object. It requires two peer dependencies of [ajv](https://github.com/ajv-validator/ajv) and [jsonpointer](https://github.com/janl/node-jsonpointer)

## Installation

```bash
npm i jsonschema-mask
# Or
yarn add jsonschema-mask
```

## Usage

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

const maskOptions: IMaskOptions = {};

const maskedData = maskData(schema, rawData, maskOptions);
/*
data now has extra properties stripped
{
    username: "mock-username",
};
*/
```

## Options

```typescript
export interface IMaskOptions {
    /* Controls whether type errors are masked, default: true */
    readonly shouldMaskTypeErrors?: boolean;
    /* Optional callback when there is a missing property */
    readonly onMissingProperty?: (error: ErrorObject) => void;
    /* Optional callback when there is an additional property */
    readonly onAdditionalProperty?: (error: ErrorObject) => void;
    /* Optional callback when there is a type error */
    readonly onTypeError?: (error: ErrorObject) => void;
}
```
