import { ErrorObject } from "ajv";

export interface IMaskOptions {}

enum ValidMaskErrorOperations {
    AdditionalProperties = "additionalProperties",
    TypeError = "type",
}

export class DataMaskCalculator {
    public get Result() {
        return this.data;
    }

    public constructor(private data: object, private readonly options: IMaskOptions) {}

    public HandleValidationError = (error: ErrorObject) => {
        const { keyword, params } = error;
        switch (keyword) {
            case ValidMaskErrorOperations.AdditionalProperties:
                this.handleAdditionalProperty(params);
                break;
            case ValidMaskErrorOperations.TypeError:
                this.handleTypeError(params);
                break;
            default:
                throw new Error(`Unhandled mask operation: ${JSON.stringify(error)}`);
        }
    };

    private handleAdditionalProperty = (params: Record<"additionalProperty", string>) => {
        const { [params.additionalProperty]: _, ...result } = this.data as any;
        this.data = result;
    };

    private handleTypeError = (params: Record<"additionalProperty", string>) => {
        const { [params.additionalProperty]: _, ...result } = this.data as any;
        this.data = result;
    };
}
