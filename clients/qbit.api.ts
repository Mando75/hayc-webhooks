export class QbitApi {
  private readonly host: string;
  private readonly username: string;
  private readonly password: string;
  private cookie: string;

  constructor(host: string, username: string, password: string) {
    this.host = host;
    this.username = username;
    this.password = password;
    this.cookie = "";
  }

  private async login() {
    const params = new URLSearchParams({
      username: this.username,
      password: this.password,
    });
    const request = new Request(this.host + `/api/v2/auth/login`, {
      method: "POST",
      body: params,
      headers: {
        "Referer": "http://localhost:8000",
      },
    });
    const cookie = await fetch(request).then((res) => {
      return res.headers.get("set-cookie");
    });
    if (!cookie) {
      throw new Error("Failed to login to qBittorrent");
    }
    return cookie;
  }

  private async exec(req: Request) {
    if (!this.cookie) {
      this.cookie = await this.login();
    }
    this.setHeaders(req.headers);
    return await fetch(req).then((res) => {
      if (res.ok) {
        return res;
      }
      throw new Error(`Failed to execute request: ${res.statusText}`);
    });
  }

  private setHeaders(headers: Headers) {
    if (!headers.has("Cookie")) headers.set("Cookie", this.cookie);
    if (!headers.has("Accept")) headers.set("Accept", "application/json");
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/x-www-form-urlencoded");
    }
    return headers;
  }

  async addTags(hashes: Array<string>, tags: Array<string>) {
    const hashString = hashes.join("|");
    const tagString = tags.join(",");

    const req = new Request(this.host + "/api/v2/torrents/addTags", {
      method: "POST",
      body: new URLSearchParams({ hashes: hashString, tags: tagString }),
    });

    return await this.exec(req);
  }
}
