enum ValidMaskError {
    AdditionalProperties = "additionalProperties",
}

class DataMaskCalculator {
    public get Result() {
        return this.data;
    }

    public constructor(private data: unknown) {}

    public HandleValidationError = (error: string) => {};
}
