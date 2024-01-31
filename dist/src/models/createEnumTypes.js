"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnumTypes = exports.createEnumType = void 0;
const typescript_1 = __importDefault(require("typescript"));
const php_parser_1 = require("php-parser");
const fs_1 = __importDefault(require("fs"));
const parser = new php_parser_1.Engine({});
const getInitializer = (enumcase) => {
    const numberValue = enumcase.value;
    if (numberValue.kind === "number") {
        return typescript_1.default.factory.createNumericLiteral(numberValue.value);
    }
    return typescript_1.default.factory.createStringLiteral(enumcase.value.value);
};
const createEnumType = (enumFilePath) => {
    const phpFile = fs_1.default.readFileSync(enumFilePath);
    const ast = parser.parseCode(phpFile.toString(), enumFilePath.split("/").at(-1));
    // find Namespace
    const namespace = ast.children.find((child) => child.kind === "namespace");
    // find enum Block
    const enumBlock = namespace.children.find((child) => child.kind === "enum");
    const enumName = enumBlock.name.name;
    // get EnumCases
    const enumcases = enumBlock.body.filter((declaration) => declaration.kind === "enumcase");
    return typescript_1.default.factory.createEnumDeclaration([typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], typescript_1.default.factory.createIdentifier(enumName), enumcases.map((enumcase) => typescript_1.default.factory.createEnumMember(typescript_1.default.factory.createIdentifier(enumcase.name.name), getInitializer(enumcase))));
};
exports.createEnumType = createEnumType;
const createEnumTypes = (enumFilePaths) => {
    return enumFilePaths.map((path) => (0, exports.createEnumType)(path));
};
exports.createEnumTypes = createEnumTypes;
