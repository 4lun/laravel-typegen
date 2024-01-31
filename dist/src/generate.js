"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const print_1 = require("./print");
const createSource_1 = require("./models/createSource");
const createSource_2 = require("./routes/createSource");
const glob_1 = __importDefault(require("glob"));
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const constants_1 = require("./constants");
const path_1 = __importDefault(require("path"));
const laravel_zodgen_1 = require("@7nohe/laravel-zodgen");
const createFormRequestTypes_1 = require("./formRequests/createFormRequestTypes");
async function generate(options) {
    const parsedModelPath = path_1.default
        .join(options.modelPath, "**", "*.php")
        .replace(/\\/g, "/");
    const models = glob_1.default.sync(parsedModelPath);
    const modelData = [];
    const parsedEnumPath = path_1.default
        .join(options.enumPath, "**", "*.php")
        .replace(/\\/g, "/");
    const enums = glob_1.default.sync(parsedEnumPath);
    if (!fs_1.default.existsSync(constants_1.tmpDir)) {
        fs_1.default.mkdirSync(constants_1.tmpDir);
    }
    // Generate models
    for (const model of models) {
        const modelName = model
            .replace(options.modelPath.replace(/\\/g, "/") + "/", "")
            .replace(path_1.default.extname(model), ""); // remove .php extension
        createModelDirectory(modelName);
        const modelShowCommand = `php artisan model:show ${modelName} --json > ${path_1.default.join(constants_1.tmpDir, `${modelName}.json`)}`;
        try {
            (0, child_process_1.execSync)(modelShowCommand);
            const modelJson = JSON.parse(fs_1.default.readFileSync(path_1.default.join(constants_1.tmpDir, `${modelName}.json`), "utf8"));
            modelData.push(modelJson);
        }
        catch {
            console.log(`Failed to generate ${modelName}. Skipping...`);
        }
    }
    const modelSource = (0, createSource_1.createSource)(constants_1.modelFileName, modelData, enums, options);
    (0, print_1.print)(constants_1.modelFileName, modelSource, options.output ?? constants_1.defaultOutputPath);
    // Generate types for ziggy
    if (options.ziggy) {
        const routeListCommand = `php artisan route:list ${options.vendorRoutes ? "" : "--except-vendor"} --json > ${constants_1.tmpDir}/route.json`;
        (0, child_process_1.execSync)(routeListCommand);
        const routeJson = JSON.parse(fs_1.default.readFileSync(`${constants_1.tmpDir}/route.json`, "utf8"));
        const routeSource = (0, createSource_2.createRouteParamsSource)(constants_1.routeParamsFileName, routeJson, options);
        (0, print_1.print)(constants_1.routeParamsFileName, routeSource, options.output ?? constants_1.defaultOutputPath);
        // Copy route.d.ts
        if (!options.ignoreRouteDts) {
            fs_1.default.copyFileSync(path_1.default.resolve(__dirname, "..", "templates", constants_1.indexDeclarationFileName), path_1.default.resolve(options.output ?? constants_1.defaultOutputPath, constants_1.indexDeclarationFileName));
        }
    }
    if (options.formRequest) {
        // Generate types for form requests
        const rules = (0, laravel_zodgen_1.parseFormRequests)(laravel_zodgen_1.defaultFormRequestPath, true);
        const formRequestSource = (0, createFormRequestTypes_1.createFormRequestTypes)(rules);
        (0, print_1.print)(constants_1.formRequestsFileName, formRequestSource, options.output ?? constants_1.defaultOutputPath);
    }
    fs_1.default.rmSync(constants_1.tmpDir, { recursive: true });
}
exports.generate = generate;
const createModelDirectory = (modelName) => {
    const modelNameArray = modelName.split("/");
    modelNameArray.pop();
    if (modelNameArray.length > 0 &&
        !fs_1.default.existsSync(path_1.default.join(constants_1.tmpDir, ...modelNameArray))) {
        fs_1.default.mkdirSync(path_1.default.join(constants_1.tmpDir, ...modelNameArray));
    }
};
