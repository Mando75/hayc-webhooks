import { z } from "zod";
import {
  radarrOnApplicationUpdateHooks,
  radarrOnDownloadHooks,
  radarrOnGrabHooks,
  radarrOnHealthIssueHooks,
  radarrOnHealthRestoredHooks,
  radarrOnManualInteractionRequiredHooks,
  radarrOnMovieAddedHooks,
  radarrOnMovieDeletedHooks,
  radarrOnMovieFileDeletedHooks,
  radarrOnRenameHooks,
  radarrOnTestHooks,
} from "../config/radarr.hooks.ts";
import {
  sonarrOnApplicationUpdateHooks,
  sonarrOnDownloadHooks,
  sonarrOnEpisodeFileDeleteHooks,
  sonarrOnGrabHooks,
  sonarrOnHealthHooks,
  sonarrOnHealthRestoredHooks,
  sonarrOnImportCompleteHooks,
  sonarrOnManualInteractionRequiredHooks,
  sonarrOnRenameHooks,
  sonarrOnSeriesAddHooks,
  sonarrOnSeriesDeleteHooks,
  sonarrOnTestHooks,
} from "../config/sonarr.hooks.ts";

export const ConfigSchema = z.object({
  port: z.number().default(8000),
  qbit: z.object({
    host: z.string(),
    user: z.string(),
    pwd: z.string(),
  }),
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
  sonarr: z.object({
    host: z.string(),
    apiKey: z.string(),
    webhooks: z.object({
      onGrab: sonarrOnGrabHooks,
      onDownload: sonarrOnDownloadHooks,
      onImportComplete: sonarrOnImportCompleteHooks,
      onEpisodeFileDelete: sonarrOnEpisodeFileDeleteHooks,
      onSeriesAdd: sonarrOnSeriesAddHooks,
      onSeriesDelete: sonarrOnSeriesDeleteHooks,
      onRename: sonarrOnRenameHooks,
      onManualInteractionRequired: sonarrOnManualInteractionRequiredHooks,
      onHealth: sonarrOnHealthHooks,
      onTest: sonarrOnTestHooks,
      onHealthRestored: sonarrOnHealthRestoredHooks,
      onApplicationUpdate: sonarrOnApplicationUpdateHooks,
    }),
  }),
});

export type Config = z.infer<typeof ConfigSchema>;
