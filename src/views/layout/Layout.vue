<template>
  <div class="layout">
    <sidebar class="sidebar" />

    <div class="container">
      <navbar />
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script>
import Navbar from "./components/navbar/Navbar.vue";
import Sidebar from "./components/sidebar/Sidebar.vue";
export default {
  components: { Sidebar, Navbar },
  name: "Layout",
};
</script>

<style lang="less" scoped>
.layout {
  position: relative;
  display: flex;
  .sidebar {
    display: block;
    position: sticky;
    left: 0;
    top: 0;
    width: 180px;
    height: 100vh;
    overflow: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .container {
    width: 85%;
    padding-top: 20px;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>