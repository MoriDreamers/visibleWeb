<script setup>
import { RemoveFilled,Promotion } from '@element-plus/icons-vue'
import {getUserLogoutApi} from '../../../api/user.js'
import { ElNotification } from 'element-plus'
import {apiHeader} from '../../../config/index.js'
import router from '../../../router';
const waringBox = (info) => {
    ElNotification({
    title: '登出失败',
    message: info.message,
    type: 'warning',
  })
};
const successBox = (info) => {
    ElNotification({
    title: '登出成功',
    message: info.message,
    type:'success',
  })
};
const logout = () => {
    getUserLogoutApi().then((Response) => {
        if (Number(Response.status) === 200) {  // 强制转换为数字
            
            successBox(Response)  
            window.localStorage.removeItem(apiHeader.TokenName)
            router.replace('/login')
        } else {
            waringBox(Response)
        }
    })
}

const jumpLink = () => {
    window.location.href = "https://github.com/MoriDreamers/VUE-PROJECT";
}
</script>

<template>

    <div style="background-color: rgb(232.8, 233.4, 234.6);">
        <el-header style="display: flex; justify-content: space-between; align-items: center;">
            <el-button :text="true" @click="jumpLink">
                <el-icon size="20">
                    <Promotion />
                </el-icon>
            </el-button>
            <el-button :text="true" @click="logout" >
                <el-icon size="20">
                    <RemoveFilled />
                </el-icon>
            </el-button>
        </el-header>
    </div>


</template>

<style scoped>
</style>
