<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span class="card-title">代理列表 1.0</span>
      </template>

      <!-- 示例：使用全局常量的筛选表单 -->
      <el-form :model="queryParams" inline>
        <el-form-item label="等级">
          <el-select v-model="queryParams.level" placeholder="请选择等级" clearable>
            <el-option
              v-for="item in USER_LEVEL_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="用户类别">
          <el-select v-model="queryParams.user_type" placeholder="请选择类别" clearable>
            <el-option
              v-for="item in USER_TYPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="实名状态">
          <el-select v-model="queryParams.is_auth" placeholder="请选择状态" clearable>
            <el-option
              v-for="item in AUTH_STATUS_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
      </el-form>

      <el-empty description="页面开发中..." style="margin-top: 20px;" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import {
  USER_LEVEL_OPTIONS,
  USER_TYPE_OPTIONS,
  AUTH_STATUS_OPTIONS
} from '@/constants'

// 查询参数
const queryParams = reactive({
  level: '',
  user_type: 0,
  is_auth: 'all'
})
</script>

<style scoped lang="scss">
.page-container {
  padding: 20px;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
}
</style>

