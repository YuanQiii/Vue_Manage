<template>
  <div>
    <role-menu-detail :is-edit="true" />
  </div>
</template>

<script>

import RoleMenuDetail from "@/views/ums/menu/components/RoleMenuDetail";
export default {
  name: "AddRoleMenu",
  components: {RoleMenuDetail}
}
</script>

<style scoped>

</style>