import { Attribute } from "./types";
export declare const isEnum: (attribute: Attribute, customEnumPath?: string) => RegExpMatchArray | null | undefined;
export declare const convertCamelToSnake: (camelCaseString: string) => string;
