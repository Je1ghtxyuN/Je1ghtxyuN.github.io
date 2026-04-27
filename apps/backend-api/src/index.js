import { loadRuntimeConfig } from "./config/runtime.js";
import { routeModules } from "./http/routes/index.js";

const config = loadRuntimeConfig();

console.log(
  `[backend-api scaffold] runtime prepared on port ${config.port} with ${routeModules.length} route module placeholders.`
);
