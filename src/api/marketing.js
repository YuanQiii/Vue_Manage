/*
 * @Author: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-14 21:16:43
 * @FilePath: \vue_manage\src\api\marketing.js
 */
import request from "@/utils/request";

export function couponListApi() {
    return request({
        url: "/couponList",
        method: "get",
    });
}

export function couponDetailApi(id) {
    return request({
        url: "/couponDetail",
        method: "get",
        params: {
            id
        }
    });
}

export function couponHistoryApi(id) {
    return request({
        url: "/couponHistory",
        method: "get",
        params: {
            id
        }
    });
}