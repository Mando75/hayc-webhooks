import { z } from "zod";

export const RadarrCustomFormat = z.object({
  id: z.number().int().nullish(),
  name: z.string().nullish(),
});

export const RadarrCustomFormatInfo = z.object({
  customFormats: z.array(RadarrCustomFormat).nullish(),
  customFormatScore: z.number().int().nullish(),
});

export const RadarrDownloadClientItem = z.object({
  quality: z.string().nullish(),
  qualityVersion: z.number().int().nullish(),
  title: z.string().nullish(),
  indexer: z.string().nullish(),
  size: z.number().int().nullish(),
});

export const RadarrDownloadStatusMessage = z.object({
  title: z.string().nullish(),
  messages: z.array(z.string()).nullish(),
});

export const RadarrEventType = z.enum([
  "Test",
  "Grab",
  "Download",
  "Rename",
  "MovieDelete",
  "MovieFileDelete",
  "Health",
  "ApplicationUpdate",
  "MovieAdded",
  "HealthRestored",
  "ManualInteractionRequired",
]);

export const RadarrGrabbedRelease = z.object({
  releaseTitle: z.string().nullish(),
  indexer: z.string().nullish(),
  size: z.number().int().nullish(),
});

export const RadarrImage = z.object({
  url: z.string().nullish(),
  remoteUrl: z.string().nullish(),
});

export const RadarrMovie = z.object({
  id: z.number().int(),
  title: z.string(),
  year: z.number().int().nullish(),
  filePath: z.string().nullish(),
  releaseDate: z.string().date().nullish(),
  folderPath: z.string().nullish(),
  tmdbId: z.number().int().nullish(),
  imdbId: z.string().nullish(),
  overview: z.string().nullish(),
  genres: z.array(z.string()).nullish(),
  images: z.array(RadarrImage).nullish(),
  tags: z.array(z.string()).nullish(),
});

export const RadarrMovieFileMediaInfo = z.object({
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

export const RadarrMovieFile = z.object({
  id: z.number().int(),
  relativePath: z.string().nullish(),
  path: z.string().nullish(),
  quality: z.string().nullish(),
  qualityVersion: z.number().int().nullish(),
  releaseGroup: z.string().nullish(),
  sceneName: z.string().nullish().nullish(),
  indexerFlags: z.string().nullish(),
  size: z.number().int().nullish(),
  dateAdded: z.string().datetime().nullish(),
  mediaInfo: RadarrMovieFileMediaInfo.nullish(),
  sourcePath: z.string().nullish(),
  recycleBinPath: z.string().nullish(),
});

export const RadarrRelease = z.object({
  quality: z.string().nullish(),
  qualityVersion: z.number().int().nullish(),
  releaseGroup: z.string().nullish(),
  releaseTitle: z.string().nullish(),
  indexer: z.string().nullish(),
  size: z.number().int().nullish(),
  customFormatScore: z.number().int().nullish(),
  customFormats: z.array(z.string()).nullish(),
  indexerFlags: z.array(z.string()).nullish(),
});

export const RadarrRemoteMovie = z.object({
  tmdbid: z.number().int().nullish(),
  imdbid: z.string().nullish(),
  title: z.string().nullish(),
  year: z.number().int().nullish(),
});

export const RadarrRenamedMovieFile = z.object({
  previousPath: z.string().nullish(),
  previousRelativePath: z.string().nullish(),
});

export const RadarrAddedPayload = z.object({
  movie: RadarrMovie.nullish(),
  addMethod: z.enum(["manual", "list", "collection"]).nullish(),
});

export const RadarrApplicationUpdatePayload = z.object({
  message: z.string().nullish(),
  previousVersion: z.string().nullish(),
  newVersion: z.string().nullish(),
});

export const RadarrGrabPayload = z.object({
  movie: RadarrMovie,
  remoteMovie: RadarrRemoteMovie,
  release: RadarrRelease,
  downloadClient: z.string(),
  downloadClientType: z.string(),
  downloadId: z.string(),
  customFormatInfo: RadarrCustomFormatInfo,
});

export const RadarrHealthPayload = z.object({
  level: z.any(),
  message: z.string(),
  type: z.string(),
  wikiUrl: z.string(),
});

export const RadarrImportPayload = z.object({
  movie: RadarrMovie,
  remoteMovie: RadarrRemoteMovie,
  movieFile: RadarrMovieFile,
  isUpgrade: z.boolean(),
  downloadClient: z.string().nullish(),
  downloadClientType: z.string().nullish(),
  downloadId: z.string().nullish(),
  deletedFiles: z.array(RadarrMovieFile).nullish(),
  customFormatInfo: RadarrCustomFormatInfo.nullish(),
  release: RadarrGrabbedRelease.nullish(),
});

export const RadarrManualInteractionPayload = z.object({
  movie: RadarrMovie,
  downloadInfo: RadarrDownloadClientItem,
  downloadClient: z.string().nullish(),
  downloadClientType: z.string().nullish(),
  downloadId: z.string().nullish(),
  downloadStatus: z.string().nullish(),
  downloadStatusMessages: z.array(RadarrDownloadStatusMessage).nullish(),
  customFormatInfo: RadarrCustomFormatInfo.nullish(),
  release: RadarrGrabbedRelease.nullish(),
});

export const RadarrMovieDeletePayload = z.object({
  movie: RadarrMovie,
  deletedFiles: z.boolean().nullish(),
  movieFolderSize: z.number().int().nullish(),
});

export const RadarrMovieFileDeletePayload = z.object({
  movie: RadarrMovie,
  movieFile: RadarrMovieFile,
  deleteReason: z.enum([
    "missingFromDisk",
    "manual",
    "upgrade",
    "noLinkedEpisodes",
    "manualOverride",
  ]),
});

export const RadarrRenamePayload = z.object({
  movie: RadarrMovie,
  renamedMovieFiles: RadarrRenamedMovieFile,
});
