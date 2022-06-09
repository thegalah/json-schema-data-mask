import { ErrorObject } from "ajv";
import jsonpointer from "jsonpointer";

export interface IMaskOptions {
    readonly shouldMaskTypeErrors?: boolean;
    readonly onMissingProperty?: (error: ErrorObject) => void;
    readonly onAdditionalProperty?: (error: ErrorObject) => void;
}

enum ValidMaskErrorOperations {
    AdditionalProperties = "additionalProperties",
    TypeError = "type",
    Required = "required",
}

export class DataMaskCalculator {
    public get Result() {
        return this.data;
    }

    public constructor(private data: object, private readonly options: IMaskOptions) {}

    public HandleValidationError = (error: ErrorObject) => {
        const { keyword, params, instancePath } = error;
        switch (keyword) {
            case ValidMaskErrorOperations.AdditionalProperties:
                this.handleAdditionalPropertyError(instancePath, params);
                break;
            case ValidMaskErrorOperations.TypeError:
                this.handleTypeError(instancePath);
                break;

            case ValidMaskErrorOperations.Required:
                this.handleRequiredError(error);
                break;
            default:
                throw new Error(`Unhandled mask operation: ${JSON.stringify(error)}`);
        }
    };

    private handleRequiredError = (error: ErrorObject) => {
        const errorCallbackFn = this.options?.onMissingProperty;
        errorCallbackFn?.(error);
    };

    private handleAdditionalPropertyError = (instancePath: string, params: Record<"additionalProperty", string>) => {
        this.maskPropertyFromJSONPointer(`${instancePath}/${params.additionalProperty}`);
    };

    private handleTypeError = (pointer: string) => {
        const shouldMaskTypeErrors = this?.options?.shouldMaskTypeErrors ?? true;
        if (shouldMaskTypeErrors) {
            this.maskPropertyFromJSONPointer(pointer);
        }
    };

    private maskPropertyFromJSONPointer = (pointer: string) => {
        jsonpointer.set(this.data, pointer, undefined);
    };
}
