<template>
  <t-card bordered :style="{width: screenWidth ,height:'96%', margin:'1% auto auto auto'}">
    <div id="app"><router-view/></div>
  </t-card>
</template>

<script>
export default {
  name: "Content",
  data() {
    return {
      screenWidth: document.documentElement.clientWidth - 260 + 'px', // 屏幕宽度
      screenHeight: document.documentElement.clientHeight - 60 + 'px' // 屏幕高度
    }
  }
}

</script>

<style scoped>

</style>
