<template>
  <!--    :style={height:this.screenHeight,width:this.screenWidth}-->
    <div class="login-container">
        <div class="login-form">
            <t-form class="t-form" :rules="rules" :data="formData" ref="form" @submit="onSubmit" :colon="true"
                    :labelWidth="0">
                <t-form-item name="account" class="item">
                    <t-input clearable v-model="formData.account" placeholder="请输入账户名">
                        <desktop-icon slot="prefix-icon"></desktop-icon>
                    </t-input>
                </t-form-item>
                <t-form-item name="password" class="item">
                    <t-input type="password" clearable v-model="formData.password" placeholder="请输入密码">
                        <lock-on-icon slot="prefix-icon"></lock-on-icon>
                    </t-input>
                </t-form-item>
                <t-form-item>
                    <t-button class="item" theme="primary" type="submit">登录</t-button>
                </t-form-item>
            </t-form>
        </div>
    </div>
</template>

<script>
import {DesktopIcon, LockOnIcon} from 'tdesign-icons-vue';
import {adminLogin} from "@/common/api";

const INITIAL_DATA = {
    account: '',
    password: '',
};
export default {
    name: "Login",
    components: {
        DesktopIcon,
        LockOnIcon,
    },
    data() {
        return {
            formData: {...INITIAL_DATA},
            screenWidth: document.documentElement.clientWidth - 10 + 'px', // 屏幕宽度
            screenHeight: document.documentElement.clientHeight - 20 + 'px', // 屏幕高度
            rules: {
                account: [
                    {
                        required: true,
                        message: '请输入账号',
                        type: 'error',
                        trigger: 'blur',
                    },
                    {required: true, message: '请输入账号', type: 'error'},
                    {whitespace: true, message: '请输入账号'}
                ],
                password: [
                    {
                        required: true,
                        message: '请输入密码',
                        type: 'error',
                        trigger: 'blur',
                    },
                    {required: true, message: '请输入密码', type: 'error'},
                    {whitespace: true, message: '请输入密码'}
                ]
            }
        }
    },
    methods: {
        onSubmit({validateResult, firstError}) {
            if (validateResult === true) {
                const jsons = {
                    account: this.formData.account,
                    password: this.formData.password
                }
                this.$axios.post(adminLogin, jsons).then(res => {
                    if (res.data.code === 10000) {
                        //存储信息
                        localStorage.setItem('userInfo', JSON.stringify(res.data.data));
                        localStorage.setItem('token', res.data.data.token);
                        this.$router.push({path: '/home/home'})
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
            } else {
                console.log('Errors: ', validateResult);
                this.$message.warning(firstError);
            }
        }
    },
    mounted() {
        let token = localStorage.getItem('token');
        if (token !== null) {
            this.$router.push({path: '/home/home'})
        }
    }
}
</script>

<style>
.login-container {
    background-image: url("../../assets/login.jpeg");
    background-size: 100% 100%;
    height: 100%;
    width: 100%;
    /*background-color: antiquewhite;*/
    position: absolute;
}

* {
    margin: 0;
    padding: 0;
}

.login-form {
    height: 300px;
    width: 400px;
    margin: 15% auto auto 10%;
    box-shadow: 4px 4px 15px #909090;
    border: 1px solid #909090;
}

.t-form {
    height: 200px;
    padding-top: 60px;
}

.item {
    width: 300px;
    margin-left: 50px;
}


</style>
