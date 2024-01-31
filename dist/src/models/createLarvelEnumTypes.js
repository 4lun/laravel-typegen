"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLaravelEnumTypes = exports.createEnumType = void 0;
const typescript_1 = __importDefault(require("typescript"));
const php_parser_1 = require("php-parser");
const fs_1 = __importDefault(require("fs"));
const parser = new php_parser_1.Engine({});
const getInitializer = (constant) => {
    const numberValue = constant.value;
    if (numberValue.kind === "number") {
        return typescript_1.default.factory.createNumericLiteral(numberValue.value);
    }
    return typescript_1.default.factory.createStringLiteral(constant.value.value);
};
const createEnumType = (enumFilePath) => {
    const phpFile = fs_1.default.readFileSync(enumFilePath);
    const ast = parser.parseCode(phpFile.toString(), enumFilePath.split("/").at(-1));
    // find Namespace
    const namespace = ast.children.find((child) => child.kind === "namespace");
    // find Class Block
    const classBlock = namespace.children.find((child) => child.kind === "class");
    const className = classBlock.name.name;
    // get Constants
    const constants = classBlock.body.filter((declaration) => declaration.kind === "classconstant").map((declaration) => declaration.constants.at(0));
    return typescript_1.default.factory.createEnumDeclaration(undefined, typescript_1.default.factory.createIdentifier(className), constants.map((constant) => typescript_1.default.factory.createEnumMember(typescript_1.default.factory.createIdentifier(constant.name.name), getInitializer(constant))));
};
exports.createEnumType = createEnumType;
const createLaravelEnumTypes = (enumFilePaths) => {
    return enumFilePaths.map((path) => (0, exports.createEnumType)(path));
};
exports.createLaravelEnumTypes = createLaravelEnumTypes;
