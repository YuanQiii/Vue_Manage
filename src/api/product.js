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
    method: "get",
  });
}

// 商品列表获取
export function productListApi() {
  return request({
    url: "/productList",
    method: "get",
  });
}

// 商品详情获取
export function productDetailApi(id) {
  return request({
    url: "/productDetail",
    method: "get",
    params: {
      id,
    },
  });
}

// 商品属性获取
export function productAttributeListApi() {
  return request({
    url: "/productAttributeList",
    method: "get",
  });
}

// 商品关联话题获取
export function productSubjectListApi() {
  return request({
    url: "/productSubjectList",
    method: "get",
  });
}
