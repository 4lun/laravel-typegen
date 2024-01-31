"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.print = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function printGeneratedTS(filename, result, outputPath) {
    fs_1.default.writeFileSync(path_1.default.join(outputPath, filename), result);
}
function print(filename, result, outputPath) {
    if (!fs_1.default.existsSync(outputPath)) {
        fs_1.default.mkdirSync(outputPath, { recursive: true });
    }
    printGeneratedTS(filename, result, outputPath);
}
exports.print = print;
