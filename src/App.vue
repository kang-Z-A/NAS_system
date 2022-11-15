<script setup lang='ts'>

import { onMounted } from 'vue'
 
onMounted(() => {
  document.body.style.setProperty('--el-color-primary', '#979191');
})
</script>

<template>
  <div class="main">
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
@import './assets/font/font.css';
.main{
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
}
</style>
