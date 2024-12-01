import { Hono } from "hono";
import { RadarrWebhook } from "./webhooks/RadarrWebhook.ts";
import { config } from "./utils/config.ts";

const radarrWebhookHandler = new RadarrWebhook(config);

const app = new Hono();

app.post("/webhooks/radarr", async (c) => {
  const body = await c.req.json();
  await radarrWebhookHandler.processWebhook(body);

  return c.json({ message: "OK" }, 200);
});

app.post("/webhooks/sonarr", async (c) => {
  const body = await c.req.json();
  console.log("Starting Sonarr webhook handler");
  console.log(JSON.stringify(body, null, 2));
  console.log("\n\n\n\n");

  return c.json({ message: "OK" }, 200);
});

Deno.serve(app.fetch);
