<template>
  <div class="download-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>下载中心</span>
        </div>
      </template>
      <div class="download-content">
        <p>下载中心页面</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 下载中心页面逻辑
</script>

<style scoped lang="scss">
.download-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.download-content {
  min-height: 400px;
}
</style>
