<template>
  <div>
    <div class="search_div">

      <div class="search_content">
        <p class="search_title">昵称:</p>
        <t-input class="search_input" v-model="nickname" placeholder="昵称" align="center"/>
      </div>

      <div class="search_content">
        <p class="search_title">账号:</p>
        <t-input class="search_input" v-model="account" placeholder="账号" align="center"/>
      </div>

      <div class="search_content">
        <p class="search_title">状态:</p>
        <t-select class="search_input" v-model="status">
          <t-option key="1" label="正常" :value="1"/>
          <t-option key="2" label="停用" :value="2"/>
        </t-select>
      </div>

      <div class="search_content_but">
        <t-button class="search_but" theme="primary" :icon="renderIcon" :onClick="search"> 搜索</t-button>
        <t-button class="search_but" theme="default" :icon="resetIcon" :onClick="rest"> 重置</t-button>
        <t-button class="search_but" theme="success" :icon="addIcon" :onClick="toAddPage"> 新增</t-button>
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
          <t-button v-if="row.status===1" theme="danger" size="medium" @click="limitLogin(row, 2)"
                    style="height:28px;width:50px;">
            停用
          </t-button>
          <t-button v-if="row.status===2" theme="success" size="medium" @click="limitLogin(row, 1)"
                    style="margin-left:3px;height:28px;width:50px;">
            启用
          </t-button>
          <t-button theme="success" size="medium" @click="toUpdatePwdPage(row)"
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
import {limitLogin, userList, deleteUser, deleteAdmin} from "@/common/api";
import {
  SearchIcon, RefreshIcon, AddIcon
} from 'tdesign-icons-vue';
import {post, get} from "@/common/http";

const data = [];
const columns = [
  {
    colKey: 'id',
    title: 'id',
    width: 90
  },
  {
    title: '昵称',
    colKey: 'nickname',
    width: 80,
    height: 80,
  },
  {
    title: '账号',
    colKey: 'account',
    width: 120,
    ellipsis: true,
  },
  {
    title: '状态',
    colKey: 'status',
    width: 120,
    cell(h, {row}) {
      const map = {
        1: {label: '正常', theme: 'success'},
        2: {label: '停用', theme: 'danger'},
      };
      return (
          <t-tag shape="round" theme={map[row.status].theme} variant="light">
            {map[row.status].label}
          </t-tag>)
    },
  },
  {
    title: '最近登录时间',
    colKey: 'gmtLastLogin',
    width: 180,
  },
  {
    title: '创建时间',
    colKey: 'gmtCreate',
    width: 180,
  },
  {
    title: '操作',
    colKey: 'operation',
    width: 240,
    fixed: 'right'
  },
];

export default {
  name: "UserList",
  data() {
    return {
      columns: [...columns],
      visible1: false,
      screenHeight: document.documentElement.clientHeight - 220 + 'px',
      data,
      nickname: '',
      account: '',
      limitId: -1,
      total: 0,
      current: 1,
      pageSize: 10,
      status: null,
    }
  },
  mounted() {
    this.requestList();
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
    limitLogin(row, status) {
      let id = row.id;
      const param = {
        "id": id,
        "status": status
      }
      post(limitLogin, param).then(
          res => {
            if (res.data.code !== 10000) {
              this.$message.error(res.data.msg);
            } else {
              this.requestList();
            }
          }
      )
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
          get(deleteUser, {id: id}).then(
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
    search: function () {
      this.requestList();
    },
    rest() {
      this.nickname = '';
      this.account = '';
      this.status = null;
      this.requestList();
    },
    toAddPage(row) {
      this.$router.push({name: 'userUpdate', params: {id: row.id}})
    },
    toUpdatePwdPage(row) {
      this.$router.push({name: 'userUpdatePwd', params: {id: row.id}})
    },
    requestList() {
      const data = {
        pageNo: this.current,
        pageSize: this.pageSize,
        nickname: this.nickname,
        account: this.account,
        status: this.status
      }
      post(userList, data).then(
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
