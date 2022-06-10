<template>
  <div class="data-table">
    <el-table :data="tableData" >

      <template v-for="(value, index) in tableDataStructure" :key="index">
        <template v-if="Array.isArray((value))">

        </template>
        <template v-else>
          <el-table-column v-if="value.type === 'selection'"
                           :type="value.type"
                           align="center" />
          <el-table-column v-if="value.type === 'text'"
                           :label="value.label"
                           :prop="value.prop"
                           align="center" />
          <el-table-column v-if="value.type === 'image'"
                           :label="value.label"
                           :width="value.width"
                           align="center">
            <template v-slot="scope">
              <img :style="value.picStyle"
                   :src="scope.row[value.prop]"
            /></template>
          </el-table-column>
          <el-table-column label="标签" width="140" align="center">
            <template v-slot="scope">
              <el-switch
                  @change="value.callback(scope.$index, scope.row)"
                  :active-value="1"
                  :inactive-value="0"
                  v-model="scope.row.publishStatus"
              >
              </el-switch>
            </template>
          </el-table-column>
        </template>
      </template>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "DataTable",
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    tableDataStructure: {
      type: Array,
      default: () => []
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>

</style>