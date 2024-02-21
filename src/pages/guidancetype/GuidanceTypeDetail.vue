<template>
    <t-descriptions title="类目详情" colon column="1" >
        <t-descriptions-item label="标题">
            {{ formData.title }}
        </t-descriptions-item>
        <t-descriptions-item label="图标">
            <t-icon :name="formData.icon"/>
        </t-descriptions-item>
    </t-descriptions>
</template>

<script>
import {get} from "@/common/http";
import {guidanceTypeDetail} from "@/common/api";

const INITIAL_DATA = {
    title: '',
    icon: ''
};
export default {
    name: "GuidanceTypeDetail",
    data() {
        return {
            formData: {...INITIAL_DATA}
        };
    },
    mounted() {
        const data = {
            id: this.$route.params.id
        }
        get(guidanceTypeDetail, data).then(
            res => {
                if (res.data.code !== 10000) {
                    this.$message.error(res.data.msg);
                } else {
                    this.formData = res.data.data;
                }
            }
        )
    }
}
</script>
