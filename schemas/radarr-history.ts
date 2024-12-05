import {z} from "zod";

export const RadarrGrabbedHistoryResponseSchema = z.object({
  indexer: z.string().optional(),
  releaseGroup: z.string().nullish(),
  age: z.string().optional(),
  ageHours: z.string().optional(),
  ageMinutes: z.string().optional(),
  publishedDate: z.string().optional(),
  downloadClient: z.string().optional(),
  downloadClientName: z.string().optional(),
  size: z.string().optional(),
  downloadUrl: z.string().optional(),
  guid: z.string().optional(),
  tmdbId: z.string().optional(),
  imdbId: z.string().optional(),
});

export const RadarrDownloadFailedHistorySchema = z.object({
  message: z.string(),
});

export const RadarrDownloadFolderImportedHistorySchema = z.object({
  fileId: z.string().optional(),
  customFormatScore: z.string().optional(),
  downloadClient: z.string().optional(),
  downloadClientName: z.string().optional(),
  droppedPath: z.string(),
  importedPath: z.string(),
  releaseGroup: z.string().nullish(),
  size: z.string().optional(),
});

export const RadarrMovieFileDeletedHistorySchema = z.object({
  customFormatScore: z.string().optional(),
  reason: z.enum(["Manual", "MissingFromDisk", "Upgrade"]),
  releaseGroup: z.string().nullish(),
  size: z.string().optional(),
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
  sourceTitle: z.string().optional(),
  customFormatScore: z.number().optional(),
  qualityCutOffNotMet: z.boolean().optional(),
  date: z.string().optional(),
  downloadId: z.string().optional(),
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
