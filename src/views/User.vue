<template>
  <el-container id="user">
    <el-header>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="page.keywords"
            clearable
            placeholder="请输入关键字"
          />
        </el-col>
        <el-col :span="6">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="getUserTableData"
            >搜索
          </el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="info" @click="addUserEntity">添加用户 </el-button>
        </el-col>
        <el-col :span="6">
          <!-- 修改用户信息 -->
          <el-dialog
            v-model="dialog.visible"
            :title="dialog.title"
            width="30%"
            :before-close="handleClose"
          >
            <el-scrollbar height="300px">
              <el-form
                id="user"
                ref="entityRef"
                :model="entity"
                :rules="rules"
                label-width="80px"
              >
                <template v-if="entity.uid != ''">
                  <el-form-item label="用户ID">
                    <el-input v-model="entity.uid" disabled />
                  </el-form-item>
                </template>
                <el-form-item label="头像" prop="avatar">
                  <user-avatar :avatar="entity.avatar" @getAvatar="getAvatar" />
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                  <el-input v-model="entity.nickname" clearable />
                </el-form-item>
                <el-form-item label="账号" prop="username">
                  <el-input v-model="entity.username" clearable />
                </el-form-item>
                <template v-if="entity.uid == ''">
                  <el-form-item label="密码" prop="password">
                    <el-input
                      v-model="entity.password"
                      type="password"
                      clearable
                    />
                  </el-form-item>
                </template>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="entity.email" clearable />
                </el-form-item>
                <el-form-item label="生日" prop="birthday">
                  <el-date-picker
                    v-model="entity.birthday"
                    value-format="yyyy-MM-dd"
                    type="date"
                    :picker-options="pickerOptions"
                    placeholder="选择日期"
                  />
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                  <el-select
                    v-model="entity.gender"
                    clearable
                    filterable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in genderOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="部门" prop="deptId">
                  <el-cascader
                    v-model="entity.deptId"
                    :show-all-levels="false"
                    :options="deptTree"
                    clearable
                    filterable
                    :props="cascaderProps"
                  />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                  <el-select
                    v-model="entity.status"
                    clearable
                    filterable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in optionsStatus"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form>
            </el-scrollbar>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="dialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="saveAndFlush"
                  >确 定</el-button
                >
              </span>
            </template>
          </el-dialog>

          <!-- 修改用户角色 -->
          <el-dialog
            v-model="userRole.visible"
            :title="userRole.title"
            width="30%"
            :before-close="handleClose"
          >
            <el-checkbox-group v-model="entity.roles">
              <el-checkbox
                v-for="(item, index) in roleList"
                :key="index"
                :label="item.rid"
                >{{ item.description }}
              </el-checkbox>
            </el-checkbox-group>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="userRole.visible = false">取 消</el-button>
                <el-button type="primary" @click="saveUserRoles"
                  >确 定</el-button
                >
              </span>
            </template>
          </el-dialog>
        </el-col>
      </el-row>
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
        <el-table-column prop="nickname" label="用户昵称" fixed />
        <el-table-column prop="uid" label="用户ID" width="80" />
        <el-table-column label="头像" width="100">
          <template #default="scope">
            <div
              class="avatar-wrapper"
              @click="viewBigAvatar(scope.row.avatar)"
            >
              <img :src="scope.row.avatar" class="user-avatar" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column
          prop="getder"
          label="性别"
          width="50"
          :formatter="showGender"
        >
        </el-table-column>
        <el-table-column prop="birthday" label="生日" width="100">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column label="拥有角色" width="120">
          <template #default="scope">
            <el-tooltip
              v-for="(role, index) in scope.row.roles"
              :key="index"
              :content="role.description"
              class="item"
              effect="dark"
              placement="top-start"
            >
              <el-tag type="success">{{ role.roleName }}</el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="所在部门" width="120">
          <template #default="scope">
            <el-tag>{{ scope.row.departmentName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="70"
          :formatter="showStatus"
        >
        </el-table-column>
        <el-table-column prop="createTime" label="添加时间" width="200">
        </el-table-column>
        <el-table-column prop="lastUpdateTime" label="修改时间" width="200">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="335">
          <template #default="scope">
            <el-button
              type="info"
              @click="updateUserRole(scope.$index, scope.row)"
              size="small"
              >修改角色
            </el-button>
            <el-button
              type="primary"
              @click="updateUserEntity(scope.$index, scope.row)"
              size="small"
              >编辑
            </el-button>
            <el-button
              type="danger"
              @click="deleteUserEntity(scope.$index, scope.row)"
              size="small"
              >删除
            </el-button>
            <el-button
              type="danger"
              @click="resetUserPassword(scope.$index, scope.row)"
              size="small"
              >重置密码
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination
        :page-size="page.pageNum"
        :total="page.total"
        layout="total,prev, pager, next, jumper"
        background
        @current-change="currentChange"
      />
    </el-footer>
  </el-container>
</template>

<script>
import { ElMessageBox, ElMessage } from "element-plus";
import { reactive, toRefs, ref, onMounted } from "vue";
import axios from "@/utils/axios";
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateNickname,
} from "@/utils/validate";
import UserAvatar from "@/components/UserAvatar.vue";
export default {
  components: {
    UserAvatar,
  },
  setup() {
    const entityRef = ref();
    const state = reactive({
      page: {
        pageNum: 1,
        pageSize: 10,
        keywords: "",
        total: 0,
      },
      entity: {
        uid: "",
        avatar: "", // 头像
        username: "", // 登录账户
        email: "", // 邮箱
        nickname: "", // 昵称
        password: "", // 密码
        gender: "", // 性别
        birthday: "", // 生日
        status: 0, // 状态
        deptId: 0, // 部门ID
        roles: [], // 角色列表
      },
      dialog: {
        visible: false,
        title: "",
      },
      userRole: {
        visible: false,
        title: "",
      },
      loading: false,
      tableData: [],
      deptTree: [],
      roleList: [],
      cascaderProps: {
        children: "children",
        label: "title",
        value: "id",
        emitPath: false,
        checkStrictly: true,
      },
      optionsStatus: [
        { value: 0, label: "禁用" },
        { value: 1, label: "正常" },
        { value: 2, label: "隐藏" },
      ],
      genderOptions: [
        { value: 0, label: "女" },
        { value: 1, label: "男" },
        { value: 2, label: "未知" },
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      // 校验规则
      rules: {
        avatar: [{ required: true, message: "头像不能为空", trigger: "blur" }],
        username: [
          { required: true, message: "登录账号不能为空", trigger: "blur" },
          { required: true, validator: validateUsername, trigger: "blur" },
        ],
        nickname: [
          { required: true, message: "昵称不能为空", trigger: "blur" },
          { required: true, validator: validateNickname, trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { required: true, validator: validatePassword, trigger: "blur" },
        ],
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { required: true, validator: validateEmail, trigger: "blur" },
        ],
        gender: [{ required: true, message: "性别必须选择~", trigger: "blur" }],
        birthday: [
          { required: true, message: "生日必须选择~", trigger: "blur" },
        ],
        status: [{ required: true, message: "状态必须选择~", trigger: "blur" }],
        deptId: [{ required: true, message: "部门必须选择~", trigger: "blur" }],
      },
    });

    onMounted(() => {
      getUserTableData();
      getDeptListData();
    });

    //展示性别
    const showGender = (row, column) => {
      if (row.gender == 0) {
        return "女";
      } else if (row.gender == 1) {
        return "男";
      } else {
        return "未知";
      }
    };

    //展示状态
    const showStatus = (row, column) => {
      if (row.status == 0) {
        return "禁用";
      } else if (row.status == 1) {
        return "正常";
      } else {
        return "隐藏";
      }
    };

    //获取用户信息
    const getUserTableData = () => {
      state.loading = true;
      const params = state.page;
      axios.get("/sys/user/info/page", { params }).then((result) => {
        state.tableData = result.list;
        state.page.total = result.total;
        state.loading = false;
      });
    };

    // 获取部门列表
    const getDeptListData = () => {
      state.loading = true;
      axios.get("/sys/department/tree").then((result) => {
        state.deptTree = result;
        state.loading = false;
      });
    };

    // 获取角色列表
    const getRoleListData = () => {
      state.loading = true;
      axios.get("/sys/role/all").then((result) => {
        state.roleList = result;
        state.loading = false;
      });
    };

    // 切换分页
    const currentChange = (pageNum) => {
      state.page.pageNum = pageNum;
      getUserTableData();
    };

    // 查看大头像
    const viewBigAvatar = (url) => {
      window.open(url);
    };

    // 重新给用户赋值权限
    const updateUserRole = (index, data) => {
      getRoleListData();
      emptyEntity();
      state.userRole = {
        visible: true,
        title: "修改用户角色",
      };
      const roles = [];
      data.roles.forEach((role) => {
        roles.push(role.rid);
      });
      state.entity.uid = data.uid;
      state.entity.nickname = data.nickname;
      state.entity.roles = roles;
    };

    // 保存用户的角色信息
    const saveUserRoles = () => {
      const roles = state.entity.roles;
      if (roles !== null && roles.length > 0) {
        ElMessageBox.confirm(
          "确定要修改【" + state.entity.nickname + "】的角色吗? 是否继续?",
          "警告",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(() => {
          axios
            .post("/sys/user/update/roles", {
              uid: state.entity.uid,
              roles: roles,
            })
            .then((result) => {
              ElMessage({ type: "success", message: "修改角色成功!" });
              state.userRole.visible = false;
              getUserTableData();
            });
        });
      } else {
        ElMessage.error({
          title: "错误",
          message: "请先选中角色,才可以修改",
        });
      }
    };

    // 获取上传头像的值
    const getAvatar = (data) => {
      state.entity.avatar = data;
    };

    // 清空用户信息
    const emptyEntity = () => {
      state.entity = {
        uid: "",
        avatar: "", // 头像
        username: "", // 登录账户
        email: "", // 邮箱
        nickname: "", // 昵称
        password: "", // 密码
        gender: "", // 性别
        birthday: "", // 生日
        status: "", // 状态
        deptId: "", // 部门ID
        roles: [], // 角色列表
      };
    };

    // 添加用户
    const addUserEntity = () => {
      getDeptListData();
      emptyEntity();
      state.dialog = {
        visible: true,
        title: "新建用户",
      };
    };

    const handleNodeClick = (data) => {
      console.log("data :", data);
    };

    // 修改用户信息
    const updateUserEntity = (index, data) => {
      emptyEntity();
      state.entity = {
        uid: data.uid,
        avatar: data.avatar, // 头像
        username: data.username, // 登录账户
        email: data.email, // 邮箱
        nickname: data.nickname, // 昵称
        password: data.password, // 密码
        gender: data.gender, // 性别
        birthday: data.birthday, // 生日
        status: data.status, // 状态
        deptId: data.deptId, // 部门ID
        roles: data.roles, // 角色列表
      };
      state.dialog = {
        visible: true,
        title: "修改用户信息",
      };
    };

    // 删除这个用户
    const deleteUserEntity = (index, data) => {
      if (data.uid !== null && data.uid !== "") {
        ElMessageBox.confirm(
          "确定要删除【" + data.nickname + "】吗? 是否继续?",
          "警告",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(() => {
          axios.delete("/sys/user/" + data.uid).then((result) => {
            ElMessage({ type: "success", message: "删除成功!" });
            getUserTableData();
          });
        });
      } else {
        ElMessage.error({
          title: "错误",
          message: "请先选中用户,才可以删除",
        });
      }
    };

    // 重置此用户密码
    const resetUserPassword = (index, data) => {
      let newPwd = "123456";
      if (data.uid !== null && data.uid !== "") {
        ElMessageBox.confirm(
          "确定要重置【" + data.nickname + "】的密码吗? 是否继续?",
          "警告",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(() => {
          axios
            .post("/sys/user/reset/password", {
              uid: data.uid,
              newPwd: newPwd,
            })
            .then((result) => {
              ElMessage({
                type: "success",
                message: `重置密码成功! 密码是 ${newPwd}`,
              });
              getUserTableData();
            });
        });
      } else {
        ElMessage.error({
          title: "错误",
          message: "请先选中用户,才可以删除",
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

    const saveAndFlush = () => {
      entityRef.value.validate((valid) => {
        if (valid) {
          delete state.entity.roles;
          if (state.entity.uid !== "") {
            axios.put("/sys/user", state.entity).then((result) => {
              ElMessage({
                title: "成功",
                message: "修改用户成功!",
                type: "success",
              });
              getUserTableData();
              state.dialog.visible = false;
            });
          } else {
            axios.post("/sys/user", state.entity).then((result) => {
              ElMessage({
                title: "成功",
                message: "添加用户成功!",
                type: "success",
              });
              getUserTableData();
              state.dialog.visible = false;
            });
          }
        }
      });
    };

    return {
      ...toRefs(state),
      entityRef,
      showGender,
      showStatus,
      getUserTableData,
      getDeptListData,
      getRoleListData,
      currentChange,
      viewBigAvatar,
      updateUserRole,
      saveUserRoles,
      getAvatar,
      emptyEntity,
      addUserEntity,
      handleNodeClick,
      updateUserEntity,
      deleteUserEntity,
      resetUserPassword,
      handleClose,
      saveAndFlush,
    };
  },
};
</script>
<style  scoped>
.avatar-wrapper {
  cursor: pointer;
  position: relative;
}
.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 10px;
}
</style>
<style >
.el-tag:hover {
  cursor: pointer;
}

.el-date-editor {
  width: 100%;
}

.el-cascader {
  width: 100%;
}

.el-select {
  width: 100%;
}
</style>
