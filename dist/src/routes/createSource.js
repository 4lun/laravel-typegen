"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouteParamsSource = void 0;
const typescript_1 = __importDefault(require("typescript"));
const createTypes_1 = require("./createTypes");
const createSourceFile = (routeListData, options) => {
    return typescript_1.default.factory.createSourceFile([
        ...(0, createTypes_1.createTypes)(routeListData),
    ], typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.EndOfFileToken), typescript_1.default.NodeFlags.None);
};
const createRouteParamsSource = (filename, routeListData, options) => {
    const resultFile = typescript_1.default.createSourceFile(filename, "", typescript_1.default.ScriptTarget.Latest, false, typescript_1.default.ScriptKind.TS);
    const printer = typescript_1.default.createPrinter({ newLine: typescript_1.default.NewLineKind.LineFeed });
    const result = printer.printNode(typescript_1.default.EmitHint.Unspecified, createSourceFile(routeListData, options), resultFile);
    return result;
};
exports.createRouteParamsSource = createRouteParamsSource;
