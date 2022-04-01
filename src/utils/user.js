/*
 * @Autor: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-01 17:14:08
 * @FilePath: \vue_manage\src\utils\user.js
 */
import Cookies from "js-cookie";

export function setCookie(key, value, expires) {
  return Cookies.set(key, value, { expires: expires });
}

export function getCookie(key) {
  return Cookies.get(key);
}
