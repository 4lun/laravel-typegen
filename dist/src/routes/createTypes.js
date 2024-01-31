"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTypes = void 0;
const typescript_1 = __importDefault(require("typescript"));
const createTypes = (routeListData) => {
    return [
        typescript_1.default.factory.createTypeAliasDeclaration([typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], typescript_1.default.factory.createIdentifier("RouteParams"), undefined, typescript_1.default.factory.createTypeLiteralNode(routeListData
            .filter((route) => route.name)
            .map((route) => {
            const params = Array.from(route.uri.matchAll(/\{(.*?)\}/g), param => param[1]);
            return typescript_1.default.factory.createPropertySignature(undefined, typescript_1.default.factory.createStringLiteral(route.name), undefined, typescript_1.default.factory.createTypeLiteralNode(params?.map((param) => typescript_1.default.factory.createPropertySignature(undefined, typescript_1.default.factory.createIdentifier(param), undefined, typescript_1.default.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.StringKeyword)))));
        })))
    ];
};
exports.createTypes = createTypes;
