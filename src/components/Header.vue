<template>
  <div class="header">
    <div class="left"></div>
    <div class="right">
      <el-popover
        placement="bottom"
        :width="320"
        trigger="click"
        popper-class="popper-user-box"
      >
        <template #reference>
          <div class="author">
            <i class="icon el-icon-s-custom" />
            {{ (userInfo && userInfo.nickname) || "" }}
            <i class="el-icon-caret-bottom" />
          </div>
        </template>
        <div class="nickname">
          <p>登录名：{{ (userInfo && userInfo.username) || "" }}</p>
          <p>昵称：{{ (userInfo && userInfo.nickname) || "" }}</p>
          <p>邮箱：{{ (userInfo && userInfo.email) || "" }}</p>
          <el-tag size="small" effect="dark" class="logout" @click="logout"
            >退出</el-tag
          >
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
//导入状态仓库
import { mainStore } from "@/store";
// 使普通数据变响应式的函数
import { storeToRefs } from "pinia";
//导入路由
import { useRouter } from "vue-router";
//导入axios
import axios from "@/utils/axios";
import { localRemove } from "@/utils/auth";
import { pathMap } from "@/utils";
export default {
  name: "Header",
  setup() {
    //实例化仓库
    const store = mainStore();
    // 解构并使数据具有响应式
    const { userInfo } = storeToRefs(store);
    //实例化路由
    const router = useRouter();

    //登出
    const logout = () => {
      axios.get("/auth/logout").then(() => {
        localRemove("token");
        store.userInfo = null;
        store.routers = null;
        router.push("/login");
      });
    };

    return {
      userInfo,
      logout,
    };
  },
};
</script>

<style scoped>
.header {
  height: 50px;
  border-bottom: 1px solid #e9e9e9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
.el-icon-back {
  border: 1px solid #e9e9e9;
  padding: 4px;
  border-radius: 50px;
  margin-right: 10px;
}
.right > div > .icon {
  font-size: 18px;
  margin-right: 6px;
}
.author {
  margin-left: 10px;
  cursor: pointer;
}
</style>
<style>
.popper-user-box {
  background: url("https://s.yezgea02.com/lingling-h5/static/account-banner-bg.png")
    50% 50% no-repeat !important;
  background-size: cover !important;
  border-radius: 0 !important;
}
.popper-user-box .nickname {
  position: relative;
  color: #ffffff;
}
.popper-user-box .nickname .logout {
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
}
</style>