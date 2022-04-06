<!--
 * @Autor: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-06 13:41:24
 * @FilePath: \vue_manage\src\views\layout\components\navbar\Navbar.vue
-->
<template>
  <div class="navbar">
    <hamburger
      @click.native="UPDATE_SIDEBAR_STATUS"
      :isActive="Boolean(sidebarStatus)"
      class="hamburger"
    />
    <breadcrumb class="breadcrumb" />
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img class="user-avatar" :src="avatar" />
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <el-dropdown-item @click.native="goToHome">首页</el-dropdown-item>
        <el-dropdown-item divided>
          <span @click="logout">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import Hamburger from "@/components/hamburger/Hamburger.vue";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb.vue";

import { mapMutations, mapState } from "vuex";
import { removeToken } from "@/utils/auth";
export default {
  components: { Hamburger, Breadcrumb },
  name: "Navbar",
  computed: {
    ...mapState("app", ["sidebarStatus"]),
    ...mapState("user", ["avatar"]),
  },
  methods: {
    ...mapMutations("app", ["UPDATE_SIDEBAR_STATUS"]),
    ...mapMutations("user", ["SET_TOKEN", "SET_ROLES"]),
    goToHome() {
      this.$router.push({ name: "home" });
    },
    logout() {
      removeToken();
      this.SET_TOKEN("");
      this.SET_ROLES([]);
      this.$router.push({ name: "login" });
    },
  },
};
</script>

<style lang="less" scoped>
.navbar {
  display: flex;
  .hamburger {
    margin-left: 5px;
    margin-right: 20px;
  }
  .breadcrumb {
    margin-top: 1px;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>