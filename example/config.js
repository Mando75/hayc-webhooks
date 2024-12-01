export default {
  radarr: {
    host: "http://localhost:7878",
    apiKey: "<your api key>",
    webhooks: {
      onDownload: [{
        action: "tag-outdated-downloads",
        tag: "radarr-upgraded",
      }],
    },
  },
  qbit: {
    host: "http://localhost:8080",
    user: "your-username",
    pwd: "your-password",
  },
};