<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="card-title">代理列表 2.0</span>
          <el-button type="primary" :icon="Plus">新增代理</el-button>
        </div>
      </template>
      
      <el-empty description="页面开发中..." />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
</script>

<style scoped lang="scss">
.page-container {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .card-title {
      font-size: 16px;
      font-weight: bold;
    }
  }
}
</style>

