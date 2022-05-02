<template>
  <el-container id="dept">
    <el-header>
      <el-alert
        title="请勿乱删除部门, 确实需要删除部门的时候, (1).请确定这个部门下面没有子部门, (2).请确定这个部门下面没有用户. 只有满足以上两种情况才可以删除部门成功!"
        type="info"
      />
    </el-header>
    <el-main
      v-loading="loading"
      element-loading-text="拼命加载中..."
      element-loading-spinner="el-icon-loading"
    >
      <el-row :gutter="20">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-tree
              :data="treeData"
              :props="defaultProps"
              :default-expand-all="true"
              @node-click="handleNodeClick"
            />
          </div>
        </el-col>
        <el-col :span="14">
          <el-card class="box-card">
            <template #header>
              <div class="clearfix">
                <span class="card-header">部门详细信息</span>
                <el-button-group style="float: right">
                  <el-button
                    type="primary"
                    icon="el-icon-share"
                    @click="addEntity"
                    >添加部门
                  </el-button>
                  <el-button
                    type="warning"
                    icon="el-icon-edit"
                    @click="isEdit = !isEdit"
                    >修改部门
                  </el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    @click="deleteEntity"
                    >删除部门
                  </el-button>
                </el-button-group>
              </div>
            </template>

            <el-form
              ref="deptFormRef"
              :rules="rules"
              :model="deptForm"
              label-width="100px"
            >
              <el-form-item label="部门ID">
                <el-input v-model="deptForm.id" :disabled="true" />
              </el-form-item>
              <el-form-item label="部门名称" prop="name">
                <el-input
                  v-model="deptForm.name"
                  :disabled="isEdit"
                  clearable
                />
              </el-form-item>
              <el-form-item label="上级部门" prop="parentId">
                <el-cascader
                  v-model="deptForm.parentId"
                  :disabled="isEdit"
                  :show-all-levels="false"
                  :options="treeData"
                  clearable
                  filterable
                  :props="cascaderProps"
                />
              </el-form-item>
              <el-form-item label="部门排序" prop="level">
                <el-input-number
                  v-model="deptForm.level"
                  :disabled="isEdit"
                  :min="1"
                  :max="10000"
                  label="部门排序"
                />
              </el-form-item>
              <el-form-item label="部门描述" prop="description">
                <el-input
                  v-model="deptForm.description"
                  :disabled="isEdit"
                  :autosize="{ minRows: 3, maxRows: 10 }"
                  type="textarea"
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
    </el-main>
  </el-container>
</template>

<script>
import { reactive,toRefs,onMounted,ref } from "vue";
import axios from "@/utils/axios";
import { ElMessageBox, ElMessage } from "element-plus";
export default {
  setup() {
    const deptFormRef = ref();
    const state = reactive({
      deptForm: {
        id: 0,
        name: "",
        parentId: "",
        level: "",
        description: "",
      },
      loading: false,
      isEdit: true, // 是否可以编辑
      treeData: [],
      defaultLevel: 1,
      defaultProps: {
        children: "children",
        label: "title",
      },
      cascaderProps: {
        children: "children",
        label: "title",
        value: "id",
        emitPath: false,
        checkStrictly: true,
      },
      // 校验规则
      rules: {
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
        ],
        parentId: [
          { required: true, message: "上级部门不能为空", trigger: "blur" },
        ],
        level: [
          {
            required: true,
            message: "部门排序不能为空,且必须是数字",
            trigger: "blur",
          },
        ],
        description: [
          { required: true, message: "部门描述不能为空", trigger: "blur" },
        ],
      },
    });


    onMounted(()=>{
      getDeptTreeData();
    })

    //获取部门信息
    const getDeptTreeData = () => {
      state.loading = true;
      axios.get("/sys/department/tree").then((result) => {
        state.treeData = result;
        state.loading = false;
      });
    };

    const handleNodeClick = (data) => {
      state.isEdit = true;
      state.deptForm = data.source;
      if (data.children !== undefined) {
        state.defaultLevel = data.children.length + 1;
      } else {
        state.defaultLevel = 1;
      }
    };

    const handleChange = (data) => {
      console.log("data :", data);
    };

    //保存并刷新
    const saveAndFlush = () => {
      deptFormRef.value.validate((valid) => {
        if (valid) {
          // 修改部门信息
          if (state.deptForm.id > 0) {
            axios.put("/sys/department", state.deptForm).then((result) => {
              ElMessage({
                title: "成功",
                message: "修改部门成功!",
                type: "success",
              });
              getDeptTreeData();
              state.isEdit = true;
            });
          } else {
            // 新增部门
            axios.post("/sys/department", state.deptForm).then((result) => {
              ElMessage({
                title: "成功",
                message: "新增部门成功!",
                type: "success",
              });
              getDeptTreeData();
              state.isEdit = true;
            });
          }
        }
      });
    };

    //增加部门
    const addEntity = () => {
      state.isEdit = false;
      const parentId = state.deptForm.id;
      state.deptForm = {
        id: 0,
        name: "",
        parentId: parentId,
        level: state.defaultLevel,
        description: "",
      };
    };

    //删除部门
    const deleteEntity = () => {
      state.isEdit = true;
      if (state.deptForm.id > 0) {
        ElMessageBox.confirm(
          "确定要删除【" +
            state.deptForm.name +
            "】吗? 请确认这个部门下面没用户.否则无法删除 是否继续?",
          "警告",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(() => {
          axios.delete("/sys/department/" + state.deptForm.id).then((result) => {
            ElMessage({
              type: "success",
              title: "成功",
              message: "删除部门成功!",
            });
            getDeptTreeData();
          });
        });
      } else {
        ElMessage.error({
          title: "错误",
          message: "请先选中部门,才可以删除",
        });
      }
    };

    return {
      ...toRefs(state),
      deptFormRef,
      getDeptTreeData,
      handleNodeClick,
      handleChange,
      saveAndFlush,
      addEntity,
      deleteEntity,
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

.el-select {
  width: 100%;
}

.el-cascader {
  width: 100%;
}

.el-input-number {
  width: 100%;
}
</style>
