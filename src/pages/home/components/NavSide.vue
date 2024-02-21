<template>
    <t-menu theme="light" :value="this.currValue" defaultValue="dashboard" @change="changeHandler" >

        <t-menu-item value="dashboard" @click="index()">
            <icon name="home"/>
            首页
        </t-menu-item>

        <t-submenu value="1" title="管理员">
            <template #icon>
                <t-icon name="user"/>
            </template>
            <t-menu-item value="1-1" @click="adminList()">
                <span>管理员列表</span>
            </t-menu-item>
        </t-submenu>

        <t-submenu value="2" title="导航配置">
            <template #icon>
                <t-icon name="location"/>
            </template>
            <t-menu-item value="2-1" @click="guidanceTypeList()">
                <span>类目配置</span>
            </t-menu-item>
            <t-menu-item value="2-2" @click="guidanceList()">
                <span>导航配置</span>
            </t-menu-item>
        </t-submenu>

        <t-submenu value="3" title="提报审核">
            <template #icon>
                <t-icon name="link"/>
            </template>
            <t-menu-item value="3-1" @click="linkList()">
                <span>提报信息</span>
            </t-menu-item>
        </t-submenu>

        <t-submenu value="4" title="用户管理">
            <template #icon>
                <t-icon name="user"/>
            </template>
            <t-menu-item value="4-1" @click="userList()">
                <span>用户列表</span>
            </t-menu-item>
        </t-submenu>

    </t-menu>
</template>

<script>
import {Icon} from 'tdesign-icons-vue';

export default {
    name: "NavSide",
    components: {
        Icon
    },
    data() {
        return {
            currValue: 'dashboard'
        }
    },
    methods: {
        index() {
            this.$router.push({path: '/home/index'})
        },
        adminList() {
            this.$router.push({path: '/admin/adminList'})
        },
        guidanceTypeList() {
            this.$router.push({path: '/guidanceType/guidanceTypeList'})
        },
        linkList() {
            this.$router.push({path: '/link/submitLinkList'})
        },
        userList() {
            this.$router.push({path: '/user/userList'})
        },
        guidanceList() {
            this.$router.push({path: '/guidance/guidanceList'})
        },
        changeHandler(active) {
            this.currValue = active
        }
    }
}
</script>

<style scoped>

</style>
