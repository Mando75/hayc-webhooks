import { SonarrApi } from "../clients/sonarr.api.ts";
import { QbitApi } from "../clients/qbit.api.ts";
import { Config } from "../schemas/config.ts";
import { tagOutdatedDownloads } from "./sonarr/on-download/tag-outdated-downloads.sonarr.ts";
import {
  SonarrOnApplicationUpdatePayload,
  SonarrOnDownloadPayload,
  SonarrOnEpisodeFileDeletePayload,
  SonarrOnGrabPayload,
  SonarrOnHealthPayload,
  SonarrOnHealthRestoredPayload,
  SonarrOnManualInteractionRequiredPayload,
  SonarrOnRenamePayload,
  SonarrOnSeriesAddPayload,
  SonarrOnSeriesDeletePayload,
  SonarrOnTestPayload,
  SonarrWebhookPayload,
} from "../schemas/sonarr-webhook-payload.ts";
import { runWebhooks } from "../util/run-webhooks.ts";

export type SonarrWebhookContext = {
  sonarrApi: SonarrApi;
  qbitApi: QbitApi;
  config: Config;
};

type WebhookFn<TPayload> = (
  payload: TPayload,
  context: SonarrWebhookContext,
) => Promise<void>;

const WebhookFunctions = {
  "_unsupported": (_hook: unknown) => (): Promise<void> => Promise.resolve(),
  "tag-outdated-downloads": tagOutdatedDownloads,
};
export class SonarrWebhook {
  private readonly config: Config;
  private onGrab: Array<WebhookFn<SonarrOnGrabPayload>>;
  private onDownload: Array<WebhookFn<SonarrOnDownloadPayload>>;
  private onImportComplete: Array<WebhookFn<SonarrOnDownloadPayload>>;
  private onEpisodeFileDelete: Array<
    WebhookFn<SonarrOnEpisodeFileDeletePayload>
  >;
  private onSeriesAdd: Array<WebhookFn<SonarrOnSeriesAddPayload>>;
  private onSeriesDelete: Array<WebhookFn<SonarrOnSeriesDeletePayload>>;
  private onRename: Array<WebhookFn<SonarrOnRenamePayload>>;
  private onManualInteractionRequired: Array<
    WebhookFn<SonarrOnManualInteractionRequiredPayload>
  >;
  private onHealth: Array<WebhookFn<SonarrOnHealthPayload>>;
  private onTest: Array<WebhookFn<SonarrOnTestPayload>>;
  private onApplicationUpdate: Array<
    WebhookFn<SonarrOnApplicationUpdatePayload>
  >;
  private onHealthRestored: Array<WebhookFn<SonarrOnHealthRestoredPayload>>;

  constructor(config: Config) {
    this.config = config;

    const { webhooks } = config.sonarr;
    this.onGrab =
      webhooks.onGrab?.map((hook) => WebhookFunctions[hook.action](hook)) ?? [];
    this.onDownload =
      webhooks.onDownload?.map((hook) => WebhookFunctions[hook.action](hook)) ??
        [];
    this.onImportComplete =
      webhooks.onImportComplete?.map((hook) =>
        WebhookFunctions[hook.action](hook)
      ) ?? [];
    this.onEpisodeFileDelete =
      webhooks.onEpisodeFileDelete?.map((hook) =>
        WebhookFunctions[hook.action](hook)
      ) ?? [];
    this.onSeriesAdd =
      webhooks.onSeriesAdd?.map((hook) =>
        WebhookFunctions[hook.action](hook)
      ) ?? [];
    this.onSeriesDelete =
      webhooks.onSeriesDelete?.map((hook) =>
        WebhookFunctions[hook.action](hook)
      ) ?? [];
    this.onRename =
      webhooks.onRename?.map((hook) => WebhookFunctions[hook.action](hook)) ??
        [];
    this.onManualInteractionRequired =
      webhooks.onManualInteractionRequired?.map((hook) =>
        WebhookFunctions[hook.action](hook)
      ) ?? [];
    this.onHealth =
      webhooks.onHealth?.map((hook) => WebhookFunctions[hook.action](hook)) ??
        [];
    this.onTest =
      webhooks.onTest?.map((hook) => WebhookFunctions[hook.action](hook)) ?? [];
    this.onApplicationUpdate =
      webhooks.onApplicationUpdate?.map((hook) =>
        WebhookFunctions[hook.action](hook)
      ) ?? [];
    this.onHealthRestored =
      webhooks.onHealthRestored?.map((hook) =>
        WebhookFunctions[hook.action](hook)
      ) ??
        [];
  }

  public async processWebhook(webhookPayload: unknown) {
    const parsingResult = SonarrWebhookPayload.safeParse(webhookPayload);
    const sonarrApi = this.getSonarrApi();
    const qbitApi = this.getQbitApi();

    const context: SonarrWebhookContext = {
      config: this.config,
      sonarrApi,
      qbitApi,
    };

    if (parsingResult.success) {
      const data = parsingResult.data;
      console.log("Received Sonarr webhook event:", data.eventType);
      switch (data.eventType) {
        case "Grab":
          return await runWebhooks(this.onGrab.map((fn) => fn(data, context)));
        case "Download": {
          const hooks = this.onDownload.map((fn) => fn(data, context)).concat(
            this.onImportComplete.map((fn) => fn(data, context)),
          );

          return await runWebhooks(hooks);
        }
        case "EpisodeFileDelete":
          return await runWebhooks(
            this.onEpisodeFileDelete.map((fn) => fn(data, context)),
          );
        case "SeriesAdd":
          return await runWebhooks(
            this.onSeriesAdd.map((fn) => fn(data, context)),
          );
        case "SeriesDelete":
          return await runWebhooks(
            this.onSeriesDelete.map((fn) => fn(data, context)),
          );
        case "Rename":
          return await runWebhooks(
            this.onRename.map((fn) => fn(data, context)),
          );
        case "ManualInteractionRequired":
          return await runWebhooks(
            this.onManualInteractionRequired.map((fn) => fn(data, context)),
          );
        case "Health":
          return await runWebhooks(
            this.onHealth.map((fn) => fn(data, context)),
          );
        case "Test":
          return await runWebhooks(this.onTest.map((fn) => fn(data, context)));
        case "ApplicationUpdate":
          return await runWebhooks(
            this.onApplicationUpdate.map((fn) => fn(data, context)),
          );
        case "HealthRestored":
          return await runWebhooks(
            this.onHealthRestored.map((fn) => fn(data, context)),
          );
        default:
          return;
      }
    } else {
      console.error("Failed to parse Sonarr webhook payload");
      console.error(JSON.stringify(parsingResult.error, null, 2));
    }
  }

  private getSonarrApi() {
    return new SonarrApi(this.config.sonarr.host, this.config.sonarr.apiKey);
  }

  private getQbitApi() {
    return new QbitApi(
      this.config.qbit.host,
      this.config.qbit.user,
      this.config.qbit.pwd,
    );
  }
}
