import { Config, Router } from "ziggy-js";
import { RouteParams } from "./param";
type CustomRouter<T> = {
	get params(): RouteParams[T] & { _query?: Record<string, string> };
	current(): Extract<keyof RouteParams, T> | undefined;
	current(
		name: Extract<keyof RouteParams, T>,
		params?: RouteParams[T] & { _query?: Record<string, string> }
	): boolean;
} & Router;
declare global {
	declare function route<T extends keyof RouteParams>(): CustomRouter<T>;
	declare function route<T extends keyof RouteParams>(
		name: T,
		params?: RouteParams[T] & { _query?: Record<string, string> },
		absolute?: boolean,
		config?: Config
	): string;
}
declare module "vue" {
	interface ComponentCustomProperties {
		route: (<T extends keyof RouteParams>() => CustomRouter<T>) &
			(<T extends keyof RouteParams>(
				name: T,
				params?: RouteParams[T] & { _query?: Record<string, string> },
				absolute?: boolean,
				config?: Config
			) => string);
	}
}
