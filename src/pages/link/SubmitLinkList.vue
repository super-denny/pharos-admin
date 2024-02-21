<template>
  <div>
    <div class="search_div">

      <div class="search_content">
        <p class="search_title">标题:</p>
        <t-input class="search_input" v-model="nickname" placeholder="标题" align="center"/>
      </div>

      <div class="search_content">
        <p class="search_title">状态:</p>
        <t-select class="search_input" v-model="status">
          <t-option key="0" label="待审核" :value="0"/>
          <t-option key="1" label="审核通过" :value="1"/>
          <t-option key="2" label="已驳回" :value="2"/>
        </t-select>
      </div>

      <div class="search_content_but">
        <t-button class="search_but" theme="primary" :icon="renderIcon" :onClick="search"> 搜索</t-button>
        <t-button class="search_but" theme="default" :icon="resetIcon" :onClick="rest"> 重置</t-button>
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
          <t-button v-if="row.status===0" theme="success" size="medium" @click="pass(row, 1)"
                    style="height:28px;width:50px;">
            通过
          </t-button>
          <t-button v-if="row.status===0" theme="danger" size="medium" @click="pass(row, 2)"
                    style="margin-left:3px;height:28px;width:50px;">
            驳回
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
import {submitLinkAudit, submitLinkList} from "@/common/api";
import {
  SearchIcon, RefreshIcon, AddIcon
} from 'tdesign-icons-vue';
import {post} from "@/common/http";

const data = [];
const columns = [
  {
    colKey: 'id',
    title: 'id',
    width: 90
  },
  {
    title: '标题',
    colKey: 'title',
    width: 120,
    ellipsis: true,
  },
  {
    title: '图标',
    colKey: 'icon',
    width: 80,
    height: 80,
    cell(h, {row}) {
      return (
          <t-image src={row.icon}/>
      )
    },
  },
  {
    title: 'URL',
    colKey: 'url',
    width: 120,
    ellipsis: true,
  },
  {
    title: '状态',
    colKey: 'status',
    width: 120,
    cell(h, {row}) {
      const map = {
        0: {label: '待审核', theme: 'warning'},
        1: {label: '审核通过', theme: 'success'},
        2: {label: '已驳回', theme: 'danger'},
      };
      return (
          <t-tag shape="round" theme={map[row.status].theme} variant="light">
            {map[row.status].label}
          </t-tag>)
    },
  },
  {
    title: '提报人',
    colKey: 'userName',
    width: 180,
  },
  {
    title: '提报时间',
    colKey: 'gmtCreate',
    width: 180,
  },
  {
    title: '操作',
    colKey: 'operation',
    width: 210,
    fixed: 'right'
  },
];

export default {
  name: "SubmitLinkList",
  data() {
    return {
      columns: [...columns],
      visible1: false,
      screenHeight: document.documentElement.clientHeight - 220 + 'px',
      data,
      nickname: '',
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
    pass(row, status) {
      let id = row.id;
      const param = {
        "id": id,
        "status": status,
        "failReason": "信息不合规，请重新填写提报"
      }
      post(submitLinkAudit, param).then(
          res => {
            if (res.data.code !== 10000) {
              this.$message.error(res.data.msg);
            } else {
              this.requestList();
              this.$message.success("操作成功");
            }
          }
      )
    },
    toDetailPage(row) {
      this.$router.push({name: 'userDetail', params: {id: row.id}})
    },

    enablePop(row) {
      const data = {
        id: row.id,
        status: 1
      }
      post(guidanceTypeList, data).then(
          res => {
            if (res.data.code !== 10000) {
              this.$message.error(res.data.msg);
            } else {
              this.requestList();
            }
          }
      )
    },
    search: function () {
      this.requestList();
    },
    rest() {
      this.nickname = '';
      this.status = null;
    },
    onConfirm() {
      const data = {
        id: this.limitId
      }
      post(guidanceTypeUpdate, data).then(
          res => {
            if (res.data.code !== 10000) {
              this.$message.error(res.data.msg);
            } else {
              const data = {
                id: this.limitId,
                status: 2
              }
              post(guidanceTypeUpdate, data).then(
                  res => {
                    if (res.data.code !== 10000) {
                      this.$message.error(res.data.msg);
                    } else {
                      this.requestList();
                    }
                  }
              )
            }
          }
      )
      this.visible1 = false;
    },
    close1() {
      this.visible1 = false;
    },
    requestList() {
      const data = {
        pageNo: this.current,
        pageSize: this.pageSize,
        title: this.nickname,
        status: this.status
      }
      post(submitLinkList, data).then(
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
