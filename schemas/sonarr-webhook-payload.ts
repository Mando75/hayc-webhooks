import { z } from "zod";
import {
  SonarrApplicationUpdatePayload,
  SonarrEpisodeDeletePayload,
  SonarrEventType,
  SonarrGrabPayload,
  SonarrHealthPayload,
  SonarrImportPayload,
  SonarrManualInteractionRequiredPayload,
  SonarrRenamePayload,
  SonarrSeriesAddPayload,
  SonarrSeriesDeletePayload,
} from "./sonarr-webhook-common.ts";

export const SonarrOnGrabPayload = z.object({
  eventType: z.literal("Grab"),
}).merge(SonarrGrabPayload);

export type SonarrOnGrabPayload = z.infer<typeof SonarrOnGrabPayload>;

export const SonarrOnDownloadPayload = z.object({
  eventType: z.literal("Download"),
}).merge(SonarrImportPayload);

export type SonarrOnDownloadPayload = z.infer<typeof SonarrOnDownloadPayload>;

export const SonarrOnEpisodeFileDeletePayload = z.object({
  eventType: z.literal("EpisodeFileDelete"),
}).merge(SonarrEpisodeDeletePayload);

export type SonarrOnEpisodeFileDeletePayload = z.infer<
  typeof SonarrOnEpisodeFileDeletePayload
>;

export const SonarrOnSeriesAddPayload = z.object({
  eventType: z.literal("SeriesAdd"),
}).merge(SonarrSeriesAddPayload);

export type SonarrOnSeriesAddPayload = z.infer<typeof SonarrOnSeriesAddPayload>;

export const SonarrOnSeriesDeletePayload = z.object({
  eventType: z.literal("SeriesDelete"),
}).merge(SonarrSeriesDeletePayload);

export type SonarrOnSeriesDeletePayload = z.infer<
  typeof SonarrOnSeriesDeletePayload
>;

export const SonarrOnRenamePayload = z.object({
  eventType: z.literal("Rename"),
}).merge(SonarrRenamePayload);

export type SonarrOnRenamePayload = z.infer<typeof SonarrOnRenamePayload>;

export const SonarrOnHealthPayload = z.object({
  eventType: z.literal("Health"),
}).merge(SonarrHealthPayload);

export type SonarrOnHealthPayload = z.infer<typeof SonarrOnHealthPayload>;

export const SonarrOnHealthRestoredPayload = z.object({
  eventType: z.literal("HealthRestored"),
}).merge(SonarrHealthPayload);

export type SonarrOnHealthRestoredPayload = z.infer<
  typeof SonarrOnHealthRestoredPayload
>;

export const SonarrOnApplicationUpdatePayload = z.object({
  eventType: z.literal("ApplicationUpdate"),
}).merge(SonarrApplicationUpdatePayload);

export type SonarrOnApplicationUpdatePayload = z.infer<
  typeof SonarrOnApplicationUpdatePayload
>;

export const SonarrOnManualInteractionRequiredPayload = z.object({
  eventType: z.literal("ManualInteractionRequired"),
}).merge(SonarrManualInteractionRequiredPayload);

export type SonarrOnManualInteractionRequiredPayload = z.infer<
  typeof SonarrOnManualInteractionRequiredPayload
>;

export const SonarrOnTestPayload = z.object({
  eventType: z.literal("Test"),
}).merge(SonarrGrabPayload);

export type SonarrOnTestPayload = z.infer<typeof SonarrOnTestPayload>;

export const SonarrWebhookBase = z.object({
  eventType: SonarrEventType,
});

export type SonarrWebhookBase = z.infer<typeof SonarrWebhookBase>;

export const SonarrWebhookPayload = z.discriminatedUnion("eventType", [
  SonarrOnGrabPayload,
  SonarrOnDownloadPayload,
  SonarrOnEpisodeFileDeletePayload,
  SonarrOnSeriesAddPayload,
  SonarrOnSeriesDeletePayload,
  SonarrOnRenamePayload,
  SonarrOnHealthPayload,
  SonarrOnHealthRestoredPayload,
  SonarrOnApplicationUpdatePayload,
  SonarrOnManualInteractionRequiredPayload,
  SonarrOnTestPayload,
]);
