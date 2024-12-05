import { z } from "zod";
import { SonarrReleaseType } from "./sonarr-webhook-common.ts";

const SonarrQualityModel = z.object({
  quality: z.object({
    id: z.number().int(),
    name: z.string().optional(),
    source: z.enum([
      "unknown",
      "television",
      "televisionRaw",
      "web",
      "webRip",
      "dvd",
      "bluray",
      "blurayRaw",
    ]),
    resolution: z.number().int(),
  }),
  revision: z.object({
    version: z.number().int(),
    real: z.number().int(),
    isRepack: z.boolean().optional(),
  }),
});

export const SonarrCustomFormatModel = z.object({
  id: z.number(),
  name: z.string().optional(),
  includeCustomFormatWhenRenaming: z.boolean().optional(),
  specifications: z.array(z.object({
    id: z.number().int(),
    name: z.string().optional(),
    implementation: z.string().optional(),
    implementationName: z.string().optional(),
    infoLink: z.string().optional(),
    negate: z.boolean().optional(),
    required: z.boolean().optional(),
    fields: z.array(
      z.object({
        order: z.number().int(),
        name: z.string().optional(),
        label: z.string().optional(),
        unit: z.string().optional(),
        helpText: z.string().optional(),
        helpTextWarning: z.string().optional(),
        helpLink: z.string().optional(),
        value: z.any().optional(),
        type: z.string().optional(),
        advanced: z.boolean().optional(),
        selectOptions: z.array(z.object({
          value: z.number().int(),
          name: z.string().optional(),
          order: z.number().int(),
          hint: z.string().optional(),
        })).optional(),
        selectOptionsProviderAction: z.string().optional(),
        section: z.string().optional(),
        hidden: z.string().optional(),
        privacy: z.enum(["normal", "pasword", "apiKey", "userName"]),
        placeholder: z.string().optional(),
        isFloat: z.boolean().optional(),
      }),
    ).optional(),
    presets: z.array(z.any()).optional(),
  })).optional(),
});

export const SonarrEpisodeLanguage = z.object({
  id: z.number().int(),
  name: z.string().optional(),
});

export const SonarrEpisodeFile = z.object({
  id: z.number().int(),
  seriesId: z.number().int(),
  seasonNumber: z.number().int(),
  relativePath: z.string().optional(),
  path: z.string().optional(),
  size: z.number().int(),
  dateAdded: z.string(),
  sceneName: z.string().optional(),
  releaseGroup: z.string().optional(),
  languages: z.array(SonarrEpisodeLanguage).optional(),
  quality: SonarrQualityModel.optional(),
  customFormats: z.array(SonarrCustomFormatModel).optional(),
  customFormatScore: z.number().int(),
  indexerFlags: z.number().optional(),
  releaseType: SonarrReleaseType,
  mediaInfo: z.any().optional(),
  qualityCutoffNotMet: z.boolean().optional(),
});

export const SonarrSeasonStatisticsResource = z.object({
  nextAiring: z.string().optional(),
  previousAiring: z.string().optional(),
  episodeFileCount: z.number().int(),
  episodeCount: z.number().int(),
  totalEpisodeCount: z.number().int(),
  sizeOnDisk: z.number().int(),
  releaseGroups: z.array(z.string()).optional(),
  percentOfEpisodes: z.number(),
});

export const SonarrSeasonResource = z.object({
  seasonNumber: z.number().int(),
  monitored: z.boolean().optional(),
  statistics: SonarrSeasonStatisticsResource.optional(),
});

export const SonarrSeriesResource = z.object({
  id: z.number().int(),
  title: z.string().optional(),
  alternateTitles: z.array(z.string()).optional(),
  sortTitle: z.string().optional(),
  status: z.enum(["continuing", "ended", "upcoming", "deleted"]),
  ended: z.boolean().optional(),
  profileName: z.string().optional(),
  overview: z.string().optional(),
  nextAiring: z.string().optional(),
  previousAiring: z.string().optional(),
  network: z.string().optional(),
  airTime: z.string().optional(),
  images: z.array(z.object({
    coverType: z.string().optional(),
    url: z.string().optional(),
  })).optional(),
  originalLanguage: SonarrEpisodeLanguage.optional(),
  remotePoster: z.string().optional(),
  seasons: z.array(SonarrSeasonResource).optional(),
  year: z.number(),
  path: z.string().optional(),
  qualityProfileId: z.number().int(),
  seasonFolder: z.boolean().optional(),
  monitored: z.boolean().optional(),
  monitorNewItems: z.enum(["all", "none"]),
  useSceneNumbering: z.boolean().optional(),
  runtime: z.number().optional(),
  tvdbId: z.number().optional(),
  tvRageId: z.number().optional(),
  tvMazeId: z.number().optional(),
  tmdbId: z.number().optional(),
  firstAired: z.string().optional(),
  lastAired: z.string().optional(),
  seriesType: z.enum(["standard", "daily", "anime"]),
  cleanTitle: z.string().optional(),
  imdbId: z.string().optional(),
  titleSlug: z.string().optional(),
  certification: z.string().optional(),
  genres: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  added: z.string().optional(),
  addOptions: z.object({
    ignoreEpisodesWithFiles: z.boolean().optional(),
    ignoreEpisodesWithoutFiles: z.boolean().optional(),
    monitor: z.enum([
      "unknown",
      "all",
      "future",
      "missing",
      "existing",
      "firstSeason",
      "lastSeason",
      "latestSeason",
      "pilot",
      "recent",
      "monitorSpecials",
      "unmonitorSpecials",
      "none",
      "skip",
    ]),
    searchForMissingEpisodes: z.boolean().optional(),
    searchForCutOffUnmetEpisodes: z.boolean().optional(),
  }).optional(),
  ratings: z.object({
    votes: z.number(),
    value: z.number(),
  }).optional(),
  statistics: SonarrSeasonStatisticsResource.optional(),
  eipsodesChanged: z.boolean().optional(),
});

export const SonarrHistoryData = z.object({
  indexer: z.string().optional(),
  nzbInfoUrl: z.string().optional(),
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
  tvdbId: z.string().nullish(),
  tvRageId: z.string().nullish(),
  imdbId: z.string().nullish(),
  protocol: z.string().optional(),
  customFormatScore: z.string().optional(),
  seriesMatchType: z.string().optional(),
  releaseSource: z.string().optional(),
  indexerFlags: z.string().optional(),
  releaseType: SonarrReleaseType.optional(),
  torrentInfoHash: z.string().optional(),
  fileId: z.string().optional(),
  droppedPath: z.string().optional(),
  importedPath: z.string().optional(),
  reason: z.string().optional(),
});

export const SonarrHistoryResource = z.object({
  id: z.number().int(),
  episodeId: z.number().int(),
  seriesId: z.number().int(),
  sourceTitle: z.string().optional(),
  languages: z.array(SonarrEpisodeLanguage).optional(),
  quality: SonarrQualityModel.optional(),
  customFormats: z.array(SonarrCustomFormatModel).optional(),
  customFormatScore: z.number().int(),
  qualityCutoffNotMet: z.boolean().optional(),
  date: z.string(),
  downloadId: z.string().optional(),
  eventType: z.enum([
    "unknown",
    "grabbed",
    "seriesFolderImported",
    "downloadFolderImported",
    "downloadFailed",
    "episodeFileDeleted",
    "episodeFileRenamed",
    "downloadIgnored",
  ]),
  data: SonarrHistoryData.optional(),
  episodeFile: SonarrEpisodeFile.optional(),
  series: SonarrSeriesResource.optional(),
  hasFile: z.boolean().optional(),
  monitored: z.boolean().optional(),
  absoluteEpisodeNumber: z.number().int().optional(),
  sceneAbsoluteEpisodeNumber: z.number().int().optional(),
  sceneEpisodeNumber: z.number().int().optional(),
  sceneSeasonNumber: z.number().int().optional(),
  unverifiedSceneNumbering: z.boolean().optional(),
  endTime: z.string().optional(),
  grabDate: z.string().optional(),
});

export type SonarrHistoryResource = z.infer<typeof SonarrHistoryResource>;