/*
 * @Author: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-01 21:21:41
 * @FilePath: \vue_manage\vue.config.js
 */
const { defineConfig } = require("@vue/cli-service");

const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = defineConfig({
  transpileDependencies: true,

  chainWebpack(config) {
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
