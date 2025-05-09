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

//用于默认展开菜单！！！
const defaultOpenMenus = MenuConfig().map(menu => menu.index);

</script>

<template>

    <el-aside width="250px" class="el-aside"  >
      <div class="el-aside-logo">      
        
        <div class="gearbox">
          <div class="overlay"></div>
            <div class="gear one">
              <div class="gear-inner">
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
              </div>
            </div>
            <div class="gear two">
              <div class="gear-inner">
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
              </div>
            </div>
            <div class="gear three">
              <div class="gear-inner">
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
              </div>
            </div>
            <div class="gear four large">
              <div class="gear-inner">
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
              </div>
            </div>
          </div>
      </div>

      <div class="menu">
          <el-menu
          :default-openeds="defaultOpenMenus"
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
                    <el-menu-item v-for="item in subMenu.items" :key="item.index" :index="item.index">

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

  .el-aside-logo {
    height: 100px;
    width: 100%;
  }

  @keyframes clockwise {
    0% {
      transform: rotate(0deg);
    }
  
    100% {
      transform: rotate(360deg);
    }
  }
  
  @keyframes counter-clockwise {
    0% {
      transform: rotate(0deg);
    }
  
    100% {
      transform: rotate(-360deg);
    }
  }
  
  .gearbox {
    background: #ffffff;
    height: 100%;
    width: 100%;
    position: relative ;
    border: none;
    overflow: hidden;
    box-shadow: 0px 0px 0px 1px rgba(255, 255, 255, 0.1);
  }
  
  .gearbox .overlay {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;

    transition: background 0.2s;
  }
  
  .gearbox .overlay {
    background: transparent;
  }
  
  .gear {
    position: absolute;
    height: 60px;
    width: 60px;
    box-shadow: 0px -1px 0px 0px #888888, 0px 1px 0px 0px black;
    border-radius: 30px;
  }
  
  .gear.large {
    height: 120px;
    width: 120px;
    border-radius: 60px;
  }
  
  .gear.large:after {
    height: 96px;
    width: 96px;
    border-radius: 48px;
    margin-left: -48px;
    margin-top: -48px;
  }
  
  .gear.one {
    top: 12px;
    left: 10px;
  }
  
  .gear.two {
    top: 61px;
    left: 60px;
  }
  
  .gear.three {
    top: 110px;
    left: 10px;
  }
  
  .gear.four {
    top: 13px;
    left: 128px;
  }
  
  .gear:after {
    content: "";
    position: absolute;
    height: 36px;
    width: 36px;
    border-radius: 36px;
    background: #dcdcdc;
    top: 50%;
    left: 50%;
    margin-left: -18px;
    margin-top: -18px;
    z-index: 3;
    box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.1), inset 0px 0px 10px rgba(0, 0, 0, 0.1), inset 0px 2px 0px 0px #090909, inset 0px -1px 0px 0px #888888;
  }
  
  .gear-inner {
    position: relative;
    height: 100%;
    width: 100%;
    background: #555;
    border-radius: 30px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .large .gear-inner {
    border-radius: 60px;
  }
  
  .gear.one .gear-inner {
    animation: counter-clockwise 3s infinite linear;
  }
  
  .gear.two .gear-inner {
    animation: clockwise 3s infinite linear;
  }
  
  .gear.three .gear-inner {
    animation: counter-clockwise 3s infinite linear;
  }
  
  .gear.four .gear-inner {
    animation: counter-clockwise 6s infinite linear;
  }
  
  .gear-inner .bar {
    background: #555;
    height: 16px;
    width: 76px;
    position: absolute;
    left: 50%;
    margin-left: -38px;
    top: 50%;
    margin-top: -8px;
    border-radius: 2px;
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .large .gear-inner .bar {
    margin-left: -68px;
    width: 136px;
  }
  
  .gear-inner .bar:nth-child(2) {
    transform: rotate(60deg);
  }
  
  .gear-inner .bar:nth-child(3) {
    transform: rotate(120deg);
  }
  
  .gear-inner .bar:nth-child(4) {
    transform: rotate(90deg);
  }
  
  .gear-inner .bar:nth-child(5) {
    transform: rotate(30deg);
  }
  
  .gear-inner .bar:nth-child(6) {
    transform: rotate(150deg);
  }
</style>