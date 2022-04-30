<template>
  <div>
    <el-upload
      :show-file-list="false"
      :headers="myHeaders"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :action="getAvatarAction"
      class="avatar-uploader"
      accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
    >
      <img v-if="imageUrl != ''" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import { reactive, toRefs, computed, watch } from "vue";
import { localGet } from "@/utils";
import config from "~/config";
export default {
  name: "UserAvatar",
  props: {
    avatar: {
      type: String,
      default: "",
    },
  },
  setup(props, ctx) {
    const state = reactive({
      imageUrl: "",
      myHeaders: "",
    });

    state.myHeaders = localGet("token");
    state.imageUrl = props.avatar;

    const getAvatarAction = computed(() => {
      return config[import.meta.env.MODE].baseUrl + "/upload/avatar";
    });

    watch(props.avatar, (newName, oldName) => {
      state.imageUrl = newName;
    });

    const handleAvatarSuccess = (res, file) => {
      if (res.status === 200) {
        // 删除老的头像
        deleteOldImage(state.imageUrl);
        // 将新的头像赋值
        state.imageUrl = res.data.url;
        ctx.emit("getAvatar", state.imageUrl);
      } else {
        ElMessage.error(res.message);
      }
    };

    const deleteOldImage = (url) => {
      axios
        .delete("/upload/delete?url=" + url)
        .then((result) => console.log("result :", result));
    };

    const beforeAvatarUpload = (file) => {
      const suffix = file.name.substring(file.name.lastIndexOf(".") + 1);
      // 判断图片的格式是否正确
      const isJPEG = suffix === "jpeg";
      const isPNG = suffix === "png";
      const isBMP = suffix === "bmp";
      const isJPG = suffix === "jpg";
      const isGIF = suffix === "gif";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPEG && !isPNG && !isBMP && !isJPG && !isGIF) {
        ElMessage.error(
          "头像只能是[ jpeg , png , bmp , jpg , gif ]后缀的图片格式!"
        );
      }
      if (!isLt2M) {
        ElMessage.error("头像图片大小不能超过2MB!");
      }
      return isJPEG || isPNG || isBMP || isJPG || (isGIF && isLt2M);
    };

    return {
      ...toRefs(state),
      getAvatarAction,
      handleAvatarSuccess,
      deleteOldImage,
      beforeAvatarUpload,
    };
  },
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
