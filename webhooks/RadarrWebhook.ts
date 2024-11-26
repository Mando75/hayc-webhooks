import { Config } from "../schemas/config.ts";
import { tagOutdatedDownloads } from "./radarr/on-download/tag-outdated-downloads.ts";
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

export type WebhookContext = {
  config: Config;
  radarrApi: RadarrApi;
  qbitApi: QbitApi;
};

type WebhookFn<TPayload> = (
  payload: TPayload,
  context: WebhookContext,
) => Promise<void>;

const WebhookFunctions = {
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
    this.onGrab = webhooks.onGrab?.map((hook) => WebhookFunctions[hook]) ?? [];
    this.onDownload =
      webhooks.onDownload?.map((hook) => WebhookFunctions[hook]) ?? [];
    this.onRename = webhooks.onRename?.map((hook) => WebhookFunctions[hook]) ??
      [];
    this.onMovieAdded =
      webhooks.onMovieAdded?.map((hook) => WebhookFunctions[hook]) ?? [];
    this.onMovieFileDelete =
      webhooks.onMovieFileDeleted?.map((hook) => WebhookFunctions[hook]) ?? [];
    this.onMovieDelete =
      webhooks.onMovieDeleted?.map((hook) => WebhookFunctions[hook]) ?? [];
    this.onHealthIssue =
      webhooks.onHealthIssue?.map((hook) => WebhookFunctions[hook]) ?? [];
    this.onHealthIssueRestored =
      webhooks.onHealthRestored?.map((hook) => WebhookFunctions[hook]) ?? [];
    this.onApplicationUpdate =
      webhooks.onApplicationUpdate?.map((hook) => WebhookFunctions[hook]) ?? [];
    this.onManualInteractionRequired =
      webhooks.onManualInteractionRequired?.map((hook) =>
        WebhookFunctions[hook]
      ) ?? [];
    this.onTest = webhooks.onTest?.map((hook) => WebhookFunctions[hook]) ?? [];
  }

  public async processWebhook(webhookPayload: unknown) {
    const parsingResult = RadarrWebhookPayload.safeParse(webhookPayload);
    const radarrApi = this.getRadarrApi();
    const qbitApi = await this.getQbitApi();
    const context: WebhookContext = {
      config: this.config,
      radarrApi,
      qbitApi,
    };

    if (parsingResult.success) {
      const data = parsingResult.data;
      console.log("Received Radarr webhook event:", data.eventType);
      switch (data.eventType) {
        case "Grab":
          return await this.runWebhooks(
            this.onGrab.map((fn) => fn(data, context)),
          );
        case "Download":
          return await this.runWebhooks(
            this.onDownload.map((fn) => fn(data, context)),
          );
        case "Rename":
          return await this.runWebhooks(
            this.onRename.map((fn) => fn(data, context)),
          );
        case "MovieAdded":
          return await this.runWebhooks(
            this.onMovieAdded.map((fn) => fn(data, context)),
          );
        case "MovieFileDelete":
          return await this.runWebhooks(
            this.onMovieFileDelete.map((fn) => fn(data, context)),
          );
        case "MovieDelete":
          return await this.runWebhooks(
            this.onMovieDelete.map((fn) => fn(data, context)),
          );
        case "Health":
          return await this.runWebhooks(
            this.onHealthIssue.map((fn) => fn(data, context)),
          );
        case "HealthRestored":
          return await this.runWebhooks(
            this.onHealthIssueRestored.map((fn) => fn(data, context)),
          );
        case "ApplicationUpdate":
          return await this.runWebhooks(
            this.onApplicationUpdate.map((fn) => fn(data, context)),
          );
        case "ManualInteractionRequired":
          return await this.runWebhooks(
            this.onManualInteractionRequired.map((fn) => fn(data, context)),
          );
        case "Test":
          return await this.runWebhooks(
            this.onTest.map((fn) => fn(data, context)),
          );
        default:
          return;
      }
    } else {
      console.error("Failed to parse Radarr webhook payload:");
      console.error(parsingResult.error);
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

  private async runWebhooks(webhooks: Array<Promise<void>>) {
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
}
