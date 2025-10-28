// app.web.config.js
export default {
  name: "Witcher's Satchel (Web)",
  slug: "witchers-satchel-web",
  web: {
    bundler: "metro",
    favicon: "./assets/favicon.png",
  },
  experiments: {
    typedRoutes: false, // disables Expo Router route typing
  },
  extra: {
    note: "Web config sandbox to avoid htmlRoutes/runtime errors",
  },
  jsEngine: "jsc", // 👈 turn off Hermes for web
};
