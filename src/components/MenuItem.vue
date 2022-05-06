<template>
  <el-sub-menu
    v-if="item.children && item.children.length > 0"
    :index="item.pid"
  >
    <template style="padding-left: 10px" #title>
      <i class="el-icon-menu"></i>
      <span>{{ item.title }}</span>
    </template>
    <!--  如果有子级数据使用递归组件 -->
    <MenuItem v-for="(element) in item.children" :key="element.pid" :data="element" />
  </el-sub-menu>
  <el-menu-item v-else :index="item.href" >
    <i :class="item.icon"></i>
    <span>{{ item.title }}</span>
  </el-menu-item>
</template>

<script>
export default {
  name: "MenuItem",
  props: {
    data: Object,
  },
  setup(props) {
    const item = props.data;
    return { item };
  },
};
</script>
<style>
</style>
