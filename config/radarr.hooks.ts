import { z } from "zod";

export const unsupported = z.object({ action: z.literal("_unsupported") });

export const radarrOnGrabHooks = z.array(
  z.discriminatedUnion("action", [unsupported]),
)
  .optional();
export type RadarrOnGrabHooks = z.infer<typeof radarrOnGrabHooks>;

export const radarrOnDownloadHooks = z.array(z.discriminatedUnion(
  "action",
  [z.object({
    action: z.literal("tag-outdated-downloads"),
    tag: z.string().default("radarr-upgraded"),
  })],
))
  .optional();
export type RadarrOnDownloadHooks = z.infer<typeof radarrOnDownloadHooks>;

export const radarrOnRenameHooks = z.array(
  z.discriminatedUnion("action", [unsupported]),
).optional();
export type RadarrOnRenameHooks = z.infer<typeof radarrOnRenameHooks>;

export const radarrOnMovieAddedHooks = z.array(
  z.discriminatedUnion("action", [unsupported]),
).optional();
export type RadarrOnMovieAddedHooks = z.infer<typeof radarrOnMovieAddedHooks>;

export const radarrOnMovieDeletedHooks = z.array(
  z.discriminatedUnion("action", [unsupported]),
).optional();
export type RadarrOnMovieDeletedHooks = z.infer<
  typeof radarrOnMovieDeletedHooks
>;

export const radarrOnMovieFileDeletedHooks = z.array(
  z.discriminatedUnion("action", [
    unsupported,
  ]),
).optional();
export type RadarrOnMovieFileDeletedHooks = z.infer<
  typeof radarrOnMovieFileDeletedHooks
>;

export const radarrOnHealthIssueHooks = z.array(
  z.discriminatedUnion("action", [unsupported]),
).optional();
export type RadarrOnHealthIssueHooks = z.infer<typeof radarrOnHealthIssueHooks>;

export const radarrOnHealthRestoredHooks = z.array(
  z.discriminatedUnion("action", [unsupported]),
).optional();
export type RadarrOnHealthRestoredHooks = z.infer<
  typeof radarrOnHealthRestoredHooks
>;

export const radarrOnApplicationUpdateHooks = z.array(
  z.discriminatedUnion("action", [unsupported]),
).optional();
export type RadarrOnApplicationUpdateHooks = z.infer<
  typeof radarrOnApplicationUpdateHooks
>;

export const radarrOnManualInteractionRequiredHooks = z.array(
  z.discriminatedUnion("action", [unsupported]),
).optional();
export type RadarrOnManualInteractionRequiredHooks = z.infer<
  typeof radarrOnManualInteractionRequiredHooks
>;

export const radarrOnTestHooks = z.array(
  z.discriminatedUnion("action", [unsupported]),
).optional();
export type RadarrOnTestHooks = z.infer<typeof radarrOnTestHooks>;
