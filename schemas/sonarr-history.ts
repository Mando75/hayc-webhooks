import { z } from "zod";
import { SonarrReleaseType } from "./sonarr-webhook-common.ts";

const SonarrQualityModel = z.object({
  quality: z.object({
    id: z.number().int(),
    name: z.string().nullish(),
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
    isRepack: z.boolean().nullish(),
  }),
});

export const SonarrCustomFormatModel = z.object({
  id: z.number(),
  name: z.string().nullish(),
  includeCustomFormatWhenRenaming: z.boolean().nullish(),
  specifications: z.array(z.object({
    id: z.number().int(),
    name: z.string().nullish(),
    implementation: z.string().nullish(),
    implementationName: z.string().nullish(),
    infoLink: z.string().nullish(),
    negate: z.boolean().nullish(),
    required: z.boolean().nullish(),
    fields: z.array(
      z.object({
        order: z.number().int(),
        name: z.string().nullish(),
        label: z.string().nullish(),
        unit: z.string().nullish(),
        helpText: z.string().nullish(),
        helpTextWarning: z.string().nullish(),
        helpLink: z.string().nullish(),
        value: z.any().nullish(),
        type: z.string().nullish(),
        advanced: z.boolean().nullish(),
        selectOptions: z.array(z.object({
          value: z.number().int(),
          name: z.string().nullish(),
          order: z.number().int(),
          hint: z.string().nullish(),
        })).nullish(),
        selectOptionsProviderAction: z.string().nullish(),
        section: z.string().nullish(),
        hidden: z.string().nullish(),
        privacy: z.enum(["normal", "pasword", "apiKey", "userName"]),
        placeholder: z.string().nullish(),
        isFloat: z.boolean().nullish(),
      }),
    ).nullish(),
    presets: z.array(z.any()).nullish(),
  })).nullish(),
});

export const SonarrEpisodeLanguage = z.object({
  id: z.number().int(),
  name: z.string().nullish(),
});

export const SonarrEpisodeFile = z.object({
  id: z.number().int(),
  seriesId: z.number().int(),
  seasonNumber: z.number().int(),
  relativePath: z.string().nullish(),
  path: z.string().nullish(),
  size: z.number().int(),
  dateAdded: z.string(),
  sceneName: z.string().nullish(),
  releaseGroup: z.string().nullish(),
  languages: z.array(SonarrEpisodeLanguage).nullish(),
  quality: SonarrQualityModel.nullish(),
  customFormats: z.array(SonarrCustomFormatModel).nullish(),
  customFormatScore: z.number().int(),
  indexerFlags: z.number().nullish(),
  releaseType: SonarrReleaseType,
  mediaInfo: z.any().nullish(),
  qualityCutoffNotMet: z.boolean().nullish(),
});

export const SonarrSeasonStatisticsResource = z.object({
  nextAiring: z.string().nullish(),
  previousAiring: z.string().nullish(),
  episodeFileCount: z.number().int(),
  episodeCount: z.number().int(),
  totalEpisodeCount: z.number().int(),
  sizeOnDisk: z.number().int(),
  releaseGroups: z.array(z.string()).nullish(),
  percentOfEpisodes: z.number(),
});

export const SonarrSeasonResource = z.object({
  seasonNumber: z.number().int(),
  monitored: z.boolean().nullish(),
  statistics: SonarrSeasonStatisticsResource.nullish(),
});

export const SonarrSeriesResource = z.object({
  id: z.number().int(),
  title: z.string().nullish(),
  alternateTitles: z.array(z.string()).nullish(),
  sortTitle: z.string().nullish(),
  status: z.enum(["continuing", "ended", "upcoming", "deleted"]),
  ended: z.boolean().nullish(),
  profileName: z.string().nullish(),
  overview: z.string().nullish(),
  nextAiring: z.string().nullish(),
  previousAiring: z.string().nullish(),
  network: z.string().nullish(),
  airTime: z.string().nullish(),
  images: z.array(z.object({
    coverType: z.string().nullish(),
    url: z.string().nullish(),
  })).nullish(),
  originalLanguage: SonarrEpisodeLanguage.nullish(),
  remotePoster: z.string().nullish(),
  seasons: z.array(SonarrSeasonResource).nullish(),
  year: z.number(),
  path: z.string().nullish(),
  qualityProfileId: z.number().int(),
  seasonFolder: z.boolean().nullish(),
  monitored: z.boolean().nullish(),
  monitorNewItems: z.enum(["all", "none"]),
  useSceneNumbering: z.boolean().nullish(),
  runtime: z.number().nullish(),
  tvdbId: z.number().nullish(),
  tvRageId: z.number().nullish(),
  tvMazeId: z.number().nullish(),
  tmdbId: z.number().nullish(),
  firstAired: z.string().nullish(),
  lastAired: z.string().nullish(),
  seriesType: z.enum(["standard", "daily", "anime"]),
  cleanTitle: z.string().nullish(),
  imdbId: z.string().nullish(),
  titleSlug: z.string().nullish(),
  certification: z.string().nullish(),
  genres: z.array(z.string()).nullish(),
  tags: z.array(z.coerce.string()).nullish(),
  added: z.string().nullish(),
  addOptions: z.object({
    ignoreEpisodesWithFiles: z.boolean().nullish(),
    ignoreEpisodesWithoutFiles: z.boolean().nullish(),
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
    searchForMissingEpisodes: z.boolean().nullish(),
    searchForCutOffUnmetEpisodes: z.boolean().nullish(),
  }).nullish(),
  ratings: z.object({
    votes: z.number(),
    value: z.number(),
  }).nullish(),
  statistics: SonarrSeasonStatisticsResource.nullish(),
  eipsodesChanged: z.boolean().nullish(),
});

export const SonarrHistoryData = z.object({
  indexer: z.string().nullish(),
  nzbInfoUrl: z.string().nullish(),
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
  tvdbId: z.string().nullish(),
  tvRageId: z.string().nullish(),
  imdbId: z.string().nullish(),
  protocol: z.string().nullish(),
  customFormatScore: z.string().nullish(),
  seriesMatchType: z.string().nullish(),
  releaseSource: z.string().nullish(),
  indexerFlags: z.string().nullish(),
  releaseType: SonarrReleaseType.nullish(),
  torrentInfoHash: z.string().nullish(),
  fileId: z.string().nullish(),
  droppedPath: z.string().nullish(),
  importedPath: z.string().nullish(),
  reason: z.string().nullish(),
});

export const SonarrHistoryResource = z.object({
  id: z.number().int(),
  episodeId: z.number().int(),
  seriesId: z.number().int(),
  sourceTitle: z.string().nullish(),
  languages: z.array(SonarrEpisodeLanguage).nullish(),
  quality: SonarrQualityModel.nullish(),
  customFormats: z.array(SonarrCustomFormatModel).nullish(),
  customFormatScore: z.number().int(),
  qualityCutoffNotMet: z.boolean().nullish(),
  date: z.string(),
  downloadId: z.string().nullish(),
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
  data: SonarrHistoryData.nullish(),
  episodeFile: SonarrEpisodeFile.nullish(),
  series: SonarrSeriesResource.nullish(),
  hasFile: z.boolean().nullish(),
  monitored: z.boolean().nullish(),
  absoluteEpisodeNumber: z.number().int().nullish(),
  sceneAbsoluteEpisodeNumber: z.number().int().nullish(),
  sceneEpisodeNumber: z.number().int().nullish(),
  sceneSeasonNumber: z.number().int().nullish(),
  unverifiedSceneNumbering: z.boolean().nullish(),
  endTime: z.string().nullish(),
  grabDate: z.string().nullish(),
});

export type SonarrHistoryResource = z.infer<typeof SonarrHistoryResource>;
