<template>
  <el-sub-menu
    v-if="item.children && item.children.length > 0"
    :index="item.menuId"
  >
    <template style="padding-left: 10px" #title>
      <i class="el-icon-menu"></i>
      <span>{{ item.name }}</span>
    </template>
    <!--  如果有子级数据使用递归组件 -->
    <MenuItem v-for="(element) in item.children" :key="element.menuId" :data="element" />
  </el-sub-menu>
  <el-menu-item v-else :index="item.url" >
    <i :class="item.icon"></i>
    <span>{{ item.name }}</span>
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
