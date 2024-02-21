<template>
  <t-descriptions title="导航详情" colon column="1">
    <t-descriptions-item label="标题">
      {{ formData.title }}
    </t-descriptions-item>
    <t-descriptions-item label="图标">
      <img :src="formData.icon" :style="{ width: '120px', height: '120px' }" alt=""/>
    </t-descriptions-item>
    <t-descriptions-item label="URL">
      {{ formData.url }}
    </t-descriptions-item>
    <t-descriptions-item label="类型">
      {{ formData.typeName }}
    </t-descriptions-item>
    <t-descriptions-item label="创建时间">
      {{ formData.gmtCreate }}
    </t-descriptions-item>
    <t-descriptions-item label="更新时间">
      {{ formData.gmtModify }}
    </t-descriptions-item>
  </t-descriptions>
</template>

<script>
import {get} from "@/common/http";
import {guidanceDetail} from "@/common/api";

const INITIAL_DATA = {
  title: '',
  icon: '',
  url: '',
  type: '',
  typeName: '',
  gmtCreate: '',
  gmtModify: ''
};
export default {
  name: "GuidanceDetail",
  data() {
    return {
      formData: {...INITIAL_DATA},
      options: [
        {
          value: 1,
          label: '普通'
        },
        {
          value: 2,
          label: '超级管理员',
        }
      ]
    };
  },
  mounted() {
    const data = {
      id: this.$route.params.id
    }
    get(guidanceDetail, data).then(
        res => {
          if (res.data.code !== 10000) {
            this.$message.error(res.data.msg);
          } else {
            this.formData = res.data.data;
          }
        }
    )
  }
}
</script>

<style scoped>

</style>
