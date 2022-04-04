
<template>
  <el-card class="login-form-layout">
    <el-form
      autoComplete="on"
      :model="loginForm"
      :rules="loginRules"
      ref="loginForm"
      label-position="left"
    >
      <div style="text-align: center">
        <svg-icon
          icon-class="login-mall"
          style="width: 56px; height: 56px; color: #409eff"
        ></svg-icon>
      </div>
      <h2 class="login-title color-main">vue_manage</h2>
      <el-form-item prop="username">
        <el-input
          name="username"
          type="text"
          v-model="loginForm.username"
          autoComplete="on"
          placeholder="请输入用户名，admin/productAdmin/orderAdmin"
        >
          <span slot="prefix">
            <svg-icon icon-class="user" class="color-main"></svg-icon>
          </span>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          name="password"
          :type="pwdType"
          @keyup.enter="handleLogin"
          v-model="loginForm.password"
          autoComplete="on"
          placeholder="请输入密码，测试密码为123456"
        >
          <span slot="prefix">
            <svg-icon icon-class="password" class="color-main"></svg-icon>
          </span>
          <span slot="suffix" @click="showPwd">
            <svg-icon icon-class="eye" class="color-main"></svg-icon>
          </span>
        </el-input>
      </el-form-item>
      <el-form-item style="margin-bottom: 60px; text-align: center">
        <el-button
          style="width: 45%"
          type="primary"
          :loading="loading"
          @click.prevent="handleLogin"
        >
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { setCookie, getCookie } from "@/utils/user";

import { adminLoginApi } from "@/api/user";
import { setToken, removeToken } from "@/utils/auth";
import { mapMutations } from "vuex";

export default {
  name: "Login",
  created() {
    this.loginForm.username = getCookie("username");
    this.loginForm.password = getCookie("password");
    if (
      this.loginForm.username === undefined ||
      this.loginForm.username == null ||
      this.loginForm.username === ""
    ) {
      this.loginForm.username = "admin";
    }
    if (
      this.loginForm.password === undefined ||
      this.loginForm.password == null
    ) {
      this.loginForm.password = "";
    }
  },
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: this.validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: this.validatePassword },
        ],
      },
      loading: false,
      pwdType: "password",
    };
  },
  methods: {
    ...mapMutations("user", ["SET_TOKEN"]),

    validateUsername(rule, value, callback) {
      let temp = value.trim();
      console.log(temp);
      if (temp == "admin" || temp == "productAdmin" || temp == "orderAdmin") {
        callback();
      } else {
        callback(new Error("请输入正确的用户名"));
      }
    },
    validatePassword(rule, value, callback) {
      if (value == "123456") {
        callback();
      } else {
        callback(new Error("密码错误"));
      }
    },
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          adminLoginApi().then((response) => {
            setCookie("username", this.loginForm.username, 15);
            setCookie("password", this.loginForm.password, 15);
            setToken(response.token);

            this.SET_TOKEN(response.token);

            this.$router.push({ path: "/" });
            this.loading = false;
          });
        } else {
          console.log("参数验证不合法！");
        }
      });
    },
  },
};
</script>

<style scoped>
.login-form-layout {
  position: absolute;
  left: 0;
  right: 0;
  width: 360px;
  margin: 140px auto;
  border-top: 10px solid #409eff;
}

.login-title {
  text-align: center;
}

.login-center-layout {
  background: #409eff;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  margin-top: 200px;
}
</style>
