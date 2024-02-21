<template>
  <t-head-menu theme="light">

    <template #logo>
      <img height="28" src='../../../assets/logo.png' style="margin-left: 30px;"/>
    </template>

    <template #operations>
      <div class="tdesign-demo-dropdown" style="margin-right: 30px;">
        <t-avatar :image="image" :hideOnLoadFailed="false"></t-avatar>
        <t-dropdown :options="options" @click="clickHandler" style="margin-left: 3px;">
          <span class="tdesign-demo-dropdown__text">
            {{ name }}
              <chevron-down-icon size="16"/>
            </span>
        </t-dropdown>
      </div>
    </template>
  </t-head-menu>
</template>
<script>
import {
  ChevronDownIcon,
} from 'tdesign-icons-vue';
import {get} from "@/common/http";
import {adminLogout} from "@/common/api";

export default {
  name: "Head",
  components: {
    ChevronDownIcon
  },
  data() {
    return {
      image: '',
      name: '',
      options: [
        {
          content: '退出登录',
          value: 1,
        }
      ],
    }
  },
  methods: {
    clickHandler(data) {
      if (data.value === 1) {
        get(adminLogout, {}).then(
            res => {
              if (res.data.code !== 10000) {
                this.$message.error(res.data.msg);
              } else {
                localStorage.removeItem('userInfo');
                localStorage.removeItem('token');
                this.$router.push({path: '/'})
              }
            }
        )
      }
    },
  },
  mounted() {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo === null) {
      this.$router.push({path: '/login'})
    }
    this.image = userInfo.avatar
    this.name = userInfo.name
  }
}
</script>

<style scoped>

</style>
