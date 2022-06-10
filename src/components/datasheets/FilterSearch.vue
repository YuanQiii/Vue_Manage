<template>
  <div class="filter-search" v-if="Object.keys(filterData).length !== 0">
    <el-card class="filter-container" shadow="never">
      <div class="header">
        <div class="icon">
          <i class="el-icon-search"></i>
          <span>筛选搜索</span>
        </div>
        <div class="button">
          <el-button class="btn-reset" @click="handleReset" size="small">
            重置
          </el-button>
          <el-button
              class="btn-search"
              type="primary"
              @click="handleSearch"
              size="small"
          >
            查询搜索
          </el-button>
        </div>
      </div>
      <div class="filter">

        <el-form
            :inline="true"
            :model="filterConditions"
            size="small"
            label-width="140px"
        >

<!--          输入框-->
          <el-form-item :label="value.label" v-for="(value, index) in filterData.input" :key="index + value.label">
            <el-input
                v-model="filterConditions[value.keyword]"
                :placeholder="value.placeholder"
            ></el-input>
          </el-form-item>

<!--          选择器-->
          <el-form-item :label="value.label" v-for="(value, index) in filterData.select" :key="index + value.label">
            <el-select
                v-model="filterConditions[value.keyword]"
                :placeholder="value.placeholder"
                clearable
            >
              <el-option
                  v-for="item in value.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

<!--          级联选择器-->
          <el-form-item :label="value.label" v-for="(value, index) in filterData.cascader" :key="index + value.label">
            <el-cascader
                clearable
                v-model="filterConditions[value.keyword]"
                :placeholder="value.placeholder"
                :options="value.options"
                :props="{ expandTrigger: 'hover' }"
            >
            </el-cascader>
          </el-form-item>

        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "FilterSearch",
  props: {
    filterData: {
      type: Object,
      default: () => ({})
    },
  },
  data(){
    return {
      filterConditions: {}
    }
  },
  methods: {
    handleReset(){
      this.filterConditions = {}
      this.$emit('handleReset', this.filterConditions)
    },
    handleSearch(){
      this.$emit('handleSearch', this.filterConditions)
    }
  }
};
</script>

<style lang="less" scoped>
.filter-search{
  .filter-container{
    .header{
      display: flex;
      justify-content: space-between;
      position: relative;
      margin-bottom: 20px;
      .icon{
        display: flex;
        align-self: center;
        .el-icon-search {
          margin-right: 5px;
          position: relative;
          top: 2px;
        }
      }
    }
  }
}
</style>