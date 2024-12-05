import { SonarrOnDownloadPayload } from "../../../schemas/sonarr-webhook-payload.ts";
import { SonarrWebhookContext } from "../../SonarrWebhook.ts";
import { SonarrOnDownloadHooks } from "../../../config/sonarr.hooks.ts";
import { SonarrApi } from "../../../clients/sonarr.api.ts";
import { SonarrHistoryResource } from "../../../schemas/sonarr-history.ts";
import { tagDownloads } from "../../common/on-download/tag-outdated-downloads.common.ts";

type TagOutdatedDownloadsConfig =
  NonNullable<SonarrOnDownloadHooks>[number]["action"] extends
    "tag-outdated-downloads" ? NonNullable<SonarrOnDownloadHooks>[number]
    : never;

export function tagOutdatedDownloads(config: TagOutdatedDownloadsConfig) {
  return async (
    webhook: SonarrOnDownloadPayload,
    context: SonarrWebhookContext,
  ): Promise<void> => {
    if (!webhook.series) {
      console.error("No series found in payload");
      return;
    }
    console.log(
      `Received upgrade for ${webhook.series.title ?? `unknown series`}`,
    );

    const downloadHashes = await getDeletedDownloadHashes(
      webhook.series.id,
      context.sonarrApi,
    );
    await tagDownloads(context.qbitApi, downloadHashes, config.tag);
    return;
  };
}

async function getDeletedDownloadHashes(
  seriesId: number,
  sonarr: SonarrApi,
): Promise<Array<string>> {
  const history = await sonarr.getSeriesHistory(seriesId);

  const deletedEvents = history.filter((e) =>
    e.eventType === "episodeFileDeleted"
  );

  const importedEvents = history.filter((e) =>
    e.eventType === "downloadFolderImported" ||
    e.eventType === "seriesFolderImported"
  );

  const deletedDownloadHashes: string[] = [];

  deletedEvents.forEach((deletedEvent: SonarrHistoryResource) => {
    if (deletedEvent.data?.releaseType === "SingleEpisode") {
      const singleEpisodeResult = compareSingleEpisode(
        deletedEvent,
        importedEvents,
      );
      if (singleEpisodeResult) deletedDownloadHashes.push(singleEpisodeResult);
    } else {
      console.log(
        "Unsupported Sonarr release type: ",
        deletedEvent.data?.releaseType,
      );
    }
  });

  return deletedDownloadHashes;
}

function compareSingleEpisode(
  deletedEvent: SonarrHistoryResource,
  importedEvents: Array<SonarrHistoryResource>,
) {
  const deletedReleaseGroupName = deletedEvent.data?.releaseGroup;
  const deletedSize = deletedEvent.data?.size;
  if (!deletedReleaseGroupName || !deletedSize) {
    console.log("Missing release group or size. Skipping deleted event");
    return null;
  }

  const correlatedImportEvent = importedEvents.find((event) => {
    return event.data?.releaseType === "SingleEpisode" &&
      event.data?.releaseGroup === deletedReleaseGroupName &&
      event.data?.size === deletedSize;
  });

  if (correlatedImportEvent && correlatedImportEvent.downloadId) {
    return correlatedImportEvent.downloadId;
  }
  return null;
}

/**
 * TODO: Implement tagging of trumped season packs
 */
// function compareSeasonPack(
//   deletedEvent: SonarrHistoryResource,
//   importedEvents: Array<SonarrHistoryResource>,
// ) {}
