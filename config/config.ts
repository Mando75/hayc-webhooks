import { Config, ConfigSchema } from "../schemas/config.ts";

export const loadConfig = async (): Promise<Config> => {
  const configPath = Deno.env.get("CONFIG_PATH") ?? "/config/config.js";

  try {
    const config = await import(`file://${configPath}`);
    return await ConfigSchema.parseAsync(config.default);
  } catch (e) {
    console.error(`Failed to load config from ${configPath}: ${e}`);
    Deno.exit(1);
  }
};

export const config = await loadConfig();
