import { ErrorObject } from "ajv";
import jsonpointer from "jsonpointer";

export interface IMaskOptions {
    readonly shouldMaskTypeErrors?: boolean;
    readonly onMissingPropertyError?: (error: ErrorObject) => void;
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
        console.log(error);
        switch (keyword) {
            case ValidMaskErrorOperations.AdditionalProperties:
                this.handleAdditionalPropertyError(params);
                break;
            case ValidMaskErrorOperations.TypeError:
                this.handleTypeError(instancePath);
                break;

            case ValidMaskErrorOperations.Required:
                this.handleTypeError(instancePath);
                break;
            default:
                throw new Error(`Unhandled mask operation: ${JSON.stringify(error)}`);
        }
    };

    private handleRequiredError = (error: ErrorObject) => {
        const errorCallbackFn = this.options?.onMissingPropertyError;
        errorCallbackFn?.(error);
    };

    private handleAdditionalPropertyError = (params: Record<"additionalProperty", string>) => {
        this.maskProperty(params.additionalProperty);
    };

    private handleTypeError = (pointer: string) => {
        const shouldMaskTypeErrors = this?.options?.shouldMaskTypeErrors ?? true;
        if (shouldMaskTypeErrors) {
            this.maskPropertyFromJSONPointer(pointer);
        }
    };

    private maskProperty = (property: string) => {
        const { [property]: _, ...result } = this.data as any;
        this.data = result;
    };

    private maskPropertyFromJSONPointer = (pointer: string) => {
        jsonpointer.set(this.data, pointer, undefined);
    };
}
