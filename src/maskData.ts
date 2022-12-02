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
    validator.compile(jsonSchema);
    const schema = validator.getSchema(schemaKeyRef)?.schema.valueOf();
    if (schema === undefined) {
        throw new Error(`Could not find schema definition. Schema "${schemaKeyRef}" not found`);
    }

    validator.validate(schema, rawData);
    if (validator.errors) {
        const calculator = new DataMaskCalculator(data as object, schemaKeyRef, options);
        validator.errors?.forEach((error) => {
            calculator.HandleValidationError(error);
        });

        return calculator.Result;
    }
    return data;
};
