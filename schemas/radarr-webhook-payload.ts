import { z } from "zod";
import {
  RadarrAddedPayload,
  RadarrApplicationUpdatePayload,
  RadarrEventType,
  RadarrGrabPayload,
  RadarrHealthPayload,
  RadarrImportPayload,
  RadarrManualInteractionPayload,
  RadarrMovieDeletePayload,
  RadarrMovieFileDeletePayload,
  RadarrRenamePayload,
} from "./radarr-webhook-common.ts";

export const RadarrOnGrabPayload = z.object({
  eventType: z.literal("Grab"),
}).merge(RadarrGrabPayload);

export type RadarrOnGrabPayload = z.infer<typeof RadarrOnGrabPayload>;

export const RadarrOnDownloadPayload = z.object({
  eventType: z.literal("Download"),
}).merge(RadarrImportPayload);

export type RadarrOnDownloadPayload = z.infer<typeof RadarrOnDownloadPayload>;

export const RadarrOnRenamePayload = z.object({
  eventType: z.literal("Rename"),
}).merge(RadarrRenamePayload);

export type RadarrOnRenamePayload = z.infer<typeof RadarrOnRenamePayload>;

export const RadarrOnMovieAddedPayload = z.object({
  eventType: z.literal("MovieAdded"),
}).merge(RadarrAddedPayload);

export type RadarrOnMovieAddedPayload = z.infer<
  typeof RadarrOnMovieAddedPayload
>;

export const RadarrOnMovieFileDeletePayload = z.object({
  eventType: z.literal("MovieFileDelete"),
}).merge(RadarrMovieFileDeletePayload);

export type RadarrOnMovieFileDeletePayload = z.infer<
  typeof RadarrOnMovieFileDeletePayload
>;

export const RadarrOnMovieDeletePayload = z.object({
  eventType: z.literal("MovieDelete"),
}).merge(RadarrMovieDeletePayload);

export type RadarrOnMovieDeletePayload = z.infer<
  typeof RadarrOnMovieDeletePayload
>;

export const RadarrOnHealthIssuePayload = z.object({
  eventType: z.literal("Health"),
}).merge(RadarrHealthPayload);

export type RadarrOnHealthIssuePayload = z.infer<
  typeof RadarrOnHealthIssuePayload
>;

export const RadarrOnHealthRestoredPayload = z.object({
  eventType: z.literal("HealthRestored"),
}).merge(RadarrHealthPayload);

export type RadarrOnHealthRestoredPayload = z.infer<
  typeof RadarrOnHealthRestoredPayload
>;

export const RadarrOnApplicationUpdatePayload = z.object({
  eventType: z.literal("ApplicationUpdate"),
}).merge(RadarrApplicationUpdatePayload);

export type RadarrOnApplicationUpdatePayload = z.infer<
  typeof RadarrOnApplicationUpdatePayload
>;

export const RadarrOnManualInteractionRequiredPayload = z.object({
  eventType: z.literal("ManualInteractionRequired"),
}).merge(RadarrManualInteractionPayload);

export type RadarrOnManualInteractionRequiredPayload = z.infer<
  typeof RadarrOnManualInteractionRequiredPayload
>;

export const RadarrOnTestPayload = z.object({
  eventType: z.literal("Test"),
});

export type RadarrOnTestPayload = z.infer<typeof RadarrOnTestPayload>;

export const RadarrWebhookBase = z.object({
  eventType: RadarrEventType,
});

export type RadarrWebhookBase = z.infer<typeof RadarrWebhookBase>;

export const RadarrWebhookPayload = z.discriminatedUnion("eventType", [
  RadarrOnGrabPayload,
  RadarrOnDownloadPayload,
  RadarrOnRenamePayload,
  RadarrOnMovieAddedPayload,
  RadarrOnMovieFileDeletePayload,
  RadarrOnMovieDeletePayload,
  RadarrOnHealthIssuePayload,
  RadarrOnHealthRestoredPayload,
  RadarrOnApplicationUpdatePayload,
  RadarrOnManualInteractionRequiredPayload,
  RadarrOnTestPayload,
]);
