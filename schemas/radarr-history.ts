import { z } from "zod";

export const GrabbedHistoryDataSchema = z.object({
  indexer: z.string().optional(),
  releaseGroup: z.string().optional(),
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

export const DownloadFailedHistorySchema = z.object({
  message: z.string(),
});

export const DownloadFolderImportedHistorySchema = z.object({
  fileId: z.string().optional(),
  customFormatScore: z.string().optional(),
  downloadClient: z.string().optional(),
  downloadClientName: z.string().optional(),
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
