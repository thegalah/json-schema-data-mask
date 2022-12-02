import Ajv, { Schema } from "ajv";
import { DataMaskCalculator, IMaskOptions } from "./DataMaskCalculator";

const validator = new Ajv({ allErrors: true });

type ObjectAssertion = (data: unknown) => asserts data is object;

const assertObject: ObjectAssertion = (data: unknown): asserts data is object => {
    if (typeof data !== "object") {
        throw new Error("maskData only accepts data of type object");
    }
};
export const maskData = (jsonSchema: Schema, schemaKeyRef: string, data: unknown, options: IMaskOptions = {}) => {
    const rawData = data;
    assertObject(rawData);
    const validate = validator.compile(jsonSchema);
    validator.validate(schemaKeyRef, rawData);
    if (validator.errors) {
        const calculator = new DataMaskCalculator(data as object, options);
        validate.errors?.forEach((error) => {
            calculator.HandleValidationError(error);
        });
        return calculator.Result;
    }
    return data;
};
