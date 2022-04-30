<template>
  <div
    id="pmn"
    v-loading="loading"
    element-loading-text="拼命加载中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-row :gutter="20">
      <el-col :span="10">
        <el-tree
          :data="treeData"
          :props="defaultProps"
          @node-click="handleNodeClick"
        />
      </el-col>
      <el-col :span="14">
        <el-card class="box-card" shadow="never">
          <template #header>
            <div class="clearfix">
              <span class="card-header">权限详细信息</span>
              <el-button-group style="float: right">
                <el-button
                  type="warning"
                  icon="el-icon-edit"
                  @click="isEdit = !isEdit"
                  >编辑本权限
                </el-button>
                <el-button
                  type="primary"
                  icon="el-icon-share"
                  @click="addEntity"
                  >添加子权限
                </el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteEntity"
                  >删除本权限
                </el-button>
              </el-button-group>
            </div>
          </template>
          <el-form
            ref="pmnFormRef"
            :rules="rules"
            :model="pmnForm"
            label-width="100px"
          >
            <el-form-item label="权限ID">
              <el-input v-model="pmnForm.pid" :disabled="true" />
            </el-form-item>

            <el-form-item label="权限标题" prop="title">
              <el-input v-model="pmnForm.title" :disabled="isEdit" clearable />
            </el-form-item>

            <template v-if="pmnForm.type === 'menu'">
              <el-form-item label="权限图标" prop="icon">
                <el-input v-model="pmnForm.icon" :disabled="isEdit" clearable />
              </el-form-item>
            </template>

            <el-form-item label="唯一标识" prop="resources">
              <el-input
                v-model="pmnForm.resources"
                :disabled="isEdit"
                clearable
                placeholder="强调，必须是唯一的英文字母"
              />
            </el-form-item>

            <el-form-item label="上级权限" prop="parentId">
              <el-cascader
                v-model="pmnForm.parentId"
                :disabled="isEdit"
                :show-all-levels="false"
                :options="menuTreeData"
                clearable
                filterable
                :props="cascaderProps"
                @change="handleChange"
              >
                <template #default="{ node, data }">
                  <span>{{ data.title }}</span>
                  <span v-if="!node.isLeaf">({{ data.children.length }})</span>
                </template>
              </el-cascader>
            </el-form-item>

            <el-form-item label="权限类型" prop="type">
              <el-select
                v-model="pmnForm.type"
                :disabled="isEdit"
                placeholder="选择类型"
              >
                <el-option
                  v-for="item in pmnType"
                  :key="item.type"
                  :label="item.name"
                  :value="item.type"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="权限描述" prop="description">
              <el-input
                v-model="pmnForm.description"
                :disabled="isEdit"
                clearable
              />
            </el-form-item>

            <el-form-item v-if="isEdit === false">
              <el-button type="primary" @click="saveAndFlush">保存</el-button>
              <el-button @click="isEdit = !isEdit">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ElMessageBox, ElMessage } from "element-plus";
import { onMounted, reactive, ref, toRefs } from "vue";
import axios from "@/utils/axios";
export default {
  setup(props, context) {
    const pmnFormRef = ref();
    const state = reactive({
      loading: false,
      isEdit: true,
      treeData: [],
      menuTreeData: [],
      pmnForm: {
        pid: 0,
        parentId: "",
        resources: "",
        title: "",
        icon: "",
        type: "",
        description: "",
      },
      defaultProps: {
        children: "children",
        label: "title",
      },
      pmnType: [
        { type: "button", name: "按钮" },
        { type: "menu", name: "菜单" },
      ],
      cascaderProps: {
        children: "children",
        label: "title",
        value: "id",
        emitPath: false,
        checkStrictly: true,
      },
      // 校验规则
      rules: {
        title: [
          { required: true, message: "权限标题不能为空", trigger: "blur" },
        ],
        parentId: [
          { required: true, message: "上级权限不能为空", trigger: "blur" },
        ],
        resources: [
          { required: true, message: "标识必须是全局唯一", trigger: "blur" },
          {
            validator: function (rule, value, callback) {
              const regex = /[a-z]{2}$/;
              if (!regex.test(value)) {
                callback(new Error("标识必须是全英文小写5位以上字母"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        type: [
          { required: true, message: "权限类型不能为空", trigger: "blur" },
        ],
        description: [
          { required: true, message: "权限描述不能为空", trigger: "blur" },
        ],
      },
    });

    onMounted(() => {
      getPermissionTreeData();
      getMenusTreeData();
    });

    // 获取权限列表以树节点的形式展示
    const getPermissionTreeData = () => {
      state.loading = true;
      axios.get("/sys/permission/tree?filter=false").then((res) => {
        state.treeData = res;
        console.log(res);
        state.loading = false;
      });
    };

    //用于编辑时的选择下拉框
    const getMenusTreeData = () => {
      state.loading = true;
      axios.get("/sys/permission/tree?filter=true").then((res) => {
        state.menuTreeData = res;
        state.menuTreeData.push({
          id: "root",
          title: "顶级菜单",
          parentId: 0,
        });
        state.loading = false;
      });
    };

    //树形组件点击事件
    const handleNodeClick = (node) => {
      state.pmnForm = node.source;
      console.log(state.pmnForm);
      state.isEdit = true;
    };

    const handleChange = (data) => {
      // 如果是 root 表示，顶级菜单
      if (data === "root") {
        state.pmnForm.parentId = 0;
      } else {
        state.pmnForm.parentId = data;
      }
    };

    //增加权限
    const addEntity = () => {
      state.pmnForm = {
        pid: 0,
        parentId: 0,
        resources: "",
        title: "",
        icon: "",
        type: "",
        description: "",
      };
      state.isEdit = false;
      getPermissionTreeData();
      getMenusTreeData();
    };

    //删除权限
    const deleteEntity = () => {
      if (state.pmnForm.pid > 0) {
        ElMessageBox.confirm(
          "确定要删除【" +
            state.pmnForm.title +
            "】吗? 请确认这个权限下面没有子权限.并且没有角色在使用这个权限.否则无法删除 是否继续?",
          "警告",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(() => {
          axios
            .delete("/sys/permission/" + state.pmnForm.pid)
            .then((result) => {
              ElMessage({
                type: "success",
                title: "成功",
                message: "删除权限成功!",
              });
              getPermissionTreeData();
              getMenusTreeData();
              state.isEdit = true;
            });
        });
      } else {
        ElMessage({
          title: "错误",
          message: "请先选中权限,才可以删除",
        });
      }
    };

    //保存并刷新
    const saveAndFlush = () => {
      console.log("this.pmnForm :", state.pmnForm);
      pmnFormRef.value.validate((valid) => {
        if (valid) {
          if (state.pmnForm.pid > 0) {
            axios.put("/sys/permission", state.pmnForm).then((res) => {
              ElMessage({
                title: "成功",
                message: "修改权限成功!",
                type: "success",
              });
              getPermissionTreeData();
              getMenusTreeData();
              state.isEdit = true;
              console.log(123);
            });
          } else {
            axios.post("/sys/permission", state.pmnForm).then((res) => {
              ElMessage({
                title: "成功",
                message: "新增权限成功!",
                type: "success",
              });
              getPermissionTreeData();
              getMenusTreeData();
              state.isEdit = true;
            });
          }
        }
      });
    };

    return {
      ...toRefs(state),
      pmnFormRef,
      handleChange,
      handleNodeClick,
      addEntity,
      deleteEntity,
      saveAndFlush,
    };
  },
};
</script>



<style>
.el-tree-node__expand-icon {
  font-size: 1rem;
  font-weight: 600;
}

.el-tree-node__label {
  font-size: 1rem;
  font-weight: 600;
}

.el-tree-node__content {
  height: 2.5rem;
}

.el-alert__title {
  font-size: 1rem;
}

.el-input-number {
  width: 100%;
}

.el-select {
  width: 100%;
}

.el-cascader {
  width: 100%;
}
</style>
