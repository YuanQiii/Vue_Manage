<template>
  <div>
    <div>
      位置
      <el-input-number @change="handleChange" v-model="x" :min="0" :max="10000"></el-input-number>
      <el-input-number @change="handleChange" v-model="y" :min="0" :max="10000"></el-input-number>
    </div>
    <div>
      时间
      <el-slider
          v-model="time"
          :max="100000"
          show-input>
      </el-slider>
    </div>
  </div>
</template>

<script>
export default {
  name: "PositionKeyframe",
  props: ['dx','dy','dtime', 'id'],
  data(){
    return {
      x: this.dx,
      y: this.dy,
      time: this.dtime
    }
  },
  watch: {
    time(newVal){
      this.$emit('getKeyframeData', {
        x: this.x,
        y: this.y,
        time: newVal,
        id: this.id
      })
    }
  },
  methods: {
    handleChange(){
      this.$emit('getKeyframeData', {
        x: this.x,
        y: this.y,
        time: this.time,
        id: this.id
      })
    }
  }
}
</script>

<style scoped>

</style>