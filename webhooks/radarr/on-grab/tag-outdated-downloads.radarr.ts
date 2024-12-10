import { RadarrOnGrabHooks } from "../../../config/radarr.hooks.ts";
import { RadarrOnGrabPayload } from "../../../schemas/radarr-webhook-payload.ts";
import { RadarrWebhookContext } from "../../RadarrWebhook.ts";
import { RadarrApi } from "../../../clients/radarr.api.ts";
import { tagDownloads } from "../../common/on-grab/tag-outdated-downloads.common.ts";

type TagOutdatedDownloadsConfig =
  NonNullable<RadarrOnGrabHooks>[number]["action"] extends
    "tag-outdated-downloads" ? NonNullable<RadarrOnGrabHooks>[number] : never;

export function tagOutdatedDownloads(config: TagOutdatedDownloadsConfig) {
  return async (
    webhook: RadarrOnGrabPayload,
    context: RadarrWebhookContext,
  ): Promise<void> => {
    console.log(`Received grab for ${webhook.movie.title}:${webhook.movie.id}`);
    const outdatedDownloadHashes = await getOutdatedDownloadHashes(
      webhook,
      context.radarrApi,
    );
    await tagDownloads(context.qbitApi, outdatedDownloadHashes, config.tag);
  };
}

async function getOutdatedDownloadHashes(
  webhook: RadarrOnGrabPayload,
  radarrApi: RadarrApi,
): Promise<Array<string>> {
  const history = (await radarrApi.getMovieHistory(webhook.movie.id, "grabbed"))
    .filter((h) => h.eventType === "grabbed");

  const currentDownloadId = webhook.downloadId;
  const currentDownloadHistoryItem = history.find((
    h,
  ) => h.downloadId === currentDownloadId);

  const outdatedDownloads = history.filter((h) =>
    h.downloadId !== currentDownloadId &&
    String(h.date).localeCompare(String(currentDownloadHistoryItem?.date)) <= 0
  );

  return outdatedDownloads.map((h) => h.downloadId).filter((id) =>
    typeof id === "string"
  );
}
