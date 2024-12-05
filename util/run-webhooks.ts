export async function runWebhooks(webhooks: Array<Promise<void>>) {
  if (webhooks.length === 0) {
    console.log("No webhooks registered for this event");
    return;
  }
  console.log(`Running ${webhooks.length} webhook handlers`);
  const result = await Promise.allSettled(webhooks);
  const rejected = result.filter((r) => r.status === "rejected");
  if (rejected.length > 0) {
    console.error(`ERROR: Webhook ${rejected.length} handlers failed:`);
    console.error(rejected);
  }
}
