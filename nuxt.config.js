module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'cube-sim',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { href: 'https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.css', rel: 'stylesheet'},
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: 'https://use.fontawesome.com/releases/v5.1.0/js/all.js' }
    ]
  },

  // css: [
  //   'bulma'
  // ],

  loading: { color: '#3B8070' },

  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}

