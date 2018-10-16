module.exports = {
  lintOnSave: false,
  filenameHashing: false,
  productionSourceMap: false,
  devServer: {
    port: 8080,
    proxy: {
      '/api':{
        target:'https://api.douban.com',
        changeOrigin:true,
        pathRewrite:{
          '/api':'/v2/book'
        }
      }
    },
  }
};