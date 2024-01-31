type FieldValue = {
    name: string;
    isRequired: boolean;
    "*"?: FieldValue;
} | object;
type Fields = {
    [key: string]: FieldValue;
} | FieldValue;
export declare function createFormRequestTypes(rules: Fields): string;
export {};
