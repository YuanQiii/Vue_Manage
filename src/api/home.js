import request from "@/utils/request";

export function orderStatisticsApi() {
    return request({
        url: "/orderStatistics",
        method: "get",
    });
}

export function overviewApi() {
    return request({
        url: "/overview",
        method: "get",
    });
}

export function affairsApi() {
    return request({
        url: "/affairs",
        method: "get",
    });
}
