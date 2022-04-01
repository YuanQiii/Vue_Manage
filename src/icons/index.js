/*
 * @Author: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-01 21:38:17
 * @FilePath: \vue_manage\src\icons\index.js
 */
import Vue from 'vue'
import SvgIcon from '@/components/svgIcon/SvgIcon' // svg组件

// 注册全局组件
Vue.component('svg-icon', SvgIcon)

//require.context:读取指定目录文件
//第一个参数：目录，相对当前文件所读取文件的位置
//第二个参数：是否遍历子集目录
//第三个参数：定义遍历文件规则
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)