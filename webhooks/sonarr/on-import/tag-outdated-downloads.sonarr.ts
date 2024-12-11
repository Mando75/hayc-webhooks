import { SonarrOnDownloadPayload } from "../../../schemas/sonarr-webhook-payload.ts";
import { SonarrWebhookContext } from "../../SonarrWebhook.ts";
import { SonarrOnDownloadHooks } from "../../../config/sonarr.hooks.ts";
import { SonarrApi } from "../../../clients/sonarr.api.ts";
import { tagDownloads } from "../../common/on-import/tag-outdated-downloads.common.ts";
import { SonarrHistoryResource } from "../../../schemas/sonarr-history.ts";

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

    const downloadHashes = await getOutdatedDownloadHashes(
      webhook,
      context.sonarrApi,
    );
    await tagDownloads(context.qbitApi, downloadHashes, config.tag);
    return;
  };
}

async function getOutdatedDownloadHashes(
  webhook: SonarrOnDownloadPayload,
  sonarr: SonarrApi,
): Promise<Array<string>> {
  if (!webhook.series) {
    console.error("No series found in payload");
    return [];
  }
  const history =
    (await sonarr.getSeriesHistory(webhook.series.id, undefined, "grabbed"))
      .filter(
        (h) => h.eventType === "grabbed",
      );

  const currentDownloadId = webhook.downloadId;
  const currentDownloadHistoryItem = history.find(
    (h) => h.downloadId === currentDownloadId,
  );

  if (!currentDownloadHistoryItem) {
    console.error(
      `Could not find download history for download with id ${currentDownloadId}`,
    );
    return [];
  }

  const outdatedDownloads =
    currentDownloadHistoryItem.data?.releaseType === "SingleEpisode"
      ? findOutdatedDownloadsForSingleEpisode(
        history,
        currentDownloadHistoryItem,
      )
      : findOutdatedDownloadsForSeasonPack(history, currentDownloadHistoryItem);

  return outdatedDownloads.map((h) => h.downloadId).filter((id) =>
    typeof id === "string"
  );
}

/**
 * When we get a single episode release, we should not tag any season packs as outdated.
 * As such, we only want to find other single episode releases that were grabbed before the current download
 * for the same episode id.
 * @param history
 * @param currentDownload
 */
function findOutdatedDownloadsForSingleEpisode(
  history: Array<SonarrHistoryResource>,
  currentDownload: SonarrHistoryResource,
) {
  return history.filter((h) =>
    // get all grabbed releases
    h.eventType === "grabbed" &&
    // that are not the current download
    h.downloadId !== currentDownload.downloadId &&
    // that are also single episodes
    h.data?.releaseType === "SingleEpisode" &&
    // which matches the current download's season and episode number
    h.episodeId === currentDownload.episodeId &&
    // which was grabbed before the current download
    h.date.localeCompare(currentDownload.date) <= 0
  );
}

/**
 * Sonarr generates a grab event for each episode in a season pack.
 * Each grab event will have the same download id, which will prevent us
 * from marking the season pack as outdated.
 *
 * instead, we need to find any grab events that happened before the current download
 * which are for the same episode id. This should capture any single episode or season pack
 * releases that were grabbed before the current download.
 * @param history
 * @param currentDownload
 */
function findOutdatedDownloadsForSeasonPack(
  history: Array<SonarrHistoryResource>,
  currentDownload: SonarrHistoryResource,
) {
  return history.filter((h) =>
    // get all grabbed releases
    h.eventType === "grabbed" &&
    // that are not the current download
    h.downloadId !== currentDownload.downloadId &&
    // which are of the same episode
    h.episodeId === currentDownload.episodeId &&
    // which was grabbed before the current download
    h.date.localeCompare(currentDownload.date) <= 0
  );
}
