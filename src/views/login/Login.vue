
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
          placeholder="请输入用户名"
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
          @keyup.native.enter="handleLogin"
          v-model="loginForm.password"
          autoComplete="on"
          placeholder="请输入密码"
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
          @click.native.prevent="handleLogin"
        >
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { setCookie, getCookie } from "@/utils/user";

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
    validateUsername() {},
    validatePassword() {},
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
          console.log("登录");
          return true;
        } else {
          console.log("参数验证不合法！");
          return false;
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
