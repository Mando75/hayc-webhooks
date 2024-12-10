import { z } from "zod";
import {
  RadarrHistory,
  RadarrHistorySchema,
} from "../schemas/radarr-history.ts";

export class RadarrApi {
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
      throw new Error(`Failed to execute request to Radarr: ${res.statusText}`);
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

  async getMovieHistory(
    movieId: number,
    eventType?: RadarrHistory["eventType"],
  ): Promise<Array<RadarrHistory>> {
    const searchParams = new URLSearchParams({ movieId: String(movieId) });
    if (eventType) searchParams.set("eventType", eventType);

    const req = new Request(
      this.host + `/api/v3/history/movie?${searchParams}`,
      {
        method: "GET",
      },
    );
    const res = await this.exec(req);

    return z.array(RadarrHistorySchema).parseAsync(res);
  }
}
