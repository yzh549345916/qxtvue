module.exports = {
  "publicPath": "/",
  "outputDir": "dist",
  "assetsDir": "assets",
  "productionSourceMap": false,
  "filenameHashing": false,
  "lintOnSave": true,
  "devServer": {
    "open": true,
    "proxy": {
      "/api": {
        "target": "http://172.18.142.203:3691/api",
        "changeOrigin": true,
        "pathRewrite": {
          "^/api": ""
        }
      }
    }
  },
  "css": {
    "extract": false,
    "sourceMap": false
  },
  "transpileDependencies": [
    "vuetify"
  ]
}