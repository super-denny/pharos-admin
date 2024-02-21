<template>

  <t-form :data="formData" :rules="rules" ref="form" @reset="onReset" @submit="onSubmit">

    <t-form-item label="账号" name="account" style="width: 400px;">
      <t-input v-model="formData.account" placeholder="请输入账号"></t-input>
    </t-form-item>

    <t-form-item label="昵称" name="nickname" style="width: 400px;">
      <t-input v-model="formData.nickname" placeholder="请输入昵称"></t-input>
    </t-form-item>

    <t-form-item id="psw" label="密码" name="password" style="width: 400px;">
      <t-input v-model="formData.password" placeholder="请输入密码" type="password"></t-input>
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
import {updateUser, userDetail} from "@/common/api";
import {post, get} from "@/common/http";

const INITIAL_DATA = {
  account: '',
  nickname: '',
  password: ''
};
export default {
  name: "UserUpdate",
  data() {
    return {
      formData: {...INITIAL_DATA},
      rules: {
        account: [
          {
            required: true,
            message: '账号必填',
            type: 'error',
            trigger: 'blur',
          },
          {
            min: 1,
            message: '至少需要一个字符',
            type: 'warning',
            trigger: 'blur',
          },
          {
            max: 11,
            message: '账号长度超出',
            type: 'warning',
            trigger: 'blur',
          },
        ],
        nickname: [
          {
            required: true,
            message: '昵称必填',
            type: 'error',
            trigger: 'blur',
          },
          {
            min: 1,
            message: '至少需要一个字符',
            type: 'warning',
            trigger: 'blur',
          },
          {
            max: 20,
            message: '昵称长度超出',
            type: 'warning',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: '密码必填',
            type: 'error',
            trigger: 'blur',
          },
          {
            min: 1,
            message: '至少需要一个字符',
            type: 'warning',
            trigger: 'blur',
          },
          {
            max: 20,
            message: '密码长度超出',
            type: 'warning',
            trigger: 'blur',
          },
        ]
      }
    };
  },
  methods: {
    onReset() {
      this.formData.account = '';
      this.formData.nickname = ''
      this.formData.password = ''
      this.$message.success('重置成功');
    },
    onSubmit({validateResult, firstError}) {
      if (validateResult === true) {
        const data = {
          id: this.$route.params.id,
          account: this.formData.account,
          nickname: this.formData.nickname,
          password: this.formData.password
        }
        post(updateUser, data).then(
            res => {
              if (res.data.code !== 10000) {
                this.$message.error(res.data.msg);
              } else {
                this.$router.push({name: 'userList'})
              }
            }
        )
      } else {
        this.$message.warning(firstError);
      }
    },
    onChange(checkedValues) {
      console.log('checkedValues:', this.value, checkedValues);
    },
  },
  mounted() {
    if (this.$route.params.id !== undefined) {
      document.getElementById("psw").style.display = "none";
      const data = {
        id: this.$route.params.id
      }
      get(userDetail, data).then(
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
}
</script>

<style scoped>

</style>
