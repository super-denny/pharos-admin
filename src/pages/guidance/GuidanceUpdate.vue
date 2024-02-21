<template>

  <t-form :data="formData" :rules="rules" ref="form" @reset="onReset" @submit="onSubmit">

    <t-form-item label="标题" name="title" style="width: 400px;">
      <t-input v-model="formData.title" placeholder="请输入标题"></t-input>
    </t-form-item>

    <t-form-item label="图标" name="icon">
      <t-upload
          action="https://jlgateway-in.daily.webuy.ai/message/oss/imgUpload"
          theme="image"
          tips="请选择单张图片文件上传"
          accept="image/*"
          :formatResponse="formatImgResponse"
          name="fileUpload"
          v-model="icon"
          :showImageFileName="false"
      >
      </t-upload>
    </t-form-item>

    <t-form-item label="URL" name="url" style="width: 400px;">
      <t-input v-model="formData.url" placeholder="请输入地址"></t-input>
    </t-form-item>

    <t-form-item label="分类" name="type" style="width: 400px;">
      <t-select v-model="formData.type">
        <t-option v-for="item in typeList" :key=item.id :label=item.title :value=item.id></t-option>
      </t-select>
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
import {guidanceUpdate, guidanceDetail, allGuidanceTypeList} from "@/common/api";
import {post, get} from "@/common/http";

const INITIAL_DATA = {
  title: '',
  type: '',
  url: ''
};
export default {
  name: "GuidanceUpdate",
  data() {
    return {
      typeList: [{}],
      icon: [],
      formData: {...INITIAL_DATA},
      image: [],
      rules: {
        title: [
          {
            required: true,
            message: '标题必填',
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
            max: 10,
            message: '标题字符长度超出',
            type: 'warning',
            trigger: 'blur',
          },
        ],
        url: [{required: true, message: 'URL必填', type: 'error'}],
        type: [{required: true, message: '类型必填', type: 'error'}],
      }
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
          title: this.formData.title,
          icon: this.icon[0] === undefined ? '' : this.icon[0].url,
          url: this.formData.url,
          type: this.formData.type
        }
        post(guidanceUpdate, data).then(
            res => {
              if (res.data.code !== 10000) {
                this.$message.error(res.data.msg);
              } else {
                this.$router.push({name: 'guidanceList'})
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
      this.icon = [{name: '', url: urlStr}];
      return {url: urlStr};
    },
    onChange(checkedValues) {
      console.log('checkedValues:', this.value, checkedValues);
    }
  },
  mounted() {
    if (this.$route.params.id !== undefined) {
      const data = {
        id: this.$route.params.id
      }
      get(guidanceDetail, data).then(
          res => {
            if (res.data.code !== 10000) {
              this.$message.error(res.data.msg);
            } else {
              this.formData = res.data.data;
              this.icon = [{name: '', url: res.data.data.icon}];
            }
          }
      )
    }

    get(allGuidanceTypeList, {}).then(
        res => {
          if (res.data.code !== 10000) {
            this.$message.error(res.data.msg);
          } else {
            this.typeList = res.data.data;
          }
        }
    )

  }
}
</script>

<style scoped>

</style>
