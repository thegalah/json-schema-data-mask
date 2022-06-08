import Ajv, { Schema } from "ajv";

const ajv = new Ajv({ allErrors: true });

interface IMaskOptions {}

export const maskData = (jsonSchema: Schema, data: unknown, options: IMaskOptions = {}) => {
    const validate = ajv.compile(jsonSchema);
    const valid = validate(data);
    if (!valid) {
        console.log(validate.errors);
    }
};
