import { QbitApi } from "../../../clients/qbit.api.ts";

export async function tagDownloads(
  qbit: QbitApi,
  downloadHashes: string[],
  tag: string,
) {
  if (downloadHashes.length === 0) {
    console.log("No obsolete downloads found");
    return;
  }

  console.log(
    "Found the following obsolete downloads in sonarr:",
    downloadHashes,
  );
  console.log(`Adding tag ${tag} to obsolete downloads`);
  const downloadsInQbit = (await qbit.getTorrents(downloadHashes)).filter((t) =>
    !t.tags.includes(tag)
  ).map(
    (t) => ({
      hash: t.hash,
      name: t.name,
      tags: t.tags,
    }),
  );
  if (downloadsInQbit.length === 0) {
    console.log("No obsolete un-tagged downloads found in qbit");
    return;
  }

  console.log(
    "Found the following obsolete un-tagged downloads in qbit:",
    downloadsInQbit,
  );

  const qbitHashes = downloadsInQbit.map((t) => t.hash);
  await qbit.addTags(qbitHashes, [tag]);
  console.log("Tagging completed");
}
