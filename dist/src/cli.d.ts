#!/usr/bin/env node
export type CLIOptions = {
    output: string;
    laravelEnum: boolean;
    enumPath: string;
    modelPath: string;
    ziggy: boolean;
    vendorRoutes: boolean;
    ignoreRouteDts: boolean;
    formRequest: boolean;
};
