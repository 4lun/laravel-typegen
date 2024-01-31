"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSource = void 0;
const typescript_1 = __importDefault(require("typescript"));
const createEnumTypes_1 = require("./createEnumTypes");
const createLarvelEnumTypes_1 = require("./createLarvelEnumTypes");
const createTypes_1 = require("./createTypes");
const createSourceFile = (modelData, enums, options) => {
    return typescript_1.default.factory.createSourceFile([
        ...(0, createTypes_1.createTypes)(modelData),
        ...(options.laravelEnum
            ? (0, createLarvelEnumTypes_1.createLaravelEnumTypes)(enums)
            : (0, createEnumTypes_1.createEnumTypes)(enums)),
    ], typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.EndOfFileToken), typescript_1.default.NodeFlags.None);
};
const createSource = (filename, modelData, enums, options) => {
    const resultFile = typescript_1.default.createSourceFile(filename, "", typescript_1.default.ScriptTarget.Latest, false, typescript_1.default.ScriptKind.TS);
    const printer = typescript_1.default.createPrinter({ newLine: typescript_1.default.NewLineKind.LineFeed });
    const result = printer.printNode(typescript_1.default.EmitHint.Unspecified, createSourceFile(modelData, enums, options), resultFile);
    return result;
};
exports.createSource = createSource;
