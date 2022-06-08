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
        const result = maskData(schema, data, {});
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
        const result = maskData(schema, data, {});
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
        const result = maskData(schema, data, {});
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
        const result = maskData(schema, data, { shouldMaskTypeErrors: false });
        const expected = { foo: 123 };
        expect(result).toStrictEqual(expected);
    });

    test("it should call errorCallback function for missing properties if provided", () => {
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
        const result = maskData(schema, data, { onMissingPropertyError: mockCallback });
        const expected = { foo: {} };
        expect(result).toStrictEqual(expected);
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
        const mockCallback = jest.fn(() => null);
        const data = { foo: { bar: "abc", car: 123 } };
        const result = maskData(schema, data, { onMissingPropertyError: mockCallback });
        const expected = { foo: { bar: "abc" } };
        expect(result).toStrictEqual(expected);
    });

    test("it mask data for a sample real world use case", () => {
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
        const result = maskData(schema, data, {});
        const expected = {
            username: "mock-username",
        };
        expect(result).toStrictEqual(expected);
    });
});
