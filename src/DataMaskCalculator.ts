import { ErrorObject } from "ajv";

enum ValidMaskErrorOperations {
    AdditionalProperties = "additionalProperties",
}

export class DataMaskCalculator {
    public get Result() {
        return this.data;
    }

    public constructor(private data: object) {}

    public HandleValidationError = (error: ErrorObject) => {
        const { keyword, params } = error;
        switch (keyword) {
            case ValidMaskErrorOperations.AdditionalProperties:
                this.removeAdditionalProperty(params);
                break;
            default:
                throw new Error(`Unhandled mask operation: ${JSON.stringify(error)}`);
        }
    };

    private removeAdditionalProperty = (params: Record<"additionalProperty", string>) => {
        const { [params.additionalProperty]: _, ...result } = this.data as any;
        this.data = result;
    };
}
