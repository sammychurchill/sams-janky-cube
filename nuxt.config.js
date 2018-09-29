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
    link: [
      {
        href:
          "https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.css",
        rel: "stylesheet"
      },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }
    ],
    script: [{ src: "https://use.fontawesome.com/releases/v5.1.0/js/all.js" }]
  },
  plugins: [{ src: "~/plugins/localStorage.js", ssr: false }],
  loading: { color: "#3B8070" },

  server: {
    port: 3000, // default: 3000
    host: "0.0.0.0" // default: localhost
  },

  build: {
    /*
    ** Run ESLint on save
    */
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
