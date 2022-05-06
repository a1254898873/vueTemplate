<template>
  <div class="layout">
    <el-container v-if="showMenu" class="container">
      <el-aside class="aside">
        <div class="head">
          <div>
            <img src="./assets/logo.png" alt="logo" />
            <span>vue3 admin</span>
          </div>
        </div>
        <div class="line" />
        <el-menu background-color="#222832" text-color="#fff" :router="true">
          <MenuItem v-for="item in menus" :key="item.pid" :data="item" />
        </el-menu>
      </el-aside>
      <el-container class="content">
        <Header />
        <div class="main">
          <router-view />
        </div>
        <Footer />
      </el-container>
    </el-container>
    <el-container v-else class="container">
      <router-view />
    </el-container>
  </div>
</template>

<script>
//导入状态仓库
import { mainStore } from "@/store";
import axios from "@/utils/axios";
//导入组件
import MenuItem from "@/components/MenuItem.vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { onMounted, onUnmounted, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
//导入工具
import { localGet } from "@/utils/auth";
export default {
  name: "App",
  components: {
    Header,
    Footer,
    MenuItem,
  },
  setup() {
    //实例化仓库
    const store = mainStore();
    //不需要显示左侧菜单的路径
    const noMenu = ["/login", "/register"];
    const router = useRouter();
    const state = reactive({
      showMenu: true,
      menus: [],
    });

    //初始化
    onMounted(() => {
      const pathname = window.location.hash.split("/")[1] || "";
      if (!["login", "register"].includes(pathname)) {
        getUserInfo();
      }
    });

    //获取用户信息
    const getUserInfo = async () => {
      if (store.userInfo === null) {
        const userInfo = await axios.get("/sys/user/info");
        store.userInfo = userInfo;
        state.menus = userInfo.menus;
      } else {
        state.userInfo = store.userInfo;
        state.menus = store.userInfo.menus;
      }
    };

    // 监听浏览器原生回退事件
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL);
      window.addEventListener(
        "popstate",
        () => {
          if (!localGet("token")) {
            state.showMenu = false;
          }
        },
        false
      );
    }
    const unwatch = router.beforeEach((to, from, next) => {
      //404页面无法通过路径判断，因此此处特殊处理
      if (to.name == "404") {
        state.showMenu = false;
      } else {
        state.showMenu = !noMenu.includes(to.path);
      }
      next();
    });

    onUnmounted(() => {
      unwatch();
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
  background-color: #ffffff;
}
.container {
  height: 100vh;
}
.aside {
  width: 200px !important;
  background-color: #222832;
  overflow: hidden;
  overflow-y: auto;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}
.aside::-webkit-scrollbar {
  display: none;
}
.head {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
}
.head > div {
  display: flex;
  align-items: center;
}

.head img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}
.head span {
  font-size: 20px;
  color: #ffffff;
}
.line {
  border-top: 1px solid hsla(0, 0%, 100%, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}
.content {
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  overflow: hidden;
}
.main {
  height: calc(100vh - 100px);
  overflow: auto;
  padding: 10px;
}
</style>
<style>
body {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.el-menu {
  border-right: none !important;
}
.el-submenu {
  border-top: 1px solid hsla(0, 0%, 100%, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}
.el-submenu:first-child {
  border-top: none;
}
.el-submenu [class^="el-icon-"] {
  vertical-align: -1px !important;
}
a {
  color: #409eff;
  text-decoration: none;
}
.el-pagination {
  text-align: center;
  margin-top: 20px;
}
.el-popper__arrow {
  display: none;
}
</style>
