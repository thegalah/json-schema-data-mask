import { ErrorObject } from "ajv";
import jsonpointer from "jsonpointer";

export interface IMaskOptions {
    /* Controls whether type errors are masked, default: true */
    readonly shouldMaskTypeErrors?: boolean;
    /* Optional callback when there is a missing property */
    readonly onMissingProperty?: (error: ErrorObject) => void;
    /* Optional callback when there is an additional property */
    readonly onAdditionalProperty?: (error: ErrorObject) => void;
    /* Optional callback when there is a type error */
    readonly onTypeError?: (error: ErrorObject) => void;
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
                this.handleAdditionalPropertyError(error);
                break;
            case ValidMaskErrorOperations.TypeError:
                this.handleTypeError(error);
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

    private handleAdditionalPropertyError = (error: ErrorObject) => {
        const { instancePath, params } = error;
        const errorCallbackFn = this.options?.onAdditionalProperty;
        errorCallbackFn?.(error);
        this.maskPropertyFromJSONPointer(`${instancePath}/${params.additionalProperty}`);
    };

    private handleTypeError = (error: ErrorObject) => {
        const pointer = error.instancePath;
        const shouldMaskTypeErrors = this?.options?.shouldMaskTypeErrors ?? true;
        const errorCallbackFn = this.options?.onTypeError;
        errorCallbackFn?.(error);
        if (shouldMaskTypeErrors) {
            this.maskPropertyFromJSONPointer(pointer);
        }
    };

    private maskPropertyFromJSONPointer = (pointer: string) => {
        jsonpointer.set(this.data, pointer, undefined);
    };
}
