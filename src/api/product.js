/*
 * @Author: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-05 14:59:04
 * @FilePath: \vue_manage\src\api\product.js
 */
import request from "@/utils/request";

// 商品筛选分类
export function productFilterCateApi() {
    return request({
        url: "/productFilterCate",
        method: "get"
    });
}

// 商品列表获取
export function productListApi() {
    return request({
        url: "/productList",
        method: "get"
    });
}