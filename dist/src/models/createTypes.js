"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTypes = void 0;
const typescript_1 = __importDefault(require("typescript"));
const utils_1 = require("../utils");
const keywordTypeDictionary = {
    "bigint unsigned": typescript_1.default.SyntaxKind.NumberKeyword,
    "integer unsigned": typescript_1.default.SyntaxKind.NumberKeyword,
    bigint: typescript_1.default.SyntaxKind.NumberKeyword,
    integer: typescript_1.default.SyntaxKind.NumberKeyword,
    smallint: typescript_1.default.SyntaxKind.NumberKeyword,
    boolean: typescript_1.default.SyntaxKind.BooleanKeyword,
    datetime: typescript_1.default.SyntaxKind.StringKeyword,
    date: typescript_1.default.SyntaxKind.StringKeyword,
    text: typescript_1.default.SyntaxKind.StringKeyword,
    string: typescript_1.default.SyntaxKind.StringKeyword,
};
const getKeywordType = (columnType) => {
    if (!columnType) {
        return typescript_1.default.SyntaxKind.AnyKeyword;
    }
    const keywordType = keywordTypeDictionary[columnType];
    if (keywordType)
        return keywordType;
    if (columnType.match(/string|text\(/)) {
        return typescript_1.default.SyntaxKind.StringKeyword;
    }
    return typescript_1.default.SyntaxKind.AnyKeyword;
};
const manyRelations = [
    "HasMany",
    "MorphMany",
    "HasManyThrough",
    "BelongsToMany",
];
const oneRlations = [
    "HasOne",
    "MorphOne",
    "HasOneThrough",
    "BelongsTo",
];
const getRelationNode = (relation) => {
    // many relation
    if (manyRelations.includes(relation.type)) {
        return typescript_1.default.factory.createArrayTypeNode(typescript_1.default.factory.createTypeReferenceNode(typescript_1.default.factory.createIdentifier(getClassName(relation.related)), undefined));
    }
    // one relation
    if (oneRlations.includes(relation.type)) {
        return typescript_1.default.factory.createTypeReferenceNode(typescript_1.default.factory.createIdentifier(getClassName(relation.related)), undefined);
    }
    return typescript_1.default.factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.AnyKeyword);
};
const getClassName = (namespace) => {
    return namespace.split("\\").at(-1);
};
const createAttributeType = (attribute) => {
    let node = typescript_1.default.factory.createKeywordTypeNode(getKeywordType(attribute.type));
    // Blob type
    if (attribute.type === "blob") {
        node = typescript_1.default.factory.createTypeReferenceNode(typescript_1.default.factory.createIdentifier("Blob"), undefined);
    }
    // Enum type
    if (attribute.cast && (0, utils_1.isEnum)(attribute)) {
        // Create enum type node
        node = typescript_1.default.factory.createTypeReferenceNode(typescript_1.default.factory.createIdentifier(attribute.cast.split("\\").at(-1)), undefined);
    }
    return typescript_1.default.factory.createPropertySignature(undefined, typescript_1.default.factory.createIdentifier(attribute.name), attribute.nullable
        ? typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.QuestionToken)
        : undefined, node);
};
const createTypes = (modelData) => {
    const modelNames = modelData.map((data) => data.class);
    return modelData.map((model) => typescript_1.default.factory.createTypeAliasDeclaration([typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], typescript_1.default.factory.createIdentifier(getClassName(model.class)), undefined, typescript_1.default.factory.createTypeLiteralNode([
        ...model.attributes
            .filter((attribute) => !attribute.hidden)
            .map((attribute) => createAttributeType(attribute)),
        ...model.relations
            .filter((relation) => modelNames.includes(relation.related))
            .map((relation) => typescript_1.default.factory.createPropertySignature(undefined, typescript_1.default.factory.createIdentifier((0, utils_1.convertCamelToSnake)(relation.name)), typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.QuestionToken), getRelationNode(relation))),
    ])));
};
exports.createTypes = createTypes;
