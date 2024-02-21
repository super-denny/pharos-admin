<template>

    <t-form :data="formData" :rules="rules" ref="form" @reset="onReset" @submit="onSubmit">

        <t-form-item label="标题" name="title" style="width: 400px;">
            <t-input v-model="formData.title" placeholder="请输入标题"></t-input>
        </t-form-item>

        <t-form-item label="图标" name="value">
            <t-select
                    v-model="value"
                    placeholder="请选择"
                    :style="{ width: '300px' }"
                    :popup-props="{ overlayStyle: { width: '300px' } }"
            >
                <t-option v-for="item in options" :value="item.stem" :key="item.stem" class="overlay-options">
                    <div>
                        <t-icon :name="item.stem"/>
                    </div>
                </t-option>
                <div slot="valueDisplay">
                    <t-icon :name="value" :style="{ marginRight: '8px' }"/>
                    {{ value }}
                </div>
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
import {guidanceTypeUpdate,guidanceTypeDetail} from "@/common/api";
import {post,get} from "@/common/http";
import {manifest} from 'tdesign-icons-vue'; // 获取全部图标的列表

const INITIAL_DATA = {
    title: '',
    value: ''
};
export default {
    name: "GuidanceDetail",
    data() {
        return {
            formData: {...INITIAL_DATA},
            options: manifest,
            value: 'edit-1',
            title: '',
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
                ]
            }
        };
    },
    methods: {
        onReset() {
            this.formData.title = '';
            this.value = 'edit-1'
            this.$message.success('重置成功');
        },
        onSubmit({validateResult, firstError}) {
            if (validateResult === true) {
                const data = {
                    id: this.$route.params.id,
                    title: this.formData.title,
                    icon: this.value
                }
                post(guidanceTypeUpdate, data).then(
                    res => {
                        if (res.data.code !== 10000) {
                            this.$message.error(res.data.msg);
                        } else {
                            this.$router.push({name: 'guidanceTypeList'})
                        }
                    }
                )
            } else {
                this.$message.warning(firstError);
            }
        },
        formatImgResponse(response) {
            if (response.code !== 10000) {
                return {error: response.msg};
            }
            this.formData.avatar = response.data;
            return {url: response.data};
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
            get(guidanceTypeDetail, data).then(
                res => {
                    if (res.data.code !== 10000) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.formData.title = res.data.data.title;
                        this.value = res.data.data.icon;
                    }
                }
            )
        }
    }
}
</script>

<style scoped>
.overlay-options {
    display: inline-block;
    font-size: 20px;
}
</style>
