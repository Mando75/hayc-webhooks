export default {
  radarr: {
    host: "http://localhost:7878",
    apiKey: "<your api key>",
    upgradeTags: ["radarr-upgraded"],
    webhooks: {
      onDownload: ["tag-outdated-downloads"],
    },
  },
  qbit: {
    host: "http://localhost:8080",
    user: "your-username",
    pwd: "your-password",
  },
};
