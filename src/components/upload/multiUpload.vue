<!--
 * @Autor: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-06 15:45:54
 * @FilePath: \vue_manage\src\components\upload\multiUpload.vue
-->
<template>
  <div>
    <el-upload
      :action="url"
      list-type="picture-card"
      :file-list="fileList"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
      :limit="maxCount"
      :on-exceed="handleExceed"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "multiUpload",
  props: {
    //图片属性数组
    value: Array,
    //最大上传图片数量
    maxCount: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      url: "https://www.imgurl.org/upload/aws_s3",
      dialogVisible: false,
      dialogImageUrl: null,
    };
  },
  computed: {
    fileList() {
      let fileList = [];
      this.value.forEach((element) => {
        fileList.push(element);
      });
      return fileList;
    },
  },
  methods: {
    emitInput(fileList) {
      let value = [];
      for (let i = 0; i < fileList.length; i++) {
        value.push(fileList[i].url);
      }
      this.$emit("input", value);
    },

    // 删除
    handleRemove(file, fileList) {
      this.emitInput(fileList);
    },

    // 预览
    handlePreview(file) {
      this.dialogVisible = true;
      this.dialogImageUrl = file.url;
    },

    // 上传成功
    handleUploadSuccess(res, file) {
      this.fileList.push({ name: res.name, url: res.url });
      this.emitInput(this.fileList);
    },

    // 超出数量限制
    handleExceed(files, fileList) {
      this.$message({
        message: "最多只能上传" + this.maxCount + "张图片",
        type: "warning",
      });
    },
  },
};
</script>
<style>
</style>


