<template>

  <t-form :data="formData" :rules="rules" ref="form" @reset="onReset" @submit="onSubmit">

    <t-form-item label="用户名" name="name" style="width: 400px;">
      <t-input v-model="formData.name" placeholder="请输入用户名"></t-input>
    </t-form-item>

    <t-form-item label="账号" name="account" style="width: 400px;">
      <t-input v-model="formData.account" placeholder="请输入账号"></t-input>
    </t-form-item>

    <t-form-item label="头像" name="avatar">
      <t-upload
          action="https://jlgateway-in.daily.webuy.ai/message/oss/imgUpload"
          theme="image"
          tips="请选择单张图片文件上传"
          accept="image/*"
          :formatResponse="formatImgResponse"
          name="fileUpload"
          v-model="avatar"
          :showImageFileName="false"
      ></t-upload>
    </t-form-item>

    <t-form-item label="类型" name="type" style="width: 400px;">
      <t-radio-group :options="options" v-model="formData.type" @change="onChange" allowUncheck></t-radio-group>
    </t-form-item>

    <t-form-item style="margin-left: 100px">
      <t-space size="10px">
        <t-button theme="primary" type="submit">提交</t-button>
        <t-button theme="default" variant="base" type="reset">重置</t-button>
      </t-space>
    </t-form-item>

  </t-form>

</template>

<script>
import {adminDetail, adminUpdate} from "@/common/api";
import {post,get} from "@/common/http";

const INITIAL_DATA = {
  name: '',
  account: '',
  type: ''
};
export default {
  name: "AdminUpdate",
  data() {
    return {
      formData: {...INITIAL_DATA},
      avatar: [],
      rules: {
        name: [
          {
            required: true,
            message: '用户名必填',
            type: 'error',
            trigger: 'blur',
          },
          // trigger 默认为 'change'
          {required: true, message: '用户名必填', type: 'error'},
          {whitespace: true, message: '用户名不能为空'},
          {
            min: 2,
            message: '用户名至少需要两个字符',
            type: 'warning',
            trigger: 'blur',
          },
          {
            max: 10,
            message: '用户名字符长度超出',
            type: 'warning',
            trigger: 'blur',
          },
        ],
        account: [
          {
            required: true,
            message: '账号必填',
            type: 'error',
            trigger: 'blur',
          },
          // trigger 默认为 'change'
          {required: true, message: '账号必填', type: 'error'},
          {whitespace: true, message: '账号不能为空'}
        ],
        type: [{required: true, message: '类型必填', type: 'error'}],
      },
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
  methods: {
    onReset() {
      this.$message.success('重置成功');
    },
    onSubmit({validateResult, firstError}) {
      if (validateResult === true) {
        const data = {
          id: this.$route.params.id,
          name: this.formData.name,
          account: this.formData.account,
          type: this.formData.type,
          avatar: this.avatar[0] === undefined ? '' : this.avatar[0].url,
        }
        post(adminUpdate, data).then(
            res => {
              if (res.data.code !== 10000) {
                this.$message.error(res.data.msg);
              } else {
                this.$router.push({name: 'adminList'})
              }
            }
        )
      } else {
        this.$message.warning(firstError);
      }
    },
    formatImgResponse(response) {
      if (response.responseCode !== 0) {
        return {error: response.msg};
      }
      let urlStr = "https://cdn.webuy.ai/" + response.entry[0];
      this.avatar = [{name: '', url: urlStr}];
      return {url: urlStr};
    },
    onChange(checkedValues) {
      console.log('checkedValues:', this.value, checkedValues);
    },
  },
  mounted() {
    if (this.$route.params.id !== undefined) {
      const data = {
        id: this.$route.params.id
      }
      get(adminDetail, data).then(
          res => {
            if (res.data.code !== 10000) {
              this.$message.error(res.data.msg);
            } else {
              this.formData = res.data.data;
              this.avatar = [{ name: '', url: res.data.data.avatar }]
            }
          }
      )
    }
  }
}
</script>

<style scoped>

</style>
