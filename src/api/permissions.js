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


// 角色菜单列表
export function roleMenuListApi(id = 1) {
    return request({
        url: "/roleMenuList",
        method: "get",
        params: {
            id
        }
    });
}

// 角色菜单子级
export function roleMenuChildrenApi(parentId) {
    return request({
        url: "/roleMenuChildren",
        method: "get",
        params: {
            parentId
        }
    });
}

// 角色资源分类
export function roleResourceCategoryListApi() {
    return request({
        url: "/roleResourceCategoryList",
        method: "get",
    });
}

// 角色资源列表
export function roleResourceListApi(id = 1) {
    return request({
        url: "/roleResourceList",
        method: "get",
        params: {
            id
        }
    });
}
