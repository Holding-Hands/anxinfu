<template>
  <div class="config-manage-container">
    <el-card shadow="never">
      <!-- Tab切换 -->
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="基本" name="1" />
        <el-tab-pane label="系统" name="2" />
        <el-tab-pane label="开发" name="3" />
        <el-tab-pane label="授权" name="4" />
      </el-tabs>

      <!-- 操作按钮 -->
      <div class="toolbar">
        <el-button type="primary" :icon="Plus" @click="handleAdd">添加</el-button>
        <el-button type="success" :icon="CircleCheck" @click="handleBatchEnable">启用</el-button>
        <el-button type="danger" :icon="CircleClose" @click="handleBatchDisable">禁用</el-button>
        <el-button type="warning" :icon="Refresh" @click="getConfigList">刷新</el-button>
      </div>

      <!-- 表格 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />

        <el-table-column prop="title" label="配置标题" min-width="150" align="center" />

        <el-table-column prop="name" label="配置名称" min-width="180" align="center" />

        <el-table-column prop="sort" label="排序" min-width="80" align="center" />

        <el-table-column label="状态" min-width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="200" align="center" fixed="right">
          <template #default="{ row }">
            <div class="table-actions">
              <el-link type="primary" :underline="true" @click="handleEdit(row)">编辑</el-link>
              <el-link
                v-if="row.status === 0"
                type="success"
                :underline="true"
                @click="handleSingleEnable(row)"
              >
                启用
              </el-link>
              <el-link v-else type="danger" :underline="true" @click="handleSingleDisable(row)">
                禁用
              </el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.limit"
          :page-sizes="[10, 15, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh, CircleCheck, CircleClose } from '@element-plus/icons-vue'
import {
  getConfigListApi,
  setEnableConfigApi,
  setDisableConfigApi,
  type ConfigItem
} from '@/api/config'

// Tab选项
const activeTab = ref('1')

// 加载状态
const loading = ref(false)

// 表格数据
const tableData = ref<ConfigItem[]>([])

// 选中的行
const selectedRows = ref<ConfigItem[]>([])

// 分页参数
const pagination = ref({
  page: 1,
  limit: 15,
  total: 0
})

// 获取配置列表
const getConfigList = async () => {
  loading.value = true
  try {
    const response = await getConfigListApi({
      page: pagination.value.page,
      limit: pagination.value.limit,
      group: Number(activeTab.value)
    })

    if (response.code === 0) {
      tableData.value = response.data
      pagination.value.total = response.count
    } else {
      ElMessage.error(response.msg || '获取配置列表失败')
    }
  } catch (error) {
    console.error('获取配置列表失败:', error)
    ElMessage.error('获取配置列表失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// Tab切换
const handleTabChange = () => {
  pagination.value.page = 1
  getConfigList()
}

// 分页大小改变
const handleSizeChange = () => {
  pagination.value.page = 1
  getConfigList()
}

// 当前页改变
const handleCurrentChange = () => {
  getConfigList()
}

// 添加
const handleAdd = () => {
  ElMessage.info('添加功能开发中')
}

// 编辑
const handleEdit = (row: ConfigItem) => {
  console.log('编辑:', row)
  ElMessage.info('编辑功能开发中')
}

// 选择改变
const handleSelectionChange = (selection: ConfigItem[]) => {
  selectedRows.value = selection
}

// 批量启用
const handleBatchEnable = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要启用的配置项')
    return
  }

  try {
    await ElMessageBox.confirm('确定要启用选中的配置项吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    loading.value = true
    const response = await setEnableConfigApi(selectedRows.value)

    if (response.code === 1) {
      ElMessage.success(response.msg || '启用成功')
      // 刷新列表
      await getConfigList()
    } else {
      ElMessage.error(response.msg || '启用失败')
      loading.value = false
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('启用失败:', error)
      ElMessage.error('启用失败，请稍后重试')
    }
    loading.value = false
  }
}

// 批量禁用
const handleBatchDisable = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要禁用的配置项')
    return
  }

  try {
    await ElMessageBox.confirm('确定要禁用选中的配置项吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    loading.value = true
    const response = await setDisableConfigApi(selectedRows.value)

    if (response.code === 1) {
      ElMessage.success(response.msg || '禁用成功')
      // 刷新列表
      await getConfigList()
    } else {
      ElMessage.error(response.msg || '禁用失败')
      loading.value = false
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('禁用失败:', error)
      ElMessage.error('禁用失败，请稍后重试')
    }
    loading.value = false
  }
}

// 单个启用
const handleSingleEnable = async (row: ConfigItem) => {
  try {
    await ElMessageBox.confirm(`确定要启用"${row.title}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    loading.value = true
    const response = await setEnableConfigApi([row])

    if (response.code === 1) {
      ElMessage.success(response.msg || '启用成功')
      // 刷新列表
      await getConfigList()
    } else {
      ElMessage.error(response.msg || '启用失败')
      loading.value = false
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('启用失败:', error)
      ElMessage.error('启用失败，请稍后重试')
    }
    loading.value = false
  }
}

// 单个禁用
const handleSingleDisable = async (row: ConfigItem) => {
  try {
    await ElMessageBox.confirm(`确定要禁用"${row.title}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    loading.value = true
    const response = await setDisableConfigApi([row])

    if (response.code === 1) {
      ElMessage.success(response.msg || '禁用成功')
      // 刷新列表
      await getConfigList()
    } else {
      ElMessage.error(response.msg || '禁用失败')
      loading.value = false
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('禁用失败:', error)
      ElMessage.error('禁用失败，请稍后重试')
    }
    loading.value = false
  }
}

// 初始化
onMounted(() => {
  getConfigList()
})
</script>

<style scoped lang="scss">
.config-manage-container {
  padding: 20px;

  :deep(.el-card) {
    border-radius: 8px;
  }

  :deep(.el-tabs) {
    margin-bottom: 20px;
  }

  :deep(.el-tabs__header) {
    margin-bottom: 0;
  }

  :deep(.el-tabs__item) {
    font-size: 15px;
    padding: 0 30px;
    height: 50px;
    line-height: 50px;
  }

  .toolbar {
    margin-bottom: 20px;
  }

  .table-actions {
    display: flex;
    justify-content: center;
    gap: 12px;
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
