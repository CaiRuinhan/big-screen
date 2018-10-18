module.exports = {
  lintOnSave: false,
  filenameHashing: false,
  productionSourceMap: false,
  devServer: {
    port: 5678,
    proxy: {
      '/api':{
        target:'http://172.16.212.45:8079',
        changeOrigin:true,
        pathRewrite:{
          '/api':''
        }
      }
    },
  }
};