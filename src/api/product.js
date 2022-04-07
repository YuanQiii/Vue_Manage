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

// 商品子类分类
export function productChildCateApi(id) {
  return request({
    url: "/productChildCate",
    method: "get",
    params: {
      id,
    },
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

// 商品属性分类获取
export function productAttrCateListApi() {
  return request({
    url: "/productAttrCateList",
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

// 商品规格
export function productSpecificationsApi(id) {
  return request({
    url: "/productSpecifications",
    method: "get",
    params: {
      id,
    },
  });
}

// 商品参数
export function productParamsApi(id) {
  return request({
    url: "/productParams",
    method: "get",
    params: {
      id,
    },
  });
}
