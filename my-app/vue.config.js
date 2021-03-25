const path = require('path')
const PORT = 8080
const DEV_HOST = 'localhost'

module.exports = {
    pages: {
        index: {
            entry: 'src/dashboard/main.js',
            template: 'public/index.html',
            filename: 'index.html',
            title: 'Index Page',
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
        // when using the entry-only string format,
        // template is inferred to be `public/subpage.html`
        // and falls back to `public/index.html` if not found.
        // Output filename is inferred to be `subpage.html`.
        overlay: {
            entry: 'src/overlay/main.js',
            template: 'public/index.html',
            filename: 'overlay/index.html',
            title: 'Overlay',
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        }
    },
    devServer: {
      port: PORT,
      allowedHosts: [DEV_HOST],
      proxy: {
        '^/api': {
          target: 'http://localhost:3080',
          changeOrigin: true
        },
      },
    },
  }