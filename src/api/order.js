import request from "@/utils/request";

// 订单列表
export function orderListApi() {
    return request({
        url: "/orderList",
        method: "get",
    });
}