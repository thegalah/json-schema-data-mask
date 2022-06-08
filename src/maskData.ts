import Ajv, { Schema } from "ajv";

const ajv = new Ajv({ allErrors: true });

interface IMaskOptions {}

export const maskData = (jsonSchema: Schema, data: unknown, options: IMaskOptions = {}) => {
    const validate = ajv.compile(jsonSchema);
    const valid = validate(data);
    if (!valid) {
        const calculator = new DataMaskCalculator(data);
        validate.errors?.forEach((error) => {
            const { params } = error;
            console.error(error);
        });
    }
    return data;
};
