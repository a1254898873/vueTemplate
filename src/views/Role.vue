<template>
  <el-container>
    <el-header>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="addRoleEntity">新增角色</el-button>
        </el-col>
        <el-col :span="20">
          <el-alert
            title="请勿乱删除角色, 确实需要删除角色的时候, (1).请确定这个角色下面没有用户, (2).请确定这个角色没有分配权限. 只有满足以上两种情况才可以删除角色成功!"
            type="info"
          />
        </el-col>
      </el-row>

      <el-dialog
        v-model="dialog.visible"
        :before-close="handleClose"
        :title="dialog.title"
        width="550px"
      >
        <el-form
          id="role"
          ref="entityRef"
          :model="entity"
          :rules="rules"
          label-width="80px"
        >
          <template v-if="entity.rid > 0">
            <el-form-item label="角色ID">
              <el-input v-model="entity.rid" disabled />
            </el-form-item>
          </template>
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="entity.roleName" clearable />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="entity.description" clearable />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialog.visible = false">取 消</el-button>
            <el-button type="primary" @click="saveAndFlush">确 定</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 角色权限列表 -->
      <el-dialog
        v-model="authority.visible"
        :title="authority.title"
        :before-close="handleClose"
        width="400px"
      >
        <el-tree
          ref="treeList"
          :data="authority.list"
          :props="authority.props"
          :default-checked-keys="authority.checkedKeys"
          show-checkbox
          highlight-current
          node-key="id"
        />
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="authority.visible = false">取 消</el-button>
            <el-button type="primary" @click="updateRolePermissions"
              >确 定</el-button
            >
          </span>
        </template>
      </el-dialog>
    </el-header>

    <el-main>
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column fixed prop="rid" label="角色ID" width="100" />
        <el-table-column prop="roleName" label="角色名称" />
        <el-table-column prop="description" label="角色描述" />
        <el-table-column prop="createTime" label="添加时间"> </el-table-column>
        <el-table-column prop="lastUpdateTime" label="修改时间">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="250">
          <template #default="scope">
            <el-button
              type="info"
              @click="getRolePermissions(scope.$index, scope.row)"
              size="small"
              >修改权限
            </el-button>
            <el-button
              type="primary"
              @click="updateRoleEntity(scope.$index, scope.row)"
              size="small"
              >编辑</el-button
            >
            <el-button
              type="danger"
              @click="deleteRoleEntity(scope.$index, scope.row)"
              size="small"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination
        :page-size="page.pageSize"
        :total="page.total"
        layout="total,prev, pager, next, jumper"
        background
        @current-change="currentChange"
      />
    </el-footer>
  </el-container>
</template>

<script>
import { reactive, toRefs, ref, onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import axios from "@/utils/axios";
export default {
  name: "Role",
  components: {},
  setup() {
    //tree组件的ref
    const treeList = ref();
    const entityRef = ref();
    const state = reactive({
      page: {
        pageNum: 1,
        pageSize: 10,
        keywords: "",
        total: 0,
      },
      entity: {
        rid: 0,
        description: "",
        roleName: "",
      },
      dialog: {
        visible: false,
        title: "",
      },
      tableData: [],
      loading: false,
      authority: {
        list: [],
        props: {
          label: "title",
          children: "children",
        },
        checkedKeys: [],
        rid: 0,
        visible: false,
        title: "",
      },
      options: [
        { value: 0, label: "被删除" },
        { value: 1, label: "正常" },
        { value: 2, label: "隐藏" },
      ],
      // 校验规则
      rules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
          {
            validator: function (rule, value, callback) {
              const regex = /[R][O][L][E][_][A-Z]{4,}/;
              if (!regex.test(value)) {
                callback(
                  new Error("角色名称必须是全大写英文,并且要以“ROLE_”开头")
                );
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        description: [
          { required: true, message: "角色描述不能为空", trigger: "blur" },
        ],
      },
    });

    onMounted(() => {
      getTableData();
    });

    // 获取角色列表
    const getTableData = () => {
      state.loading = true;
      const params = state.page;
      axios.get("/sys/role/page", { params }).then((result) => {
        state.tableData = result.list;
        state.page.total = result.total;
        state.loading = false;
      });
    };

    // 切换分页
    const currentChange = (index) => {
      state.page.pageNum = index;
      state.getTableData();
    };

    //清空角色信息
    const emptyEntity = () => {
      state.entity = {
        rid: 0,
        description: "",
        roleName: "",
      };
    };

    //新增角色信息
    const addRoleEntity = () => {
      emptyEntity();
      state.dialog.title = "新增角色";
      state.dialog.visible = true;
    };

    //修改角色信息
    const updateRoleEntity = (index, data) => {
      emptyEntity();
      state.entity = {
        rid: data.rid,
        roleName: data.roleName,
        description: data.description,
      };
      state.dialog.title = "修改角色";
      state.dialog.visible = true;
    };

    // 删除角色，如果当前角色有跟其他用户或者权限关联，无法删除
    const deleteRoleEntity = (index, data) => {
      if (data.rid > 0) {
        ElMessageBox.confirm(
          "确定要删除【" +
            data.description +
            "】吗? 请确认这个角色下面没有用户了.否则无法删除 是否继续?",
          "警告",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(() => {
          axios.delete("/sys/role/" + data.rid).then((result) => {
            ElMessage({
              title: "成功",
              message: "删除成功!",
              type: "success",
            });
            getTableData();
          });
        });
      } else {
        ElMessage.error({
          title: "错误",
          message: "请先选中角色,才可以删除",
        });
      }
    };

    const handleClose = (done) => {
      ElMessageBox.confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    };

    //保存并刷新
    const saveAndFlush = () => {
      entityRef.value.validate((valid) => {
        if (valid) {
          if (state.entity.rid > 0) {
            // 修改角色信息
            axios.put("/sys/role", state.entity).then((result) => {
              ElMessage({
                title: "成功",
                message: "修改角色成功!",
                type: "success",
              });
              getTableData();
              state.dialog.visible = false;
            });
          } else {
            // 新增角色
            axios.post("/sys/role", state.entity).then((result) => {
              ElMessage({
                title: "成功",
                message: "新增角色成功!",
                type: "success",
              });
              getTableData();
              state.dialog.visible = false;
            });
          }
        }
      });
    };

    // 查看当前角色拥有的权限
    const getRolePermissions = (index, data) => {
      if (data.rid > 0) {
        axios.get("/sys/role/info/" + data.rid).then((result) => {
          state.authority.list = result.all;
          state.authority.checkedKeys = result.have;
          state.authority.rid = data.rid;
          state.authority.title = data.description;
          state.authority.visible = true;
        });
      }
    };

    // 给角色修改权限
    const updateRolePermissions = () => {
      const list = treeList.value.getCheckedKeys();
      const father = treeList.value.getHalfCheckedNodes();
      if (father !== undefined && father !== null && father.length > 0) {
        father.forEach((f) => list.push(f.id));
      }
      axios
        .post("/sys/role/update/permissions", {
          rid: state.authority.rid,
          permissions: list,
        })
        .then((result) => {
          ElMessage({
            title: "成功",
            message: "修改角色权限成功!",
            type: "success",
          });
          getTableData();
          state.authority.visible = false;
        });
    };

    return {
      ...toRefs(state),
      treeList,
      entityRef,
      getTableData,
      currentChange,
      emptyEntity,
      addRoleEntity,
      updateRoleEntity,
      deleteRoleEntity,
      handleClose,
      saveAndFlush,
      getRolePermissions,
      updateRolePermissions,
    };
  },
};
</script>
<style  scoped>
</style>

<style>
#role .el-alert__title {
  font-size: 1rem;
}
</style>

