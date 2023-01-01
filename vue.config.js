/*
 * @Author: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-01 21:21:41
 * @FilePath: \vue_manage\vue.config.js
 */
const { defineConfig } = require("@vue/cli-service");
const CompressionWebpackPlugin = require("compression-webpack-plugin")
const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

let externals = {
  'vue': 'Vue',
  'element-ui': 'ELEMENT',
  'echarts': 'echarts',
  'v-charts': 'VeIndex'
}
let cdn = {
  css: [
    'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/element-ui/2.15.6/theme-chalk/index.min.css'
  ],
  js: [
    'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/vue/2.6.14/vue.min.js',
    'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/element-ui/2.15.6/index.min.js',
    'https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/echarts/4.9.0-rc.1/echarts.min.js',
    'https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/v-charts/1.19.0/index.min.js',
  ]
}

module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,

  chainWebpack(config) {

    config.when(process.env.NODE_ENV === 'production', config => {

      // 排除
      config.set('externals', externals)

      // cdn
      config.plugin('html').tap(args => {
        args[0].cdn = cdn
        return args
      })

      // 关闭console.log
      config.optimization.minimizer('terser').tap(args => {
        args[0].terserOptions.compress.drop_console = true
        return args
      })

      // 拆包配置
      config.optimization.splitChunks({
        chunks: 'all', //三选一："initial" 初始化，"all"(默认就是all)，"async"（动态加载）
        minSize: 30000, // 形成一个新代码块最小的体积,只有 >= minSize 的bundle会被拆分出来 30000
        maxSize: 0, //拆分之前最大的数值，默认为0，即不做限制
        minChunks: 1, //引入次数，如果为2 那么一个资源最少被引用两次才可以被拆分出来
        maxAsyncRequests: 5, // 按需加载的最大并行请求数
        maxInitialRequests: 3, // 一个入口最大并行请求数
        automaticNameDelimiter: '~', // 文件名的连接符
        cacheGroups: {
          // node_modules模块包
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'chunk-vendors',
            chunks: 'all',
            priority: -10,
          },
          // 共享模块
          common: {
            name: 'chunk-common',
            minChunks: 2,
            maxSize: 1024, //拆分之前最大的数值，默认为0，即不做限制
            priority: -20,
            reuseExistingChunk: true
          }
        }
      })

      // 开启Gzip
      config.plugin('CompressionWebpackPlugin').use(new CompressionWebpackPlugin({
        test: /\.js$|\.html$|\.css$/, // 匹配文件名
        threshold: 10240, // 对超过10k的数据压缩
        minRatio: 0.8,
        deleteOriginalAssets: true // 删除源文件
      }))


    })


    // set svg-sprite-loader
    // 第一步：让其他svg loader不要对src/assets/imgs/svgs进行操作
    config.module.rule("svg").exclude.add(resolve("src/icons/svg")).end();
    // 第二步：使用svg-sprite-loader 对 src/assets/imgs/svgs下的svg进行操作
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons/svg"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      //定义规则 使用时 <svg class="icon"> <use xlink:href="#icon-svg文件名"></use>  </svg>
      .options({
        symbolId: "icon-[name]",
      })
      .end();
  },
});


