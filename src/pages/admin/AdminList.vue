<template>
  <div>
    <div class="search_div">

      <div class="search_content">
        <p class="search_title">用户名:</p>
        <t-input class="search_input" v-model="name" placeholder="用户名" align="center"/>
      </div>

      <div class="search_content">
        <p class="search_title">账 号:</p>
        <t-input class="search_input" v-model="account" placeholder="账号" align="center"/>
      </div>

      <div class="search_content_but">
        <t-button class="search_but" theme="primary" :icon="renderIcon" :onClick="search">搜索</t-button>
        <t-button class="search_but" theme="default" :icon="resetIcon" :onClick="rest">重置</t-button>
        <t-button class="search_but" theme="success" :icon="addIcon" :onClick="toAddPage">新增</t-button>
      </div>

    </div>

    <div style="margin-top: 15px;">
      <t-table
          row-key="index"
          :data="data"
          :columns="columns"
          :maxHeight="screenHeight"
      >
        <template #operation="{ row }">
          <t-button theme="primary" size="medium" @click="toDetailPage(row)" style="height:28px;width:50px;">
            查看
          </t-button>
          <t-button v-if="showBut" theme="success" size="medium" @click="toUpdatePwdPage(row)"
                    style="margin-left:3px; height:28px;width:70px;">
            修改密码
          </t-button>
          <t-button theme="warning" size="medium" @click="toAddPage(row)"
                    style="margin-left:3px; height:28px;width:50px;">
            编辑
          </t-button>
          <t-button theme="danger" size="medium" @click="del(row.id)"
                    style="margin-left:3px; height:28px;width:50px;">
            删除
          </t-button>
        </template>
      </t-table>
    </div>

    <div>
      <t-pagination v-model="current"
                    :total="total"
                    :page-size.sync="pageSize"
                    :showPageSize="false"
                    @current-change="onCurrentChange"
                    style="margin-top: 5px"/>
    </div>
  </div>
</template>

<script>
import {adminList, deleteAdmin} from "@/common/api";

const data = [];

import {
  SearchIcon, RefreshIcon, AddIcon
} from 'tdesign-icons-vue';
import {get, post} from "@/common/http";

export default {
  name: "AdminList",
  data() {
    return {
      visible1: false,
      image: 'https://tdesign.gtimg.com/site/avatar.jpg',
      screenHeight: document.documentElement.clientHeight - 220 + 'px',
      data,
      showBut: true,
      name: '',
      account: '',
      deleteId: -1,
      total: 0,
      current: 1,
      pageSize: 10,
      columns: [
        {
          colKey: 'id',
          title: 'id',
          ellipsis: true,
          width: 90
        },
        {
          title: '头像',
          colKey: 'avatar',
          width: 120,
          cell: (h, {row}) => {
            return (
                <t-avatar image={row.avatar}/>
            )
          },
        },
        {
          colKey: 'name',
          title: '用户名',
          width: 150,
        },
        {
          title: '账号',
          colKey: 'account',
          width: 150,
          ellipsisTitle: true,
        },
        {
          title: '类型',
          colKey: 'type',
          width: 120,
          cell(h, {row}) {
            const map = {
              1: {label: '普通管理员', theme: 'success'},
              2: {label: '超级管理员', theme: 'danger'},
            };
            return (
                <t-tag shape="round" theme={map[row.type].theme} variant="light">
                  {map[row.type].label}
                </t-tag>)
          }
        },
        {
          title: '状态',
          colKey: 'status',
          // 浮层浅色背景，方向默认朝下出现
          width: 120,
          cell(h, {row}) {
            const map = {
              1: {label: '正常', theme: 'success'},
              2: {label: '停用', theme: 'danger'},
            };
            return (
                <t-tag theme={map[row.status].theme}>
                  {map[row.status].label}
                </t-tag>)
          }
        },
        {
          title: '注册时间',
          colKey: 'gmtCreate',
          width: 180,
        },
        {
          title: '更新时间',
          colKey: 'gmtModify',
          width: 180,
        },
        {
          title: '操作',
          colKey: 'operation',
          width: 270,
          fixed: 'right'
        },
      ]
    }
  },
  mounted() {
    this.requestList();
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo !== null && userInfo.type !== 2) {
      this.showBut = false;
    }
  },
  methods: {
    onPageSizeChange(size, pageInfo) {
      console.log('Page Size:', this.pageSize, size, pageInfo);
    },
    onCurrentChange(current, pageInfo) {
      this.current = current;
      this.requestList();
    },
    onChange(pageInfo) {
      console.log('Page Info: ', pageInfo);
    },
    renderIcon() {
      return <SearchIcon/>;
    },
    resetIcon() {
      return <RefreshIcon/>;
    },
    addIcon() {
      return <AddIcon/>;
    },
    toAddPage(row) {
      this.$router.push({name: 'adminUpdate', params: {id: row.id}})
    },
    toDetailPage(row) {
      this.$router.push({name: 'adminDetail', params: {id: row.id}})
    },
    toUpdatePwdPage(row) {
      this.$router.push({name: 'adminUpdatePwd', params: {id: row.id}})
    },
    search: function () {
      this.requestList();
    },
    rest() {
      this.name = ''
      this.account = ''
      this.requestList()
    },
    del(id) {
      const alertDia = this.$dialog.alert({
        header: '警告',
        body: '确定要删除吗？',
        confirmBtn: {
          content: '确定',
          variant: 'base',
          theme: 'danger',
        },
        onConfirm: ({}) => {
          const data = {
            id: id
          }
          get(deleteAdmin, data).then(
              res => {
                if (res.data.code !== 10000) {
                  this.$message.error(res.data.msg);
                } else {
                  this.requestList();
                }
              }
          )
          alertDia.hide();
        },
        onClose: ({}) => {
          alertDia.hide();
        },
      });
    },
    close1() {
      this.visible1 = false;
    },
    requestList() {
      const data = {
        pageNo: this.current,
        pageSize: this.pageSize,
        name: this.name,
        account: this.account
      }
      post(adminList, data).then(
          res => {
            if (res.data.code !== 10000) {
              this.$message.error(res.data.msg);
            } else {
              this.data = res.data.data.list;
              this.total = res.data.data.total
            }
          }
      )
    },
  }
}
</script>

<style scoped>
@import "../../common/style/common.css";
</style>
