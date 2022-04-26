<template>
  <div class="register-body">
    <div class="register-container">
      <div class="head">
        <img class="logo" src="../assets/logo.png" />
        <div class="name">
          <div class="title">注册</div>
          <div class="tips">Vue3.0 后台管理系统</div>
        </div>
      </div>
      <div class="login-tip">
        <p>
          已有账号？
          <el-link type="primary">
            <router-link :to="'login'">立即登录</router-link>
          </el-link>
        </p>
      </div>
      <el-form
        label-position="top"
        :rules="rules"
        :model="ruleForm"
        ref="registerForm"
        class="register-form"
      >
        <el-form-item label="账号" prop="username">
          <el-input
            type="text"
            v-model.trim="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model.trim="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            type="text"
            v-model.trim="ruleForm.email"
            autocomplete="off"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <el-row :gutter="20" style="margin-top: 20px">
          <el-col :span="16">
            <el-form-item prop="codeText">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                v-model="ruleForm.codeText"
                class="code-text"
                name="codeText"
                type="text"
                maxlength="100"
                auto-complete="on"
                placeholder="请输入验证码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-tooltip
              content="[ 点击 ] 发送验证码"
              placement="right"
              effect="light"
            >
              <div class="get-code">
                <el-button
                  size="medium"
                  class=".get-code"
                  @click="sentEamilCode"
                  >点击获取</el-button
                >
              </div>
            </el-tooltip>
          </el-col>
        </el-row>
        <el-form-item>
          <div style="color: #333">注册表示您已同意<a>《服务条款》</a></div>
          <el-button style="width: 100%" type="primary" @click="submitForm"
            >立即注册</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { testEmail } from "@/utils/regular";
import axios from "@/utils/axios";
import { reactive, ref, toRefs, onMounted } from "vue";
import router from '@/router/index'
export default {
  name: "register",
  setup() {
    const registerForm = ref(); //表单的ref，可以用来验证表单内容

    //表单验证
    const validateEmail = (rule, value, callback) => {
      if (value === undefined || value === null || value === "") {
        callback(new Error("请输入邮箱账号~"));
      } else {
        if (!testEmail(value)) {
          callback(new Error("请输入正确的邮箱账号~"));
        } else {
          callback();
        }
      }
    };
    const validateUsername = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("用户名不能小于5位"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("密码不能小于5位"));
      } else {
        callback();
      }
    };
    const validateCodeText = (rule, value, callback) => {
      if (value.length !== 6) {
        callback(new Error("验证码只能是6位"));
      } else {
        callback();
      }
    };

    const state = reactive({
      ruleForm: {
        username: "",
        password: "",
        email: "",
        codeText: "",
      },
      sentFlag: false,
      rules: {
        username: [
          { required: "true", trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: "true", trigger: "blur", validator: validatePass },
        ],
        email: [
          { required: "true", trigger: "blur", validator: validateEmail },
        ],
        codeText: [
          { required: "true", trigger: "blur", validator: validateCodeText },
        ],
      },
    });

    //提交表单
    const submitForm = async () => {
      registerForm.value.validate((valid) => {
        if (valid) {
          axios.post("/auth/register", state.ruleForm).then((res) => {
            router.push({ path: '/login' })
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };

    //重置表单内容
    const resetForm = () => {
      registerForm.value.resetFields();
    };

    const sentEamilCode = (e) => {
      if (state.sentFlag === false) {
        e.target.innerText = "已发送";
        state.sentFlag = true;
        axios.get("/auth/mail/" + state.ruleForm.email).then((res) => {
          console.log(res);
        });
      }
    };

    return {
      ...toRefs(state),
      registerForm,
      submitForm,
      resetForm,
      sentEamilCode,
    };
  },
};
</script>

<style scoped>
.register-body {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: #87cefa;
  /* background-image: linear-gradient(25deg, #077f7c, #3aa693, #5ecfaa, #7ffac2); */
}
.register-container {
  width: 420px;
  height: 600px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0px 21px 41px 0px rgba(0, 0, 0, 0.2);
}
.head {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0 20px 0;
}
.login-tip {
  display: flex;
  justify-content: center;
  margin-top: -30px;
  margin-bottom: -20px;
}
.head img {
  width: 100px;
  height: 100px;
  margin-right: 20px;
}
.head .title {
  font-size: 28px;
  color: #409eff;
  font-weight: bold;
}
.head .tips {
  font-size: 12px;
  color: #999;
}
.register-form {
  width: 70%;
  margin: 0 auto;
}
</style>
<style>
.el-form--label-top .el-form-item__label {
  padding: 0;
}
.register-form .el-form-item {
  margin-bottom: 12px;
}
</style>