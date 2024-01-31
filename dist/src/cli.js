#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generate_1 = require("./generate");
const commander_1 = require("commander");
const package_json_1 = __importDefault(require("../package.json"));
const constants_1 = require("./constants");
const fs_1 = __importDefault(require("fs"));
const program = new commander_1.Command();
program
    .name("laravel-typegen")
    .version(package_json_1.default.version)
    .description("Generate TypeScript types from your Laravel code")
    .option("-o, --output <value>", "Output directory", constants_1.defaultOutputPath)
    .option("--laravel-enum", "Use Laravel Enum", false)
    .option("--enum-path <value>", "Path to enum files", constants_1.defaultEnumPath)
    .option("--model-path <value>", "Path to model files", constants_1.defaultModelPath)
    .option("-z, --ziggy", "Generate types for ziggy", false)
    .option("--vendor-routes", "Include routes defined by vendor packages", false)
    .option("--ignore-route-dts", "Ignore generating route.d.ts", false)
    .option("--form-request", "Generate types for FormRequests", false)
    .parse();
const options = program.opts();
console.log(`Generating types...`);
try {
    (0, generate_1.generate)(options).then(() => {
        console.log(`Types generated successfully!!`);
    });
}
catch {
    console.log("Failed to generate types.");
    if (fs_1.default.existsSync(constants_1.tmpDir)) {
        // Clean up
        fs_1.default.rmSync(constants_1.tmpDir, { recursive: true });
    }
}
