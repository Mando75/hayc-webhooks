import { RadarrApi } from "../../../clients/radarr.api.ts";
import { QbitApi } from "../../../clients/qbit.api.ts";
import { WebhookContext } from "../../RadarrWebhook.ts";
import { RadarrOnDownloadPayload } from "../../../schemas/radarr-webhook-payload.ts";
import { RadarrOnDownloadHooks } from "../../../schemas/config.ts";

type TagOutdatedDownloadsConfig =
  NonNullable<RadarrOnDownloadHooks>[number]["action"] extends
    "tag-outdated-downloads" ? NonNullable<RadarrOnDownloadHooks>[number]
    : never;

/**
 * Searches through the history of a movie to find downloads that were deleted
 * due to upgrade. Tags the corresponding downloads in qBittorrent with the
 * configured upgrade tag.
 *
 * @param config
 */
export function tagOutdatedDownloads(config: TagOutdatedDownloadsConfig) {
  return async (
    webhook: RadarrOnDownloadPayload,
    context: WebhookContext,
  ): Promise<void> => {
    console.log(`Received upgrade for ${webhook.movie.id}`);
    const deletedDownloadHashes = await getDeletedDownloadHashes(
      webhook,
      context.radarrApi,
    );
    await tagDownloads(
      context.qbitApi,
      deletedDownloadHashes,
      [config.tag],
    );
  };
}

/**
 * Finds downloads that were deleted due to upgrade by correlating the history
 * @param webhookPayload
 * @param radarr
 */
async function getDeletedDownloadHashes(
  webhookPayload: RadarrOnDownloadPayload,
  radarr: RadarrApi,
): Promise<string[]> {
  const history = await radarr.getMovieHistory(webhookPayload.movie.id);
  const deletedEvents = history.filter((e) =>
    e.eventType === "movieFileDeleted"
  );
  const importedEvents = history.filter((e) =>
    e.eventType === "downloadFolderImported"
  );

  const deletedDownloadHashes: string[] = [];

  for (const deletedEvent of deletedEvents) {
    // We don't get the file id or original download info in the deleted event,
    // but using a combination of the release group and size should be enough to get a match
    const deletedReleaseGroup = deletedEvent.data.releaseGroup;
    const deletedSize = deletedEvent.data.size;

    if (!deletedReleaseGroup || !deletedSize) {
      console.log(
        "Skipping deleted event without release group or size",
      );
      continue;
    }

    const correlatedImportEvent = importedEvents.find((event) =>
      event.data.releaseGroup === deletedReleaseGroup &&
      event.data.size === deletedSize
    );

    if (correlatedImportEvent && correlatedImportEvent.downloadId) {
      deletedDownloadHashes.push(correlatedImportEvent.downloadId);
    }
  }

  return deletedDownloadHashes;
}

/**
 * Tags the downloads with the configured upgrade tag
 * @param qbit
 * @param downloadHashes
 * @param tags
 */
async function tagDownloads(
  qbit: QbitApi,
  downloadHashes: string[],
  tags: string[],
): Promise<void> {
  if (downloadHashes.length === 0) {
    console.log("No obsolete downloads found");
    return;
  }

  console.log("Found the following obsolete downloads:", downloadHashes);
  console.log("Adding tag radarr-upgraded to obsolete downloads");

  await qbit.addTags(downloadHashes, tags);
  console.log("Tagging completed");
}
