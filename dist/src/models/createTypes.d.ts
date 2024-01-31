import ts from "typescript";
import { LaravelModelType } from "../types";
export declare const createTypes: (modelData: LaravelModelType[]) => ts.TypeAliasDeclaration[];
