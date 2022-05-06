<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>个人信息</span>
        <el-button class="button" type="text">编辑个人信息</el-button>
      </div>
    </template>
  </el-card>
</template>

<script>
export default {
  name: "Introduce",
  setup() {
    const goJuejin = () => {
      console.log("goJuejin");
      window.open("https://juejin.cn/book/6933939264455442444", "target");
    };

    return {
      goJuejin,
    };
  },
};
</script>
<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>