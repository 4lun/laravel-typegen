import ts from "typescript";
export declare const createEnumType: (enumFilePath: string) => ts.EnumDeclaration;
export declare const createEnumTypes: (enumFilePaths: string[]) => ts.EnumDeclaration[];
