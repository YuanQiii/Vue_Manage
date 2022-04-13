/*
 * @Autor: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-11 09:37:53
 * @FilePath: \vue_manage\src\api\order.js
 */
import request from "@/utils/request";

// 订单列表
export function orderListApi() {
  return request({
    url: "/orderList",
    method: "get",
  });
}

// 订单设置
export function orderSettingApi() {
  return request({
    url: "/orderSetting",
    method: "get",
  });
}

// 退货订单列表
export function orderRetuenApplyListApi() {
  return request({
    url: "/orderRetuenApplyList",
    method: "get",
  });
}


// 订单发货地址列表
export function orderRetuenApplyDetailApi(id) {
  return request({
    url: "/orderRetuenApplyDetail",
    method: "get",
    params: {
      id
    }
  });
}

// 订单发货地址列表
export function companyAddressListApi() {
  return request({
    url: "/companyAddressList",
    method: "get",
  });
}