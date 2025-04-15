
<!-- 封装列表组件 -->

<script setup>
  const props = defineProps({
    title:{
      type:String,
      default: "请传入数据"
    },
      userForm:{
        type:Object,
      },
  })

</script>

<template>

  
  <div style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 10px;">
        <div>
            <span class="btn01" style="font-weight: bold;color:#000000c9;font-size: 16px;" @click= "crate" >{{props.title}}</span>
        </div>
        <div style="display: flex;align-items: center;">
            <slot name="headerOptins"></slot>
        </div>
    </div>

    <div>
         <slot name="main"></slot>
    </div>
     

</template>

<style scoped>

.btn01 {
  position: relative;
  display: inline-block;
  color: black;
  animation: fadeFlash 1.2s infinite alternate ease-in-out;
}

@keyframes fadeFlash {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.7;
  }
}

.btn01::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 2px;
  background-color: black;
  transition: width 0.1s ease;
}

.btn01:hover::after {
  width: 100%;
}
</style>