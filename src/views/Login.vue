<template>
  <div class="login-body">
    <div class="login-container">
      <div class="head">
        <img
          class="logo"
          src="../assets/logo.png"
        />
        <div class="name">
          <div class="title">登录</div>
          <div class="tips">Vue3.0 后台管理系统</div>
        </div>
      </div>
      <div class="register-tip">
        <p>
          没有账号？
          <el-link type="primary">
            <router-link :to="'register'">立即注册</router-link>
          </el-link>
        </p>
      </div>
      <el-form
        label-position="top"
        :rules="rules"
        :model="ruleForm"
        ref="loginForm"
        class="login-form"
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
        <el-row :gutter="20">
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
              content="[ 点击 ] 刷新验证码"
              placement="right"
              effect="light"
            >
              <el-image
                :src="codeUrl"
                style="cursor: pointer; border-radius: 5px"
                fit="fit"
                @click="changeImageCode"
              >
                <div class="image-slot">
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
            </el-tooltip>
          </el-col>
        </el-row>
        <el-form-item>
          <div style="color: #333">登录表示您已同意<a>《服务条款》</a></div>
          <el-button style="width: 100%" type="primary" @click="submitForm"
            >立即登录</el-button
          >
          <el-checkbox v-model="checked" @change="!checked"
            >下次自动登录</el-checkbox
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import config from "~/config";
import axios from "@/utils/axios";
import { reactive, ref, toRefs, onMounted } from "vue";
import { localSet } from "@/utils";
export default {
  name: "Login",
  setup() {
    const loginForm = ref(); //表单的ref，可以用来验证表单内容
    const state = reactive({
      ruleForm: {
        username: "root_admin",
        password: "root_admin",
        codeKey: "",
        codeText: "",
      },
      codeUrl: "",
      checked: true,
      rules: {
        username: [
          { required: "true", message: "账户不能为空", trigger: "blur" },
        ],
        password: [
          { required: "true", message: "密码不能为空", trigger: "blur" },
        ],
        codeText: [
          { required: "true", message: "验证码不能为空", trigger: "blur" },
        ],
      },
    });

    onMounted(() => {
      randomCodeKey();
      changeImageCode();
    });

    //提交表单
    const submitForm = async () => {
      loginForm.value.validate((valid) => {
        if (valid) {
          axios.post("/auth/login", state.ruleForm).then((res) => {
            console.log(res);
            localSet("token", res.prefix + res.value);
            window.location.href = "/";
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };

    //重置表单内容
    const resetForm = () => {
      loginForm.value.resetFields();
    };

    //获取验证码图片
    const changeImageCode = () => {
      var arr = [
        config[import.meta.env.MODE].baseUrl,
        "/auth/verify/code",
        "/",
        state.ruleForm.codeKey,
        "?r=",
        Math.ceil(Math.random() * 100),
      ];
      var str = arr.join("");
      state.codeUrl = str;
      console.log(str);
    };

    // 随机 生成 18位 字符串
    const randomCodeKey = () => {
      var s = [];
      var hexDigits = "0123456789abcdefghijklmnopqrstuvwxyz";
      for (var i = 0; i < 24; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      var uuid = s.join("");
      state.ruleForm.codeKey = uuid;
    };

    return {
      ...toRefs(state),
      loginForm,
      submitForm,
      resetForm,
      changeImageCode,
    };
  },
};
</script>

<style scoped>
.login-body {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: #87CEFA;
  /* background-image: linear-gradient(25deg, #077f7c, #3aa693, #5ecfaa, #7ffac2); */
}
.login-container {
  width: 420px;
  height: 570px;
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
.register-tip{
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
.login-form {
  width: 70%;
  margin: 0 auto;
}
</style>
<style>
.el-form--label-top .el-form-item__label {
  padding: 0;
}
.login-form .el-form-item {
  margin-bottom: 12px;
}
</style>