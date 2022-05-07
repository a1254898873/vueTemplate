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
  name: "Index"
};
</script>
<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>