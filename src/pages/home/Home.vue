<template>
  <div class="main" >
    <t-layout>
      <t-header :isFixed="true">
        <Head/>
      </t-header>
      <t-layout>
        <t-aside class="aside" :style={height:screenHeight}>
          <NavSide/>
        </t-aside>
        <t-layout>
          <t-content>
            <Content/>
          </t-content>
        </t-layout>
      </t-layout>
    </t-layout>
  </div>
</template>
<script>
import {Icon} from 'tdesign-icons-vue';
import Head from './components/Head';
import Content from './components/Content';
import NavSide from './components/NavSide';

export default {
  components: {
    Icon,
    Head,
    Content,
    NavSide
  },
  data() {
    return {
      screenWidth: document.documentElement.clientWidth - 100 + 'px', // 屏幕宽度
      screenHeight: document.documentElement.clientHeight - 60 + 'px' // 屏幕高度
    }
  },
  mounted(){
    this.$router.push({path: '/home/index'})
  }
};
</script>

<style>
.aside {
  margin-top: 2px;
}
.main {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
