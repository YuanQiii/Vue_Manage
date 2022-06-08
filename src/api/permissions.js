import request from "@/utils/request";

// 管理员列表
export function adminListApi() {
    return request({
        url: "/adminList",
        method: "get",
    });
}

// 角色列表
export function roleListApi() {
    return request({
        url: "/roleList",
        method: "get",
    });
}

// 管理员详情
export function adminDetailApi(id) {
    return request({
        url: "/adminDetail",
        method: "get",
        params: {
            id
        }
    });
}
