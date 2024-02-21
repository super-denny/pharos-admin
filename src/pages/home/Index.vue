<template>
    <div class="content" :style="{height: screenHeight}">
        <div class="content-header">
            <t-card bordered :style="{ width: '24%',height: '100%',float:'left' }">
                <TopPanel :title="totalTitle" :count="totalCount"/>
            </t-card>
            <t-card bordered :style="{ width: '24%',height: '100%',float:'left', margin:'0 0 0 1%' }">
                <TopPanel :title="yesterdayTitle" :count="yesterdayCount"/>
            </t-card>
            <t-card bordered :style="{ width: '24%',height: '100%',float:'left', margin:'0 0 0 2%' }">
                <TopPanel :title="todayTitle" :count="todayCount"/>
            </t-card>
            <t-card bordered :style="{ width: '24%',height: '100%',float:'left', margin:'0 0 0 1%' }">
                <TopPanel :title="totalUrlTitle" :count="totalUrlCount"/>
            </t-card>
        </div>
        <div class="content-mid">
          <img src="../../assets/index_bk.jpeg"  style="width: 100%;height: 100%; object-fit: fill; opacity:0.3;"/>
        </div>
        <div class="content-footer">
        </div>
    </div>
</template>

<script>
import MiddleChart from "@/pages/home/components/MiddleChart";
import TopPanel from "@/pages/home/components/TopPanel";
import {post,get} from "@/common/http";
import {getStatistics, getTotalLink} from "@/common/api";

export default {
    name: "Index",
    components: {
        MiddleChart,
        TopPanel
    },
    data() {
        return {
            infoMessage: '',
            screenHeight: document.documentElement.clientHeight - 110 + 'px',
            totalTitle: '网站总访问数',
            yesterdayTitle: "昨日访问数",
            todayTitle: "今日访问数",
            totalUrlTitle: "总导航数",
            totalCount: 0,
            yesterdayCount: 0,
            todayCount: 0,
            totalUrlCount: -1
        };
    },
    mounted() {
        this.getVisits();
        this.getTotalUrl();
    },
    methods: {
        getVisits() {
            post(getStatistics, {"sceneValue": 1}).then(
                res => {
                    if (res.data.code !== 10000) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.totalCount = res.data.data.total
                        this.yesterdayCount = res.data.data.yesterday
                        this.todayCount = res.data.data.today
                    }
                }
            )
        },
        getTotalUrl() {
            get(getTotalLink, {}).then(
                res => {
                    if (res.data.code !== 10000) {
                        this.$message.error(res.data.msg);
                    } else {
                        this.totalUrlCount = res.data.data
                    }
                }
            )
        }
    }
}
</script>

<style scoped>

.content {
    width: 100%;
}

.content-header {
    height: 15%;
    width: 100%;
    flex: 1;
}

.content-mid {
    margin-top: 1%;
    height: 80%;
    width: 100%;
}

</style>
