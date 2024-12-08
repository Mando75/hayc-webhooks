import { Hono } from "hono";
import { RadarrWebhook } from "./webhooks/RadarrWebhook.ts";
import { config } from "./config/config.ts";
import { SonarrWebhook } from "./webhooks/SonarrWebhook.ts";

const radarrWebhookHandler = new RadarrWebhook(config);
const sonarrWebhookHandler = new SonarrWebhook(config);

const app = new Hono();

app.post("/webhooks/radarr", async (c) => {
  const body = await c.req.json();
  await radarrWebhookHandler.processWebhook(body);

  return c.json({ message: "OK" }, 200);
});

app.post("/webhooks/sonarr", async (c) => {
  const body = await c.req.json();
  await sonarrWebhookHandler.processWebhook(body);

  return c.json({ message: "OK" }, 200);
});

Deno.serve({ port: config.port }, app.fetch);
