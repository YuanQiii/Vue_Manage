/*
 * @Author: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-05 15:12:08
 * @FilePath: \vue_manage\src\api\brand.js
 */
import request from "@/utils/request";

// 品牌筛选分类
export function brandListApi() {
    return request({
        url: "/brandList",
        method: "get"
    });
}