import { z } from "zod";

export const RadarrCustomFormat = z.object({
  id: z.number().int().optional(),
  name: z.string().optional(),
});

export const RadarrCustomFormatInfo = z.object({
  customFormats: z.array(RadarrCustomFormat).optional(),
  customFormatScore: z.number().int().optional(),
});

export const RadarrDownloadClientItem = z.object({
  quality: z.string().optional(),
  qualityVersion: z.number().int().optional(),
  title: z.string().optional(),
  indexer: z.string().optional(),
  size: z.number().int().optional(),
});

export const RadarrDownloadStatusMessage = z.object({
  title: z.string().optional(),
  messages: z.array(z.string()).optional(),
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
  releaseTitle: z.string().optional(),
  indexer: z.string().optional(),
  size: z.number().int().optional(),
});

export const RadarrImage = z.object({
  url: z.string().url().optional(),
  remoteUrl: z.string().url().optional(),
});

export const RadarrMovie = z.object({
  id: z.number().int(),
  title: z.string(),
  year: z.number().int().optional(),
  filePath: z.string().optional(),
  releaseDate: z.string().date().optional(),
  folderPath: z.string().optional(),
  tmdbId: z.number().int().optional(),
  imdbId: z.string().optional(),
  overview: z.string().optional(),
  genres: z.array(z.string()).optional(),
  images: z.array(RadarrImage).optional(),
  tags: z.array(z.string()).optional(),
});

export const RadarrMovieFileMediaInfo = z.object({
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

export const RadarrMovieFile = z.object({
  id: z.number().int(),
  relativePath: z.string().optional(),
  path: z.string().optional(),
  quality: z.string().optional(),
  qualityVersion: z.number().int().optional(),
  releaseGroup: z.string().optional(),
  sceneName: z.string().optional().optional(),
  indexerFlags: z.string().optional(),
  size: z.number().int().optional(),
  dateAdded: z.string().datetime().optional(),
  mediaInfo: RadarrMovieFileMediaInfo.optional(),
  sourcePath: z.string().optional(),
  recycleBinPath: z.string().optional(),
});

export const RadarrRelease = z.object({
  quality: z.string().optional(),
  qualityVersion: z.number().int().optional(),
  releaseGroup: z.string().optional(),
  releaseTitle: z.string().optional(),
  indexer: z.string().optional(),
  size: z.number().int().optional(),
  customFormatScore: z.number().int().optional(),
  customFormats: z.array(RadarrCustomFormat).optional(),
  indexerFlags: z.array(z.string()).optional(),
});

export const RadarrRemoteMovie = z.object({
  tmdbid: z.number().int().optional(),
  imdbid: z.string().optional(),
  title: z.string().optional(),
  year: z.number().int().optional(),
});

export const RadarrRenamedMovieFile = z.object({
  previousPath: z.string().optional(),
  previousRelativePath: z.string().optional(),
});

export const RadarrAddedPayload = z.object({
  movie: RadarrMovie.optional(),
  addMethod: z.enum(["Manual", "List", "Collection"]).optional(),
});

export const RadarrApplicationUpdatePayload = z.object({
  message: z.string().optional(),
  previousVersion: z.string().optional(),
  newVersion: z.string().optional(),
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
  downloadClient: z.string().optional(),
  downloadClientType: z.string().optional(),
  downloadId: z.string().optional(),
  deletedFiles: z.array(RadarrMovieFile).optional(),
  customFormatInfo: RadarrCustomFormatInfo.optional(),
  release: RadarrGrabbedRelease.optional(),
});

export const RadarrManualInteractionPayload = z.object({
  movie: RadarrMovie,
  downloadInfo: RadarrDownloadClientItem,
  downloadClient: z.string().optional(),
  downloadClientType: z.string().optional(),
  downloadId: z.string().optional(),
  downloadStatus: z.string().optional(),
  downloadStatusMessages: z.array(RadarrDownloadStatusMessage).optional(),
  customFormatInfo: RadarrCustomFormatInfo.optional(),
  release: RadarrGrabbedRelease.optional(),
});

export const RadarrMovieDeletePayload = z.object({
  movie: RadarrMovie,
  deletedFiles: z.boolean().optional(),
  movieFolderSize: z.number().int().optional(),
});

export const RadarrMovieFileDeletePayload = z.object({
  movie: RadarrMovie,
  movieFile: RadarrMovieFile,
  deleteReason: z.enum([
    "MissingFromDisk",
    "Manual",
    "Upgrade",
    "NoLinkedEpisodes",
    "ManualOverride",
  ]),
});

export const RadarrRenamePayload = z.object({
  movie: RadarrMovie,
  renamedMovieFiles: RadarrRenamedMovieFile,
});
