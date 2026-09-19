import type { Config } from "./env.schema.js";
import { loadConfig } from "./loader.js";

export const config: Config = loadConfig();

export type { Config };
