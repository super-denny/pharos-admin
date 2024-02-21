<template>
  <t-descriptions title="管理员详情" colon column="1" >
    <t-descriptions-item label="用户名">
      {{ formData.name }}
    </t-descriptions-item>
    <t-descriptions-item label="账号">
      {{formData.account}}
    </t-descriptions-item>
    <t-descriptions-item label="头像">
      <img :src="formData.avatar" :style="{ width: '120px', height: '120px' }"/>
    </t-descriptions-item>
    <t-descriptions-item label="类型">
      <t-radio-group :options="options" v-model="formData.type" disabled/>
    </t-descriptions-item>
    <t-descriptions-item label="状态">
      <t-radio-group :options="status" v-model="formData.status" disabled/>
    </t-descriptions-item>
    <t-descriptions-item label="注册时间">
      {{ formData.gmtCreate}}
    </t-descriptions-item>
    <t-descriptions-item label="更新时间">
      {{ formData.gmtModify}}
    </t-descriptions-item>
  </t-descriptions>
</template>

<script>
import {get} from "@/common/http";
import {adminDetail} from "@/common/api";

export default {
    name: "AdminDetail",
    data() {
        return {
            formData: {},
            options: [
                {
                    value: 1,
                    label: '普通'
                },
                {
                    value: 2,
                    label: '超级管理员',
                }
            ],
            status: [
                {
                    value: 1,
                    label: '正常'
                },
                {
                    value: 2,
                    label: '停用',
                }
            ]
        };
    },
    mounted() {
        const data = {
            id: this.$route.params.id
        }
        get(adminDetail, data).then(
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
