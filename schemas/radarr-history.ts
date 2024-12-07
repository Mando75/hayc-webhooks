import {z} from "zod";

export const RadarrGrabbedHistoryResponseSchema = z.object({
  indexer: z.string().nullish(),
  releaseGroup: z.string().nullish(),
  age: z.string().nullish(),
  ageHours: z.string().nullish(),
  ageMinutes: z.string().nullish(),
  publishedDate: z.string().nullish(),
  downloadClient: z.string().nullish(),
  downloadClientName: z.string().nullish(),
  size: z.string().nullish(),
  downloadUrl: z.string().nullish(),
  guid: z.string().nullish(),
  tmdbId: z.string().nullish(),
  imdbId: z.string().nullish(),
});

export const RadarrDownloadFailedHistorySchema = z.object({
  message: z.string(),
});

export const RadarrDownloadFolderImportedHistorySchema = z.object({
  fileId: z.string().nullish(),
  customFormatScore: z.string().nullish(),
  downloadClient: z.string().nullish(),
  downloadClientName: z.string().nullish(),
  droppedPath: z.string(),
  importedPath: z.string(),
  releaseGroup: z.string().nullish(),
  size: z.string().nullish(),
});

export const RadarrMovieFileDeletedHistorySchema = z.object({
  customFormatScore: z.string().nullish(),
  reason: z.enum(["Manual", "MissingFromDisk", "Upgrade"]),
  releaseGroup: z.string().nullish(),
  size: z.string().nullish(),
});

export const RadarrMovieFileRenamedHistorySchema = z.object({
  sourcePath: z.string(),
  sourceRelativePath: z.string(),
  path: z.string(),
  relativePath: z.string(),
});

export const RadarrDownloadIgnoredHistorySchema = z.object({
  message: z.string(),
});

const historyBase = z.object({
  movieId: z.number(),
  sourceTitle: z.string().nullish(),
  customFormatScore: z.number().nullish(),
  qualityCutOffNotMet: z.boolean().nullish(),
  date: z.string().nullish(),
  downloadId: z.string().nullish(),
  id: z.number(),
});

export const RadarrHistorySchema = z.discriminatedUnion("eventType", [
  z.object({
    eventType: z.literal("grabbed"),
    data: RadarrGrabbedHistoryResponseSchema,
  }).merge(historyBase),
  z.object({
    eventType: z.literal("downloadFolderImported"),
    data: RadarrDownloadFolderImportedHistorySchema,
  }).merge(historyBase),
  z.object({
    eventType: z.literal("movieFileDeleted"),
    data: RadarrMovieFileDeletedHistorySchema,
  }).merge(historyBase),
  z.object({
    eventType: z.literal("movieFileRenamed"),
    data: RadarrMovieFileRenamedHistorySchema,
  }).merge(historyBase),
  z.object({
    eventType: z.literal("downloadIgnored"),
    data: RadarrDownloadIgnoredHistorySchema,
  }).merge(historyBase),
]);

export type RadarrHistory = z.infer<typeof RadarrHistorySchema>;
