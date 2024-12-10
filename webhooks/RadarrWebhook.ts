import { Config } from "../schemas/config.ts";
import { tagOutdatedDownloads } from "./radarr/on-import/tag-outdated-downloads.radarr.ts";
import { RadarrApi } from "../clients/radarr.api.ts";
import { QbitApi } from "../clients/qbit.api.ts";
import {
  RadarrOnApplicationUpdatePayload,
  RadarrOnDownloadPayload,
  RadarrOnGrabPayload,
  RadarrOnHealthIssuePayload,
  RadarrOnHealthRestoredPayload,
  RadarrOnManualInteractionRequiredPayload,
  RadarrOnMovieAddedPayload,
  RadarrOnMovieDeletePayload,
  RadarrOnMovieFileDeletePayload,
  RadarrOnRenamePayload,
  RadarrOnTestPayload,
  RadarrWebhookPayload,
} from "../schemas/radarr-webhook-payload.ts";
import { runWebhooks } from "../util/run-webhooks.ts";

export type RadarrWebhookContext = {
  config: Config;
  radarrApi: RadarrApi;
  qbitApi: QbitApi;
};

type WebhookFn<TPayload> = (
  payload: TPayload,
  context: RadarrWebhookContext,
) => Promise<void>;

const WebhookFunctions = {
  "_unsupported": (_hook: unknown) => (): Promise<void> => Promise.resolve(),
  "tag-outdated-downloads": tagOutdatedDownloads,
};

export class RadarrWebhook {
  private readonly config: Config;
  private onGrab: Array<
    WebhookFn<RadarrOnGrabPayload>
  >;
  private onDownload: Array<
    WebhookFn<RadarrOnDownloadPayload>
  >;
  private onRename: Array<
    WebhookFn<RadarrOnRenamePayload>
  >;
  private onMovieAdded: Array<
    WebhookFn<RadarrOnMovieAddedPayload>
  >;
  private onMovieFileDelete: Array<
    WebhookFn<RadarrOnMovieFileDeletePayload>
  >;
  private onMovieDelete: Array<
    WebhookFn<RadarrOnMovieDeletePayload>
  >;
  private onHealthIssue: Array<
    WebhookFn<RadarrOnHealthIssuePayload>
  >;
  private onHealthIssueRestored: Array<
    WebhookFn<RadarrOnHealthRestoredPayload>
  >;
  private onApplicationUpdate: Array<
    WebhookFn<RadarrOnApplicationUpdatePayload>
  >;

  private onManualInteractionRequired: Array<
    WebhookFn<RadarrOnManualInteractionRequiredPayload>
  >;

  private onTest: Array<WebhookFn<RadarrOnTestPayload>>;

  constructor(config: Config) {
    this.config = config;
    const { webhooks } = config.radarr;
    this.onGrab =
      webhooks.onGrab?.map((hook) => WebhookFunctions[hook.action](hook)) ?? [];
    this.onDownload =
      webhooks.onDownload?.map((hook) => WebhookFunctions[hook.action](hook)) ??
        [];
    this.onRename =
      webhooks.onRename?.map((hook) => WebhookFunctions[hook.action](hook)) ??
        [];
    this.onMovieAdded =
      webhooks.onMovieAdded?.map((hook) =>
        WebhookFunctions[hook.action](hook)
      ) ?? [];
    this.onMovieFileDelete =
      webhooks.onMovieFileDeleted?.map((hook) =>
        WebhookFunctions[hook.action](hook)
      ) ?? [];
    this.onMovieDelete =
      webhooks.onMovieDeleted?.map((hook) =>
        WebhookFunctions[hook.action](hook)
      ) ??
        [];
    this.onHealthIssue =
      webhooks.onHealthIssue?.map((hook) =>
        WebhookFunctions[hook.action](hook)
      ) ??
        [];
    this.onHealthIssueRestored =
      webhooks.onHealthRestored?.map((hook) =>
        WebhookFunctions[hook.action](hook)
      ) ??
        [];
    this.onApplicationUpdate =
      webhooks.onApplicationUpdate?.map((hook) =>
        WebhookFunctions[hook.action](hook)
      ) ?? [];
    this.onManualInteractionRequired =
      webhooks.onManualInteractionRequired?.map((hook) =>
        WebhookFunctions[hook.action](hook)
      ) ?? [];
    this.onTest =
      webhooks.onTest?.map((hook) => WebhookFunctions[hook.action](hook)) ?? [];
  }

  public async processWebhook(webhookPayload: unknown) {
    const parsingResult = RadarrWebhookPayload.safeParse(webhookPayload);
    const radarrApi = this.getRadarrApi();
    const qbitApi = this.getQbitApi();
    const context: RadarrWebhookContext = {
      config: this.config,
      radarrApi,
      qbitApi,
    };

    if (parsingResult.success) {
      const data = parsingResult.data;
      console.log("Received Radarr webhook event:", data.eventType);
      switch (data.eventType) {
        case "Grab":
          return await runWebhooks(
            this.onGrab.map((fn) => fn(data, context)),
          );
        case "Download":
          return await runWebhooks(
            this.onDownload.map((fn) => fn(data, context)),
          );
        case "Rename":
          return await runWebhooks(
            this.onRename.map((fn) => fn(data, context)),
          );
        case "MovieAdded":
          return await runWebhooks(
            this.onMovieAdded.map((fn) => fn(data, context)),
          );
        case "MovieFileDelete":
          return await runWebhooks(
            this.onMovieFileDelete.map((fn) => fn(data, context)),
          );
        case "MovieDelete":
          return await runWebhooks(
            this.onMovieDelete.map((fn) => fn(data, context)),
          );
        case "Health":
          return await runWebhooks(
            this.onHealthIssue.map((fn) => fn(data, context)),
          );
        case "HealthRestored":
          return await runWebhooks(
            this.onHealthIssueRestored.map((fn) => fn(data, context)),
          );
        case "ApplicationUpdate":
          return await runWebhooks(
            this.onApplicationUpdate.map((fn) => fn(data, context)),
          );
        case "ManualInteractionRequired":
          return await runWebhooks(
            this.onManualInteractionRequired.map((fn) => fn(data, context)),
          );
        case "Test":
          return await runWebhooks(
            this.onTest.map((fn) => fn(data, context)),
          );
        default:
          return;
      }
    } else {
      console.error("Failed to parse Radarr webhook payload:");
      console.error(JSON.stringify(parsingResult.error, null, 2));
    }
  }

  private getRadarrApi() {
    return new RadarrApi(this.config.radarr.host, this.config.radarr.apiKey);
  }

  private getQbitApi() {
    return new QbitApi(
      this.config.qbit.host,
      this.config.qbit.user,
      this.config.qbit.pwd,
    );
  }
}
