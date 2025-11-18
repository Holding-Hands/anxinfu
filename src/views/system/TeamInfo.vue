<template>
  <div class="team-info-container">
    <el-card shadow="never">
      <template #header>
        <span class="card-title">查看商户</span>
      </template>

      <el-form label-width="150px" class="team-form">
        <el-form-item label="商户名称" prop="name">
          <div class="info-text">安鑫付</div>
        </el-form-item>

        <el-form-item label="编号">
          <div class="info-text">000001</div>
        </el-form-item>

        <el-form-item label="logo图">
          <div class="upload-container">
            <el-upload
              class="logo-uploader"
              :action="uploadAction"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
            >
              <img v-if="logo" :src="logo" class="logo-image" />
              <el-icon v-else class="logo-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <div class="upload-tips">
              <el-button v-if="logo" type="danger" size="small" @click="handleDeleteLogo">
                删除图片
              </el-button>
              <div class="tip-text">建议尺寸: 120x120像素</div>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="商户密钥">
          <div class="info-text">24d0687c4d4fab54a622e810791e8413</div>
        </el-form-item>

        <el-form-item label="商户法人">
          <div class="info-text">安鑫付</div>
        </el-form-item>

        <el-form-item label="手机号">
          <div class="info-text">15666666666</div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, type UploadProps } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 上传地址
const uploadAction = '/index/team/qiniu_upload.html'

// logo图片地址
const logo = ref('')

// 上传前校验
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const isImage = rawFile.type.startsWith('image/')
  const isLt2M = rawFile.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 上传成功
const handleUploadSuccess: UploadProps['onSuccess'] = (response) => {
  console.log('上传响应:', response)
  if (response.code === 1) {
    logo.value = response.data.src
    ElMessage.success('上传成功')
  } else {
    ElMessage.error(response.msg || '上传失败')
  }
}

// 上传失败
const handleUploadError: UploadProps['onError'] = () => {
  ElMessage.error('上传失败，请稍后重试')
}

// 删除logo
const handleDeleteLogo = () => {
  logo.value = ''
}
</script>

<style scoped lang="scss">
.team-info-container {
  padding: 0;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
}

.team-form {
  max-width: 800px;
}

.info-text {
  color: #606266;
  line-height: 32px;
}

.upload-container {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.logo-uploader {
  :deep(.el-upload) {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;

    &:hover {
      border-color: #409eff;
    }
  }
}

.logo-image {
  width: 120px;
  height: 120px;
  display: block;
  object-fit: cover;
}

.logo-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  text-align: center;
  line-height: 120px;
}

.upload-tips {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tip-text {
  font-size: 12px;
  color: #909399;
}
</style>
