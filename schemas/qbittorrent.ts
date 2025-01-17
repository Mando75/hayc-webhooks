import { z } from "zod";

export const QbittorrentTorrent = z.object({
  added_on: z.number().int(),
  amount_left: z.number().int(),
  auto_tmm: z.boolean(),
  availability: z.number(),
  category: z.string().nullish(),
  completed: z.number().int(),
  completion_on: z.number().int().nullish(),
  content_path: z.string(),
  dl_limit: z.number().int().nullish(),
  dlspeed: z.number().int(),
  downloaded: z.number().int(),
  downloaded_session: z.number().int(),
  eta: z.number().int().nullish(),
  f_l_piece_prio: z.boolean(),
  force_start: z.boolean(),
  hash: z.string(),
  last_activity: z.number().int(),
  magnet_uri: z.string().nullish(),
  max_ratio: z.number().nullish(),
  max_seeding_time: z.number().nullish(),
  name: z.string(),
  num_complete: z.number().int(),
  num_incomplete: z.number().int(),
  num_leechs: z.number().int(),
  num_seeds: z.number().int(),
  priority: z.number().int(),
  progress: z.number(),
  ratio: z.number(),
  ratio_limit: z.number().nullish(),
  save_path: z.string(),
  seeding_time_limit: z.number().nullish(),
  seen_complete: z.number().int().nullish(),
  seq_dl: z.boolean(),
  size: z.number().int(),
  state: z.enum([
    "error",
    "missingFiles",
    "uploading",
    "stoppedUP",
    "queuedUP",
    "stalledUP",
    "checkingUP",
    "forcedUP",
    "allocating",
    "downloading",
    "metaDL",
    "stoppedDL",
    "queuedDL",
    "stalledDL",
    "checkingDL",
    "forcedDL",
    "checkingResumeData",
    "moving",
    "unknown",
  ]),
  super_seeding: z.boolean(),
  tags: z.string().nullish().transform((val) =>
    val?.split(",").map((t) => t.trim()) ?? []
  ),
  time_active: z.number().int(),
  total_size: z.number().int(),
  tracker: z.string().nullish(),
  up_limit: z.number().int().nullish(),
  uploaded: z.number().int(),
  uploaded_session: z.number().int(),
  upspeed: z.number().int(),
});
