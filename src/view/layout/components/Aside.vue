<script setup>
import { MenuConfig } from '../../../config/menu.js'
import { ElNotification, ElSubMenu } from 'element-plus'
import { ref } from 'vue';
import {jmupRouter}from '../../../router/index.js'
//const collapse = ref(true)

/*
  为减少性能损耗 你可以自己手动来导入所需要的图标
  import { UserFilled, Tools, HomeFilled, Setting } from '@element-plus/icons-vue';

  const Icons = { UserFilled, Tools, HomeFilled, Setting };
*/

//导入所有图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//创建图标映射表用于动态加载
const Icons = {};
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  Icons[key] = component;
}

let countEgg = ref ("0")
const colorEggCount = () =>{
  jmupRouter("/home")
  countEgg.value ++
  if(countEgg.value%5 == 0){
    colorEgg()
  }
}
const colorEgg = () => {
    ElNotification({
    title: '这里是彩蛋！',
    message: 'Ciallo～(∠・ω< )⌒☆',
    type: 'success',
  })
};
</script>

<template>

    <el-aside width="250px" class="el-aside"  >
      <div class="el-aside-logo">      
        <el-button text @click="colorEggCount" v-model="countEgg">
          visible K8s !
        </el-button>
      </div>

      <div class="menu">
          <el-menu
        
          active-text-color="#ffe9e3"
          background-color="#545c64"
          class="el-menu-vertical-demo"
          :default-active="$route.path"
          text-color="#fff"
          router
        >
        <!--可以改成递归-->
          <el-sub-menu v-for="menu in MenuConfig()" :key="menu.index" :index="menu.index" :icon="menu.icon">
            <template #title>
            <!-- 
              外层加图标不好看 想要图标直接删了注释就行-->
              <el-icon v-if="menu.icon" style="color:#a8d8ea;">
                <component :is="Icons[menu.icon]" />
              </el-icon >
              <span style="font-size: 15px;">{{ menu.title }}</span>
            </template>
              <template v-if="menu.subMenu">
                <el-sub-menu v-for="subMenu in menu.subMenu" :key="subMenu.index" :index="subMenu.index" :icon="subMenu.icon">
                  <template #title>
                    <el-icon v-if="subMenu.icon">
                      <component :is="Icons[subMenu.icon]" />
                    </el-icon>
                    <span>{{ subMenu.title }}</span>
                  </template>
                  <template v-if="subMenu.items">
                    <el-menu-item v-for="item in subMenu.items" :key="subMenu.index" :index="subMenu.index">
                      <template #title>
                        <span>{{ item.title }}</span>
                      </template>
                    </el-menu-item>
                    </template>
                </el-sub-menu>
              </template>
            <template v-else>
              <el-menu-item v-for="item in menu.items" :key="item.index" :index="item.index">
                <template #title>
                  <span>{{ item.title }}</span>
                </template>
              </el-menu-item>
              </template>
          </el-sub-menu>
        </el-menu>
      </div>
    </el-aside>


</template>

<style lang="less" scoped>
  .el-aside {
    box-sizing: border-box;
    width: 250px;
    box-shadow: #221717 0px 0px 15px;
    z-index: 1;
  }
  .el-aside-logo {
    height: 60px;
    width: 100%;
    button{
      width: 100%;
      height: 100%;
      font-size: 18px;
      font-weight: bold;
    }
  }

  .el-menu-vertical-demo {
    width: 100%;
    min-height: calc(100vh - 60px); 
    /*
    减去按钮高度后可以避免出现滚动条 
    */
    border: 0px;
    /*
    自带有一个右边0.8px的边框，会导致有白边不好看，去掉它
    */
  }
</style>