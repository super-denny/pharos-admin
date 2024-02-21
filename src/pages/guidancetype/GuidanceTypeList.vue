<template>
  <div>
    <div class="search_div">

      <div class="search_content">
        <p class="search_title">标题:</p>
        <t-input class="search_input" v-model="title" placeholder="标题" align="center"/>
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
          <t-button theme="primary" size="medium" @click="toDetailPage(row)" style="height:28px;width:50px;">
            查看
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
import {guidanceTypeUpdate, guidanceTypeList, deleteGuidanceType} from "@/common/api";

const data = [];

import {
  SearchIcon, RefreshIcon, AddIcon
} from 'tdesign-icons-vue';
import {post, get} from "@/common/http";

export default {
  name: "GuidanceTypeList",
  data() {
    return {
      visible1: false,
      screenHeight: document.documentElement.clientHeight - 220 + 'px',
      data,
      title: '',
      limitId: -1,
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
          title: '标题',
          colKey: 'title',
          width: 120,
          ellipsisTitle: true,
        },
        {
          title: '图标',
          colKey: 'icon',
          width: 120,
          cell: (h, {row}) => {
            return (
                <t-space>
                  <t-icon name={row.icon}/>
                </t-space>
            )
          },
        },
        {
          title: '创建时间',
          colKey: 'gmtCreate',
          width: 180,
        },
        {
          title: '操作',
          colKey: 'operation',
          width: 210,
          fixed: 'right'
        },
      ]
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
    renderIcon() {
      return <SearchIcon/>;
    },
    resetIcon() {
      return <RefreshIcon/>;
    },
    addIcon() {
      return <AddIcon/>;
    },
    onChange(pageInfo) {
      console.log('Page Info: ', pageInfo);
    },
    toAddPage(row) {
      this.$router.push({name: 'guidanceTypeUpdate', params: {id: row.id}})
    },
    toDetailPage(row) {
      this.$router.push({name: 'guidanceTypeDetail', params: {id: row.id}})
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
      this.title = '';
      this.requestList();
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
        title: this.title
      }
      post(guidanceTypeList, data).then(
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
          get(deleteGuidanceType, data).then(
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
    }
  }
}
</script>

<style scoped>
@import "../../common/style/common.css";
</style>
