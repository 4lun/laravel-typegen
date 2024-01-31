"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFormRequestTypes = void 0;
const typescript_1 = __importDefault(require("typescript"));
function getKeyword(name) {
    switch (name) {
        case "string":
            return typescript_1.default.SyntaxKind.StringKeyword;
        case "number":
            return typescript_1.default.SyntaxKind.NumberKeyword;
        case "boolean":
            return typescript_1.default.SyntaxKind.BooleanKeyword;
        case "undefined":
            return typescript_1.default.SyntaxKind.UndefinedKeyword;
        default:
            return typescript_1.default.SyntaxKind.AnyKeyword;
    }
}
function isArrayOfPrimitives(arrayValue) {
    return (typeof arrayValue === "object" &&
        "name" in arrayValue &&
        typeof arrayValue.name === "string");
}
function createArrayTypeNode(arrayValue) {
    if (isArrayOfPrimitives(arrayValue)) {
        const arrayPrimitiveType = typescript_1.default.factory.createKeywordTypeNode(getKeyword(arrayValue.name));
        return typescript_1.default.factory.createArrayTypeNode(arrayPrimitiveType);
    }
    const arrayElementType = createTypeNodeFromFields(arrayValue);
    return typescript_1.default.factory.createArrayTypeNode(arrayElementType);
}
function createTypeNodeForValue(value) {
    if (typeof value === "object" && !("name" in value)) {
        return createTypeNodeFromFields(value);
    }
    if (typeof value === "object" && "*" in value && value["*"]) {
        return createArrayTypeNode(value["*"]);
    }
    return typescript_1.default.factory.createKeywordTypeNode(getKeyword(value.name));
}
function createTypeNodeFromFields(fields) {
    if ("*" in fields && fields["*"]) {
        return createArrayTypeNode(fields["*"]);
    }
    const members = Object.entries(fields).flatMap(([name, value]) => {
        const typeNode = createTypeNodeForValue(value);
        const isRequired = !("name" in value) || value.isRequired;
        return [
            typescript_1.default.factory.createPropertySignature(undefined, name, isRequired
                ? undefined
                : typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.QuestionToken), typeNode),
        ];
    });
    return typescript_1.default.factory.createTypeLiteralNode(members.filter(Boolean));
}
function createTypeAliasDeclaration(typeName, fields) {
    return typescript_1.default.factory.createTypeAliasDeclaration([typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], typeName, undefined, createTypeNodeFromFields(fields));
}
function createFormRequestTypes(rules) {
    const sourceFile = typescript_1.default.factory.createSourceFile(Object.entries(rules).map(([key, value]) => createTypeAliasDeclaration(key, value)), typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.EndOfFileToken), typescript_1.default.NodeFlags.None);
    const printer = typescript_1.default.createPrinter({ newLine: typescript_1.default.NewLineKind.LineFeed });
    return printer.printNode(typescript_1.default.EmitHint.Unspecified, sourceFile, sourceFile);
}
exports.createFormRequestTypes = createFormRequestTypes;
