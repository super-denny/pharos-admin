<template>

  <t-form :data="formData" :rules="rules" ref="form" @reset="onReset" @submit="onSubmit">

    <t-form-item id="psw" label="新密码" name="password" style="width: 400px;">
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
import {updateUserPwd} from "@/common/api";
import {post} from "@/common/http";

const INITIAL_DATA = {
  password: ''
};
export default {
  name: "UserUpdatePwd",
  data() {
    return {
      formData: {...INITIAL_DATA},
      rules: {
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
      this.formData.password = ''
      this.$message.success('重置成功');
    },
    onSubmit({validateResult, firstError}) {
      if (validateResult === true) {
        const data = {
          id: this.$route.params.id,
          password: this.formData.password
        }
        post(updateUserPwd, data).then(
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
    }
  }
}
</script>

<style scoped>

</style>
