import { SonarrHistoryResource } from "../schemas/sonarr-history.ts";
import { z } from "zod";

export class SonarrApi {
  private readonly apiKey: string;
  private readonly host: string;

  constructor(host: string, apiKey: string) {
    this.host = host;
    this.apiKey = apiKey;
  }

  private async exec(req: Request) {
    this.setHeaders(req.headers);

    return await fetch(req).then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error(`Failed to execute request to Sonarr: ${res.statusText}`);
    });
  }

  private setHeaders(headers: Headers) {
    if (!headers.has("X-Api-Key")) headers.set("X-Api-Key", this.apiKey);
    if (!headers.has("Accept")) headers.set("Accept", "application/json");
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    return headers;
  }

  public async getSeriesHistory(
    seriesId: number,
    seasonNumber?: number,
    eventType?: SonarrHistoryResource["eventType"],
  ) {
    const searchParams = new URLSearchParams({
      seriesId: seriesId.toString(),
      includeSeries: "true",
      includeEpisode: "true",
    });
    if (seasonNumber) searchParams.set("seasonNumber", seasonNumber.toString());
    if (eventType) searchParams.set("eventType", eventType);

    const req = new Request(
      this.host + `/api/v3/history/series?${searchParams}`,
      {
        method: "GET",
      },
    );
    const res = await this.exec(req);
    return await z.array(SonarrHistoryResource).parseAsync(res);
  }
}
