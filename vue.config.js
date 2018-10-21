const path = require('path')
module.exports = {
  baseUrl: process.env.NODE_ENV === 'production' ? './' : '/',
  outputDir: 'dist',
  assetsDir: './',
  lintOnSave: false,
  filenameHashing: false,
  productionSourceMap: false,
  devServer: {
    //host:'localhost',
    //open:true,
    port: 5678,
    // proxy: {
    //   '/api':{
    //     target:'http://172.16.212.45:8079',
    //     changeOrigin:true,
    //     pathRewrite:{
    //       '/api':''
    //     }
    //   }
    // },
    proxy: process.env.VUE_APP_API_URL
  },
  configureWebpack: (config) => {    
    if (process.env.NODE_ENV === 'production') {
      //  为生产环境修改配置...            
    } else {
      //  为开发环境修改配置...      
    }
    config.resolve.alias['@com'] = path.resolve(__dirname, './src/components');//  添加别名    
    config.resolve.extensions.push('.css');// 添加可省略的扩展名
    console.log(config)
  },
};