import { maskData } from "./maskData";

describe("maskData", () => {
    test("it should mask a single property", () => {
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
});
