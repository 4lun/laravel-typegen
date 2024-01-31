"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertCamelToSnake = exports.isEnum = void 0;
const constants_1 = require("./constants");
// "app/Enums" -> "App-Enums"
const enumPath = constants_1.defaultEnumPath
    .split("/")
    .map((name) => name.charAt(0).toUpperCase() + name.substring(1).toLowerCase())
    .join("-");
const isEnum = (attribute, customEnumPath) => {
    return attribute.cast
        ?.replaceAll("\\", "-")
        .match(new RegExp(customEnumPath ?? enumPath));
};
exports.isEnum = isEnum;
const convertCamelToSnake = (camelCaseString) => {
    return camelCaseString.replace(/[A-Z]/g, str => `_${str.toLowerCase()}`);
};
exports.convertCamelToSnake = convertCamelToSnake;
