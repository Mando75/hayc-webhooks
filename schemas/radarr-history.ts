import { z } from "zod";

export const GrabbedHistoryDataSchema = z.object({
  indexer: z.string(),
  releaseGroup: z.string(),
  age: z.string(),
  ageHours: z.string(),
  ageMinutes: z.string(),
  publishedDate: z.string(),
  downloadClient: z.string(),
  downloadClientName: z.string(),
  size: z.string(),
  downloadUrl: z.string(),
  guid: z.string(),
  tmdbId: z.string(),
  imdbId: z.string(),
});

export const DownloadFailedHistorySchema = z.object({
  message: z.string(),
});

export const DownloadFolderImportedHistorySchema = z.object({
  fileId: z.string().optional(),
  customFormatScore: z.string().optional(),
  downloadClient: z.string(),
  downloadClientName: z.string(),
  droppedPath: z.string(),
  importedPath: z.string(),
  releaseGroup: z.string().optional(),
  size: z.string().optional(),
});

export const MovieFileDeletedHistorySchema = z.object({
  customFormatScore: z.string().optional(),
  reason: z.enum(["Manual", "MissingFromDisk", "Upgrade"]),
  releaseGroup: z.string().optional(),
  size: z.string().optional(),
});

export const MovieFileRenamedHistorySchema = z.object({
  sourcePath: z.string(),
  sourceRelativePath: z.string(),
  path: z.string(),
  relativePath: z.string(),
});

export const DownloadIgnoredHistorySchema = z.object({
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
    data: GrabbedHistoryDataSchema,
  }).merge(historyBase),
  z.object({
    eventType: z.literal("downloadFolderImported"),
    data: DownloadFolderImportedHistorySchema,
  }).merge(historyBase),
  z.object({
    eventType: z.literal("movieFileDeleted"),
    data: MovieFileDeletedHistorySchema,
  }).merge(historyBase),
  z.object({
    eventType: z.literal("movieFileRenamed"),
    data: MovieFileRenamedHistorySchema,
  }).merge(historyBase),
  z.object({
    eventType: z.literal("downloadIgnored"),
    data: DownloadIgnoredHistorySchema,
  }).merge(historyBase),
]);

export type RadarrHistory = z.infer<typeof RadarrHistorySchema>;
