<script setup>
    import Aside from './components/Aside.vue';
    import Header from './components/Header.vue';
    import Main from './components/Main.vue';
    import Footer from './components/Footer.vue'
</script>

<template>
    <div class="common-layout">
      <el-container style="el-container">
        <Aside width="250px"></Aside>
          <el-container class = "el-container__el-container">
              <Header></Header>
              <Main></Main>
              <Footer></Footer>
          </el-container>
      </el-container>
    </div>
</template>

<style scoped>
  .el-container{
    height: 100vh;
    width: 100vw;
    /*100%受限于父元素 100vh/w相对视窗高/款度*/
  }
  .el-container__el-container{
    display: flex;
    flex-direction: column;
  }
</style>