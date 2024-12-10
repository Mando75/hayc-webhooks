import { z } from "zod";

export const unsupported = z.object({ action: z.literal("_unsupported") });
export const sonarrOnGrabHooks = z.array(
  z.discriminatedUnion("action", [
    z.object({
      action: z.literal("tag-outdated-downloads"),
      tag: z.string().default("sonarr-upgraded"),
    }),
  ]),
)
  .optional();
export type SonarrOnGrabHooks = z.infer<typeof sonarrOnGrabHooks>;

export const sonarrOnDownloadHooks = z.array(z.discriminatedUnion("action", [
  unsupported,
])).optional();
export type SonarrOnDownloadHooks = z.infer<typeof sonarrOnDownloadHooks>;

export const sonarrOnImportCompleteHooks = z.array(
  z.discriminatedUnion("action", [unsupported]),
).optional();
export type SonarrOnImportCompleteHooks = z.infer<
  typeof sonarrOnImportCompleteHooks
>;

export const sonarrOnEpisodeFileDeleteHooks = z.array(
  z.discriminatedUnion("action", [unsupported]),
).optional();
export type SonarrOnEpisodeFileDeleteHooks = z.infer<
  typeof sonarrOnEpisodeFileDeleteHooks
>;

export const sonarrOnSeriesAddHooks = z.array(
  z.discriminatedUnion("action", [unsupported]),
).optional();
export type SonarrOnSeriesAddHooks = z.infer<typeof sonarrOnSeriesAddHooks>;

export const sonarrOnSeriesDeleteHooks = z.array(
  z.discriminatedUnion("action", [unsupported]),
).optional();
export type SonarrOnSeriesDeleteHooks = z.infer<
  typeof sonarrOnSeriesDeleteHooks
>;

export const sonarrOnRenameHooks = z.array(
  z.discriminatedUnion("action", [unsupported]),
).optional();
export type SonarrOnRenameHooks = z.infer<typeof sonarrOnRenameHooks>;

export const sonarrOnManualInteractionRequiredHooks = z.array(
  z.discriminatedUnion("action", [unsupported]),
).optional();
export type SonarrOnManualInteractionRequiredHooks = z.infer<
  typeof sonarrOnManualInteractionRequiredHooks
>;

export const sonarrOnHealthHooks = z.array(
  z.discriminatedUnion("action", [unsupported]),
).optional();
export type SonarrOnHealthHooks = z.infer<typeof sonarrOnHealthHooks>;

export const sonarrOnTestHooks = z.array(
  z.discriminatedUnion("action", [unsupported]),
)
  .optional();
export type SonarrOnTestHooks = z.infer<typeof sonarrOnTestHooks>;

export const sonarrOnApplicationUpdateHooks = z.array(
  z.discriminatedUnion("action", [unsupported]),
).optional();
export type SonarrOnApplicationUpdateHooks = z.infer<
  typeof sonarrOnApplicationUpdateHooks
>;

export const sonarrOnHealthRestoredHooks = z.array(
  z.discriminatedUnion("action", [unsupported]),
).optional();
export type SonarrOnHealthRestoredHooks = z.infer<
  typeof sonarrOnHealthRestoredHooks
>;
