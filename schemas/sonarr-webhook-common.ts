import { z } from "zod";

export const SonarrCustomFormat = z.object({
  id: z.number().int().optional(),
  name: z.string().optional(),
});

export const SonarrCustomFormatInfo = z.object({
  customFormats: z.array(SonarrCustomFormat).optional(),
  customFormatScore: z.number().int().optional(),
});

export const SonarrWebhookDownloadClientItem = z.object({
  quality: z.string().optional(),
  qualityVersion: z.number().int().optional(),
  title: z.string().optional(),
  indexer: z.string().optional(),
  size: z.number().int().optional(),
});

export const SonarrDownloadStatusMessage = z.object({
  title: z.string().optional(),
  messages: z.array(z.string()).optional(),
});

export const SonarrEpisode = z.object({
  id: z.number().int(),
  episodeNumber: z.number().int().optional(),
  seasonNumber: z.number().int().optional(),
  title: z.string().optional(),
  overview: z.string().optional(),
  airDate: z.string().date().optional(),
  airDateUtc: z.string().datetime().optional(),
  seriesId: z.number().int().optional(),
  tvdbId: z.number().int().optional(),
});

export const SonarrEpisodeFileMediaInfo = z.object({
  audioChannels: z.number().optional(),
  audioCodec: z.string().optional(),
  audioLanguages: z.array(z.string()).optional(),
  height: z.number().int().optional(),
  width: z.number().int().optional(),
  subtitles: z.array(z.string()).optional(),
  videoCodec: z.string().optional(),
  videoDynamicRange: z.string().optional(),
  videoDynamicRangeType: z.string().optional(),
});

export const SonarrEpisodeFile = z.object({
  id: z.number().int(),
  relativePath: z.string().optional(),
  path: z.string().optional(),
  quality: z.string().optional(),
  qualityVersion: z.number().int().optional(),
  releaseGroup: z.string().optional(),
  sceneName: z.string().optional(),
  size: z.number().int().optional(),
  dateAdded: z.string().datetime().optional(),
  mediaInfo: SonarrEpisodeFileMediaInfo.optional(),
  sourcePath: z.string().optional(),
  recycleBinPath: z.string().optional(),
});

export const SonarrEventType = z.enum([
  "Test",
  "Grab",
  "Download",
  "Rename",
  "SeriesAdd",
  "SeriesDelete",
  "EpisodeFileDelete",
  "Health",
  "ApplicationUpdate",
  "HealthRestored",
  "ManualInteractionRequired",
]);

export const SonarrReleaseType = z.enum([
  "unknown",
  "Unknown",
  "singleEpisode",
  "SingleEpisode",
  "multiEpisode",
  "MultiEpisode",
  "seasonPack",
  "SeasonPack",
]).transform((val) => {
  if (val === "singleEpisode") return "SingleEpisode";
  if (val === "multiEpisode") return "MultiEpisode";
  if (val === "seasonPack") return "SeasonPack";
  if (val === "unknown") return "Unknown";
  return val;
});

export const SonarrGrabbedRelease = z.object({
  releaseTitle: z.string().optional(),
  indexer: z.string().optional(),
  size: z.number().int().optional(),
  releaseType: SonarrReleaseType.optional(),
});

export const SonarrWebhookImage = z.object({
  url: z.string().optional(),
  remoteUrl: z.string().optional(),
});

export const SonarrRelease = z.object({
  quality: z.string().optional(),
  qualityVersion: z.number().int().optional(),
  releaseGroup: z.string().optional(),
  releaseTitle: z.string().optional(),
  indexer: z.string().optional(),
  size: z.number().int().optional(),
  customFormatScore: z.number().int().optional(),
  customFormats: z.array(z.string()).optional(),
});

export const SonarrRenamedEpisodeFile = z.object({
  previousRelativePath: z.string().optional(),
  relativePath: z.string().optional(),
});

export const SonarrSeriesType = z.enum(["anime", "daily", "standard"]);

export const SonarrSeries = z.object({
  id: z.number().int(),
  title: z.string().optional(),
  titleSlug: z.string().optional(),
  path: z.string().optional(),
  tvdbId: z.number().int().optional(),
  tvMazeId: z.number().int().optional(),
  imdbId: z.string().optional(),
  seriesType: SonarrSeriesType.optional(),
  year: z.number().int().optional(),
  genres: z.array(z.string()).optional(),
  images: z.array(SonarrWebhookImage).optional(),
  tags: z.array(z.string()).optional(),
});

export const SonarrApplicationUpdatePayload = z.object({
  message: z.string().optional(),
  previousVersion: z.string().optional(),
  newVersion: z.string().optional(),
});

export const SonarrDeleteMediaFileReason = z.enum([
  "missingFromDisk",
  "manual",
  "upgrade",
  "noLinkedEpisodes",
  "manualOverride",
]);

export const SonarrEpisodeDeletePayload = z.object({
  series: SonarrSeries.optional(),
  episodes: z.array(SonarrEpisode).optional(),
  episodeFile: SonarrEpisodeFile.optional(),
  deleteReason: SonarrDeleteMediaFileReason.optional(),
});

export const SonarrGrabPayload = z.object({
  series: SonarrSeries.optional(),
  episodes: z.array(SonarrEpisode).optional(),
  release: SonarrRelease.optional(),
  downloadClient: z.string().optional(),
  downloadClientType: z.string().optional(),
  downloadId: z.string().optional(),
  customFormatInfo: SonarrCustomFormatInfo.optional(),
});

export const SonarrHealthPayload = z.object({
  message: z.string().optional(),
  type: z.string().optional(),
  wikiUrl: z.string().optional(),
  level: z.enum(["ok", "notice", "warning", "error"]),
});

export const SonarrImportPayload = z.object({
  series: SonarrSeries.optional(),
  episodes: z.array(SonarrEpisode).optional(),
  episodeFiles: z.array(SonarrEpisodeFile).optional(),
  isUpgrade: z.boolean().optional(),
  downloadClient: z.string().optional(),
  downloadClientType: z.string().optional(),
  downloadId: z.string().optional(),
  deletedFiles: z.array(SonarrEpisodeFile).optional(),
  customFormatInfo: SonarrCustomFormatInfo.optional(),
  release: SonarrGrabbedRelease.optional(),
  fileCount: z.number().int().optional(),
  sourcePath: z.string().optional(),
  destinationPath: z.string().optional(),
});

export const SonarrManualInteractionRequiredPayload = z.object({
  series: SonarrSeries.optional(),
  episodes: z.array(SonarrEpisode).optional(),
  downloadInfo: SonarrWebhookDownloadClientItem.optional(),
  downloadClient: z.string().optional(),
  downloadClientType: z.string().optional(),
  downloadId: z.string().optional(),
  downloadStatus: z.string(),
  downloadStatusMessage: z.array(SonarrDownloadStatusMessage).optional(),
  customFormatInfo: SonarrCustomFormatInfo.optional(),
  release: SonarrGrabbedRelease.optional(),
});

export const SonarrRenamePayload = z.object({
  series: SonarrSeries.optional(),
  renamedEpisodeFiles: z.array(SonarrRenamedEpisodeFile).optional(),
});

export const SonarrSeriesAddPayload = z.object({
  series: SonarrSeries,
});

export const SonarrSeriesDeletePayload = z.object({
  series: SonarrSeries,
  deletedFiles: z.boolean(),
});
