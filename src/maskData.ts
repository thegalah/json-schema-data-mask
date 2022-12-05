import Ajv from "ajv";
import { DataMaskCalculator, IMaskOptions } from "./DataMaskCalculator";

type ObjectAssertion = (data: unknown) => asserts data is object;

const assertObject: ObjectAssertion = (data: unknown): asserts data is object => {
    if (typeof data !== "object") {
        throw new Error("maskData only accepts data of type object");
    }
};
export const maskData = (validator: Ajv, schemaKeyRef: string, data: unknown, options: IMaskOptions = {}) => {
    const rawData = data;
    assertObject(rawData);

    validator.validate(schemaKeyRef, rawData);
    if (validator.errors) {
        const calculator = new DataMaskCalculator(data as object, schemaKeyRef, options);
        validator.errors?.forEach((error) => {
            calculator.HandleValidationError(error);
        });

        return calculator.Result;
    }
    return data;
};
