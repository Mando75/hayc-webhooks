import { Config, ConfigSchema } from "../schemas/config.ts";

export const loadConfig = async (): Promise<Config> => {
  const configPath = Deno.env.get("CONFIG_PATH") ?? "/config/config.js";

  try {
    const config = await import(`file://${configPath}`);
    const parsed = await ConfigSchema.parseAsync(config.default);
    console.log(
      "Loaded config from",
      configPath,
      JSON.stringify(parsed, null, 2),
    );
    return parsed;
  } catch (e) {
    console.error(`Failed to load config from ${configPath}: ${e}`);
    Deno.exit(1);
  }
};

export const config = await loadConfig();
