import {z} from "zod";

export const SonarrCustomFormat = z.object({
  id: z.number().int().nullish(),
  name: z.string().nullish(),
});

export const SonarrCustomFormatInfo = z.object({
  customFormats: z.array(SonarrCustomFormat).nullish(),
  customFormatScore: z.number().int().nullish(),
});

export const SonarrWebhookDownloadClientItem = z.object({
  quality: z.string().nullish(),
  qualityVersion: z.number().int().nullish(),
  title: z.string().nullish(),
  indexer: z.string().nullish(),
  size: z.number().int().nullish(),
});

export const SonarrDownloadStatusMessage = z.object({
  title: z.string().nullish(),
  messages: z.array(z.string()).nullish(),
});

export const SonarrEpisode = z.object({
  id: z.number().int(),
  episodeNumber: z.number().int().nullish(),
  seasonNumber: z.number().int().nullish(),
  title: z.string().nullish(),
  overview: z.string().nullish(),
  airDate: z.string().date().nullish(),
  airDateUtc: z.string().datetime().nullish(),
  seriesId: z.number().int().nullish(),
  tvdbId: z.number().int().nullish(),
});

export const SonarrEpisodeFileMediaInfo = z.object({
  audioChannels: z.number().nullish(),
  audioCodec: z.string().nullish(),
  audioLanguages: z.array(z.string()).nullish(),
  height: z.number().int().nullish(),
  width: z.number().int().nullish(),
  subtitles: z.array(z.string()).nullish(),
  videoCodec: z.string().nullish(),
  videoDynamicRange: z.string().nullish(),
  videoDynamicRangeType: z.string().nullish(),
});

export const SonarrEpisodeFile = z.object({
  id: z.number().int(),
  relativePath: z.string().nullish(),
  path: z.string().nullish(),
  quality: z.string().nullish(),
  qualityVersion: z.number().int().nullish(),
  releaseGroup: z.string().nullish(),
  sceneName: z.string().nullish(),
  size: z.number().int().nullish(),
  dateAdded: z.string().datetime().nullish(),
  mediaInfo: SonarrEpisodeFileMediaInfo.nullish(),
  sourcePath: z.string().nullish(),
  recycleBinPath: z.string().nullish(),
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
  releaseTitle: z.string().nullish(),
  indexer: z.string().nullish(),
  size: z.number().int().nullish(),
  releaseType: SonarrReleaseType.nullish(),
});

export const SonarrWebhookImage = z.object({
  url: z.string().nullish(),
  remoteUrl: z.string().nullish(),
});

export const SonarrRelease = z.object({
  quality: z.string().nullish(),
  qualityVersion: z.number().int().nullish(),
  releaseGroup: z.string().nullish(),
  releaseTitle: z.string().nullish(),
  indexer: z.string().nullish(),
  size: z.number().int().nullish(),
  customFormatScore: z.number().int().nullish(),
  customFormats: z.array(z.string()).nullish(),
});

export const SonarrRenamedEpisodeFile = z.object({
  previousRelativePath: z.string().nullish(),
  relativePath: z.string().nullish(),
});

export const SonarrSeriesType = z.enum(["anime", "daily", "standard"]);

export const SonarrSeries = z.object({
  id: z.number().int(),
  title: z.string().nullish(),
  titleSlug: z.string().nullish(),
  path: z.string().nullish(),
  tvdbId: z.number().int().nullish(),
  tvMazeId: z.number().int().nullish(),
  imdbId: z.string().nullish(),
  seriesType: SonarrSeriesType.nullish(),
  year: z.number().int().nullish(),
  genres: z.array(z.string()).nullish(),
  images: z.array(SonarrWebhookImage).nullish(),
  tags: z.array(z.string()).nullish(),
});

export const SonarrApplicationUpdatePayload = z.object({
  message: z.string().nullish(),
  previousVersion: z.string().nullish(),
  newVersion: z.string().nullish(),
});

export const SonarrDeleteMediaFileReason = z.enum([
  "missingFromDisk",
  "manual",
  "upgrade",
  "noLinkedEpisodes",
  "manualOverride",
]);

export const SonarrEpisodeDeletePayload = z.object({
  series: SonarrSeries.nullish(),
  episodes: z.array(SonarrEpisode).nullish(),
  episodeFile: SonarrEpisodeFile.nullish(),
  deleteReason: SonarrDeleteMediaFileReason.nullish(),
});

export const SonarrGrabPayload = z.object({
  series: SonarrSeries.nullish(),
  episodes: z.array(SonarrEpisode).nullish(),
  release: SonarrRelease.nullish(),
  downloadClient: z.string().nullish(),
  downloadClientType: z.string().nullish(),
  downloadId: z.string().nullish(),
  customFormatInfo: SonarrCustomFormatInfo.nullish(),
});

export const SonarrHealthPayload = z.object({
  message: z.string().nullish(),
  type: z.string().nullish(),
  wikiUrl: z.string().nullish(),
  level: z.enum(["ok", "notice", "warning", "error"]),
});

export const SonarrImportPayload = z.object({
  series: SonarrSeries.nullish(),
  episodes: z.array(SonarrEpisode).nullish(),
  episodeFiles: z.array(SonarrEpisodeFile).nullish(),
  isUpgrade: z.boolean().nullish(),
  downloadClient: z.string().nullish(),
  downloadClientType: z.string().nullish(),
  downloadId: z.string().nullish(),
  deletedFiles: z.array(SonarrEpisodeFile).nullish(),
  customFormatInfo: SonarrCustomFormatInfo.nullish(),
  release: SonarrGrabbedRelease.nullish(),
  fileCount: z.number().int().nullish(),
  sourcePath: z.string().nullish(),
  destinationPath: z.string().nullish(),
});

export const SonarrManualInteractionRequiredPayload = z.object({
  series: SonarrSeries.nullish(),
  episodes: z.array(SonarrEpisode).nullish(),
  downloadInfo: SonarrWebhookDownloadClientItem.nullish(),
  downloadClient: z.string().nullish(),
  downloadClientType: z.string().nullish(),
  downloadId: z.string().nullish(),
  downloadStatus: z.string(),
  downloadStatusMessage: z.array(SonarrDownloadStatusMessage).nullish(),
  customFormatInfo: SonarrCustomFormatInfo.nullish(),
  release: SonarrGrabbedRelease.nullish(),
});

export const SonarrRenamePayload = z.object({
  series: SonarrSeries.nullish(),
  renamedEpisodeFiles: z.array(SonarrRenamedEpisodeFile).nullish(),
});

export const SonarrSeriesAddPayload = z.object({
  series: SonarrSeries,
});

export const SonarrSeriesDeletePayload = z.object({
  series: SonarrSeries,
  deletedFiles: z.boolean(),
});
