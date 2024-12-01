import { z } from "zod";

const unsupported = z.object({ action: z.literal("_unsupported") });

const radarrOnGrabHooks = z.array(z.discriminatedUnion("action", [unsupported]))
  .optional();
export type RadarrOnGrabHooks = z.infer<typeof radarrOnGrabHooks>;

const radarrOnDownloadHooks = z.array(z.discriminatedUnion(
  "action",
  [z.object({
    action: z.literal("tag-outdated-downloads"),
    tag: z.string().default("radarr-upgraded"),
  })],
))
  .optional();
export type RadarrOnDownloadHooks = z.infer<typeof radarrOnDownloadHooks>;

const radarrOnRenameHooks = z.array(
  z.discriminatedUnion("action", [unsupported]),
).optional();
export type RadarrOnRenameHooks = z.infer<typeof radarrOnRenameHooks>;

const radarrOnMovieAddedHooks = z.array(
  z.discriminatedUnion("action", [unsupported]),
).optional();
export type RadarrOnMovieAddedHooks = z.infer<typeof radarrOnMovieAddedHooks>;

const radarrOnMovieDeletedHooks = z.array(
  z.discriminatedUnion("action", [unsupported]),
).optional();
export type RadarrOnMovieDeletedHooks = z.infer<
  typeof radarrOnMovieDeletedHooks
>;

const radarrOnMovieFileDeletedHooks = z.array(
  z.discriminatedUnion("action", [
    unsupported,
  ]),
).optional();
export type RadarrOnMovieFileDeletedHooks = z.infer<
  typeof radarrOnMovieFileDeletedHooks
>;

const radarrOnHealthIssueHooks = z.array(
  z.discriminatedUnion("action", [unsupported]),
).optional();
export type RadarrOnHealthIssueHooks = z.infer<typeof radarrOnHealthIssueHooks>;

const radarrOnHealthRestoredHooks = z.array(
  z.discriminatedUnion("action", [unsupported]),
).optional();
export type RadarrOnHealthRestoredHooks = z.infer<
  typeof radarrOnHealthRestoredHooks
>;

const radarrOnApplicationUpdateHooks = z.array(
  z.discriminatedUnion("action", [unsupported]),
).optional();
export type RadarrOnApplicationUpdateHooks = z.infer<
  typeof radarrOnApplicationUpdateHooks
>;

const radarrOnManualInteractionRequiredHooks = z.array(
  z.discriminatedUnion("action", [unsupported]),
).optional();
export type RadarrOnManualInteractionRequiredHooks = z.infer<
  typeof radarrOnManualInteractionRequiredHooks
>;

const radarrOnTestHooks = z.array(
  z.discriminatedUnion("action", [unsupported]),
).optional();
export type RadarrOnTestHooks = z.infer<typeof radarrOnTestHooks>;

export const ConfigSchema = z.object({
  port: z.number().default(8000),
  radarr: z.object({
    host: z.string(),
    apiKey: z.string(),
    webhooks: z.object({
      onGrab: radarrOnGrabHooks,
      onDownload: radarrOnDownloadHooks,
      onRename: radarrOnRenameHooks,
      onMovieAdded: radarrOnMovieAddedHooks,
      onMovieDeleted: radarrOnMovieDeletedHooks,
      onMovieFileDeleted: radarrOnMovieFileDeletedHooks,
      onHealthIssue: radarrOnHealthIssueHooks,
      onHealthRestored: radarrOnHealthRestoredHooks,
      onApplicationUpdate: radarrOnApplicationUpdateHooks,
      onManualInteractionRequired: radarrOnManualInteractionRequiredHooks,
      onTest: radarrOnTestHooks,
    }),
  }),
  qbit: z.object({
    host: z.string(),
    user: z.string(),
    pwd: z.string(),
  }),
});

export type Config = z.infer<typeof ConfigSchema>;
