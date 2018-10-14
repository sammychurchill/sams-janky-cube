require("dotenv").config();

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: "SJC - Sam's Janky Cube",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "Nuxt.js project" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico?v2" }],
    script: [
      {
        src: "https://use.fontawesome.com/releases/v5.1.0/js/all.js"
      }
    ]
  },
  css: [
    { src: "~assets/main.sass", lang: "sass" },
    { src: "font-awesome/scss/font-awesome.scss", lang: "scss" }
  ],
  // plugins: [{ src: "~/plugins/localStorage.js", ssr: false }],
  plugins: [{ src: "~/plugins/stickTo", ssr: false }],
  loading: { color: "#3B8070" },
  modules: [],

  build: {
    postcss: {
      plugins: {
        "postcss-custom-properties": false
      }
    },
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        });
      }
    }
  }
};
