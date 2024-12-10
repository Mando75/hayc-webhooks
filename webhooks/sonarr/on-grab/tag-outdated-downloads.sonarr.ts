import { SonarrOnGrabPayload } from "../../../schemas/sonarr-webhook-payload.ts";
import { SonarrWebhookContext } from "../../SonarrWebhook.ts";
import { SonarrOnGrabHooks } from "../../../config/sonarr.hooks.ts";
import { SonarrApi } from "../../../clients/sonarr.api.ts";
import { tagDownloads } from "../../common/on-grab/tag-outdated-downloads.common.ts";

type TagOutdatedDownloadsConfig =
  NonNullable<SonarrOnGrabHooks>[number]["action"] extends
    "tag-outdated-downloads" ? NonNullable<SonarrOnGrabHooks>[number]
    : never;

export function tagOutdatedDownloads(config: TagOutdatedDownloadsConfig) {
  return async (
    webhook: SonarrOnGrabPayload,
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
  webhook: SonarrOnGrabPayload,
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

  const outdatedDownloads = history.filter((h) =>
    h.downloadId !== currentDownloadId &&
    h.date.localeCompare(currentDownloadHistoryItem?.date ?? "") <= 0
  );

  return outdatedDownloads.map((h) => h.downloadId).filter((id) =>
    typeof id === "string"
  );
}
