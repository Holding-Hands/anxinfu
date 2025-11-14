<template>
  <div class="customer-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>客户管理</span>
        </div>
      </template>
      <div class="customer-content">
        <p>客户管理页面</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 客户管理页面逻辑
</script>

<style scoped lang="scss">
.customer-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.customer-content {
  min-height: 400px;
}
</style>
