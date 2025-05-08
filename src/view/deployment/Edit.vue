<script setup>
import AddOrUpdate from './AddOrUpdate.vue';
import { getDeploymentApi as getApi } from '../../api/deployment';
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import router from '../../router';
import { useItem } from '../../store/index.js';

const useItemer = useItem();

const route = useRoute();
//直接使用onbeforeMount来获取数据，会导致数据更新不及时，在 List.vue 里，通过 editHandle 函数跳转到编辑页面，然后在 Edit.vue 里，通过 onBeforeMount 调用 getApi 获取数据，并赋值给 useItemer.item，但 onBeforeMount 是异步的，所以 useItemer.item 的赋值可能还没完成，页面就已经渲染
const isDataLoaded = ref(false);

onBeforeMount(async() => {
    //获取请求参数
    const query = route.query;
    await getApi(query).then(res => {
        console.log(res);
        useItemer.item = JSON.parse(JSON.stringify(res.data.item));
        isDataLoaded.value = true;  // 数据加载完成后再渲染
    });
});
</script>

<template>
    <AddOrUpdate v-if="isDataLoaded" method="update" />
</template>

<style scoped>

</style>