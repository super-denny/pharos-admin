<template>
    <div class="content">
        <div class="c_left">
            {{title}}
        </div>
        <div class="c_right">
            {{count}}
        </div>
    </div>
</template>

<script>
export default {
    name: "TopPanel",
    props: {
        title: {
            type: String,
            default: ""
        },
        count: {
            type: Number,
            default: 0
        },
    },
}
</script>

<style scoped>

.content {
    height: 90%;
    width: 100%;
}

.c_left {
    height: 100%;
    text-align: center;
    font-size: 18px;
}


.c_right {
    height: 100%;
    text-align: center;
    font-size: 26px;
    margin-top: 7%;
}
</style>
