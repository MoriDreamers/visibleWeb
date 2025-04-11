<script setup>
import { reactive, ref } from 'vue';
import 'element-plus/theme-chalk/index.css';
import {  CoffeeCup, WarnTriangleFilled } from '@element-plus/icons-vue';
import request from "../api/index.js";
import { apiUrl } from '../config';
import { apiHeader } from '../config';
import { ElMessage } from 'element-plus';
import { jmupRouter } from '../router'

const success = () => {
  ElMessage({
    showClose: true,
    message: '欢迎回家！',
    type: 'success',
    icon: CoffeeCup,
  });
};

const failed = (msg) => {
  ElMessage({
    showClose: true,
    message: msg,
    type: 'error',
    icon: WarnTriangleFilled,
  });
};

const lgi = reactive({
  user: '',
  ps: ''
});

const formRef = ref(null);
const validateUsername = (rule, value, callback) => {
  if (/^\d+$/.test(value)) {
    callback(new Error('Username cannot be a pure number'));
  } else {
    callback();
  }
};
const rules = reactive({
  user: [
    { required: true, message: 'Please input your username and not only numbers ', validator: validateUsername, trigger: 'blur' },
  ],
  ps: [
    { required: true, message: 'Please input your password', trigger: 'blur' },
    { min: 5, max: 20, message: 'Length should be 5 to 20', trigger: 'blur' },
  ],
});

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      request(apiUrl.apiLogin, {
        username: lgi.user,
        password: lgi.ps,
      }, 'post', 2000).then((response) => {
        if (response.status === 200) {
          success();
          window.localStorage.setItem(apiHeader.TokenName, response.data.token);
          jmupRouter('/home');
        } else {
          failed(response.message);
        }
      }).catch(() => {
        failed('Login failed, please try again.');
      });
    } else {
      failed('Please fill in the form correctly.');
      return false;
    }
  });
};
</script>

<template>
  <div class="background"></div>
  <div class="container">
    <div class="item" >
      <div class="text-item">
        <h2>Welcome! <br><span>Have a good time！</span></h2>
      </div>
    </div>
    <div class="login-section">
      <div class="form-box login">
        <el-card>
          <h2>Sign In </h2>

          <el-form :model="lgi" :rules="rules" ref="formRef" class="demo-ruleForm">
            <el-form-item prop="user">
              <el-input  placeholder="Username" v-model="lgi.user" />
            </el-form-item>
            <el-form-item prop="ps">
              <el-input  v-model="lgi.ps" placeholder="Password" type="password" autocomplete="off" />
            </el-form-item>
            <el-button  color="#626aef"  type="primary" @click="submitForm" style="font-size: medium;">Login</el-button>
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  background: #000;
}
.background {
  position: fixed;  /* 替换 absolute */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: url('../assets/03.webp') no-repeat center center / cover;
  filter: blur(10px);
  z-index: -1;  /* 确保背景在底层 */
}
.container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  height: 550px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  display: flex;
  overflow: hidden;
}
.item {
  width: 55%;
  padding: 80px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.text-item h2 {
  font-size: 45px;
  color: #ffffff;
  text-shadow: #000 1px 1px 1px;
}
.text-item p {
  font-size: 16px;
}
.login-section {
  min-width: 30%;
  width: 35%;
  display: flex;
  align-items: center;
  justify-content: center;

}
.form-box {
  width: 100%;
  padding: 40px;
}
.demo-ruleForm {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.el-card {
  background: rgba(255, 255, 255, 0.5) !important; /* 30%透明度白底 */
  backdrop-filter: blur(5px); /* 可选毛玻璃效果 */
  border: none; /* 移除默认边框 */
}

</style>
