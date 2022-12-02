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
        const result = maskData(schema, "#", data, {});
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
        const result = maskData(schema, "#", data, {});
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
        const result = maskData(schema, "#", data, {});
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
        const result = maskData(schema, "#", data, { shouldMaskTypeErrors: false });
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
        const result = maskData(schema, "#", data, { onMissingProperty: mockCallback });
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
        maskData(schema, "#", data, { onTypeError: mockCallback });
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
        maskData(schema, "#", data, { onAdditionalProperty: mockCallback });
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
        const result = maskData(schema, "#", data, {});
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
        const result = maskData(schema, "#", data, {});
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
        const result = maskData(schema, "#", data, {});
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
        const result = maskData(schema, "#/definitions/ISampleSchema", data, {});
        const expected = { foo: 123 };
        expect(result).toStrictEqual(expected);
    });
});
