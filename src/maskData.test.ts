import Ajv from "ajv";
import { maskData } from "./maskData";

describe("maskData", () => {
    test("it should mask a single non included property", () => {
        const schema = {
            type: "object",
            properties: {
                foo: { type: "integer" },
            },
            required: ["foo"],
            additionalProperties: false,
        };
        const data = { foo: 123, bar: 456 };
        const validator = new Ajv({ allErrors: true });
        validator.compile(schema);
        const result = maskData(validator, "#", data, {});
        const expected = { foo: 123 };
        expect(result).toStrictEqual(expected);
    });

    test("it should mask a single nested property", () => {
        const schema = {
            type: "object",
            properties: {
                foo: { type: "integer" },
            },
            required: ["foo"],
            additionalProperties: false,
        };
        const data = { foo: 123, nestedBar: { a: 456, b: 789 } };
        const validator = new Ajv({ allErrors: true });
        validator.compile(schema);
        const result = maskData(validator, "#", data, {});
        const expected = { foo: 123 };
        expect(result).toStrictEqual(expected);
    });
    test("it should mask a property with mismatched type by default", () => {
        const schema = {
            type: "object",
            properties: {
                foo: { type: "string" },
            },
            required: ["foo"],
            additionalProperties: false,
        };
        const data = { foo: 123 };
        const validator = new Ajv({ allErrors: true });
        validator.compile(schema);
        const result = maskData(validator, "#", data, {});
        const expected = {};
        expect(result).toStrictEqual(expected);
    });

    test("it should not mask a property with mismatched type if configured in the options", () => {
        const schema = {
            type: "object",
            properties: {
                foo: { type: "string" },
            },
            required: ["foo"],
            additionalProperties: false,
        };
        const data = { foo: 123 };
        const validator = new Ajv({ allErrors: true });
        validator.compile(schema);
        const result = maskData(validator, "#", data, { shouldMaskTypeErrors: false });
        const expected = { foo: 123 };
        expect(result).toStrictEqual(expected);
    });

    test("it should call onMissingProperty callback function for missing properties if provided", () => {
        const schema = {
            type: "object",
            properties: {
                foo: {
                    type: "object",
                    properties: {
                        bar: {
                            type: "string",
                        },
                    },
                    required: ["bar"],
                    additionalProperties: false,
                },
            },
            required: ["foo"],
            additionalProperties: false,
        };
        const mockCallback = jest.fn(() => null);
        const data = { foo: {} };
        const validator = new Ajv({ allErrors: true });
        validator.compile(schema);
        const result = maskData(validator, "#", data, { onMissingProperty: mockCallback });
        const expected = { foo: {} };
        expect(result).toStrictEqual(expected);
        expect(mockCallback).toBeCalledTimes(1);
    });

    test("it should call onTypeError callback function for invalid property types", () => {
        const schema = {
            type: "object",
            properties: {
                foo: { type: "string" },
            },
            required: ["foo"],
            additionalProperties: false,
        };
        const data = { foo: 123 };
        const mockCallback = jest.fn(() => null);
        const validator = new Ajv({ allErrors: true });
        validator.compile(schema);
        maskData(validator, "#", data, { onTypeError: mockCallback });
        expect(mockCallback).toBeCalledTimes(1);
    });

    test("it should call onAdditionalProperty callback function for additional properties", () => {
        const schema = {
            type: "object",
            properties: {
                foo: { type: "string" },
            },
            required: ["foo"],
            additionalProperties: false,
        };
        const data = { foo: "somestring", additionalProperty: "some additional string" };
        const mockCallback = jest.fn(() => null);
        const validator = new Ajv({ allErrors: true });
        validator.compile(schema);
        maskData(validator, "#", data, { onAdditionalProperty: mockCallback });
        expect(mockCallback).toBeCalledTimes(1);
    });

    test("it can mask a nested property", () => {
        const schema = {
            type: "object",
            properties: {
                foo: {
                    type: "object",
                    properties: {
                        bar: {
                            type: "string",
                        },
                    },
                    required: ["bar"],
                    additionalProperties: false,
                },
            },
            required: ["foo"],
            additionalProperties: false,
        };
        const data = { foo: { bar: "abc", car: 123 } };
        const validator = new Ajv({ allErrors: true });
        validator.compile(schema);
        const result = maskData(validator, "#", data, {});
        const expected = { foo: { bar: "abc" } };
        expect(result).toStrictEqual(expected);
    });

    test("it masks data for a sample real world use case", () => {
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
        const data = {
            username: "mock-username",
            password: "mock-hash",
            email: "mock-email",
        };
        const validator = new Ajv({ allErrors: true });
        validator.compile(schema);
        const result = maskData(validator, "#", data, {});
        const expected = {
            username: "mock-username",
        };
        expect(result).toStrictEqual(expected);
    });

    test("it masks data for an invalid enum", () => {
        const schema = {
            type: "object",
            properties: {
                enum: {
                    type: "string",
                    enum: ["one", "two", "three"],
                },
            },
            required: ["enum"],
            additionalProperties: false,
        };
        const data = {
            enum: "invalid-value",
        };
        const validator = new Ajv({ allErrors: true });
        validator.compile(schema);
        const result = maskData(validator, "#", data, {});
        const expected = {};
        expect(result).toStrictEqual(expected);
    });

    test("it masks data using a referenced definition schema", () => {
        const schema = {
            $schema: "http://json-schema.org/draft-07/schema#",
            definitions: {
                ISampleSchema: {
                    type: "object",
                    properties: {
                        foo: { type: "integer" },
                    },
                    required: ["foo"],
                    additionalProperties: false,
                },
            },
        };
        const data = { foo: 123, bar: 456 };
        const validator = new Ajv({ allErrors: true });
        validator.compile(schema);
        const result = maskData(validator, "#/definitions/ISampleSchema", data, {});
        const expected = { foo: 123 };
        expect(result).toStrictEqual(expected);
    });

    test("it masks data using a referenced definition schema", () => {
        const schema = {
            $schema: "http://json-schema.org/draft-07/schema#",
            definitions: {
                IBasicTypesA: {
                    type: "object",
                    properties: {
                        propertyA: {
                            $ref: "#/definitions/IBaseType",
                        },
                        propertyB: {
                            $ref: "#/definitions/IBaseType",
                        },
                    },
                    required: ["propertyA", "propertyB"],
                    additionalProperties: false,
                },
                IBaseType: {
                    type: "object",
                    properties: {
                        someProperty: {
                            type: "string",
                        },
                    },
                    required: ["someProperty"],
                    additionalProperties: false,
                },
                IBasicTypesB: {
                    type: "object",
                    properties: {
                        propertyA: {
                            $ref: "#/definitions/IBaseType",
                        },
                        propertyB: {
                            $ref: "#/definitions/IBaseType",
                        },
                    },
                    required: ["propertyA", "propertyB"],
                    additionalProperties: false,
                },
            },
        };
        const data = { propertyA: { someProperty: "someprop", extraProperty: "extraprop" }, propertyB: { someProperty: "someprop" } };
        const validator = new Ajv({ allErrors: true });
        validator.compile(schema);
        const result = maskData(validator, "#/definitions/IBasicTypesB", data, {});
        const expected = { propertyA: { someProperty: "someprop" }, propertyB: { someProperty: "someprop" } };
        console.log(result);
        expect(result).toStrictEqual(expected);
    });
});
