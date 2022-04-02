/*
 * @Autor: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-02 14:15:30
 * @FilePath: \vue_manage\src\api\user.js
 */
import request from "@/utils/request";

export function adminLoginApi(username, password) {
  return request({
    url: "/adminLogin",
    method: "post",
    data: {
      username,
      password,
    },
  });
}
