import { maskData } from "./maskData";

describe("maskData", () => {
    // test("it should mask a single non included property", () => {
    //     const schema = {
    //         type: "object",
    //         properties: {
    //             foo: { type: "integer" },
    //         },
    //         required: ["foo"],
    //         additionalProperties: false,
    //     };
    //     const data = { foo: 123, bar: 456 };
    //     const result = maskData(schema, data, {});
    //     const expected = { foo: 123 };
    //     expect(result).toStrictEqual(expected);
    // });

    // test("it should mask a single nested property", () => {
    //     const schema = {
    //         type: "object",
    //         properties: {
    //             foo: { type: "integer" },
    //         },
    //         required: ["foo"],
    //         additionalProperties: false,
    //     };
    //     const data = { foo: 123, nestedBar: { a: 456, b: 789 } };
    //     const result = maskData(schema, data, {});
    //     const expected = { foo: 123 };
    //     expect(result).toStrictEqual(expected);
    // });
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

    // test("it should not mask a property with mismatched type if configured in the options", () => {
    //     const schema = {
    //         type: "object",
    //         properties: {
    //             foo: { type: "string" },
    //         },
    //         required: ["foo"],
    //         additionalProperties: false,
    //     };
    //     const data = { foo: 123 };
    //     const result = maskData(schema, data, { shouldMaskTypeErrors: false });
    //     const expected = { foo: 123 };
    //     expect(result).toStrictEqual(expected);
    // });
});
