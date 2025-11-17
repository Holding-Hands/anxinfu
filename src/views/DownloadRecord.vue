<template>
  <div class="page-container">
    <el-card class="filter-card" shadow="never">
      <!-- 筛选表单 -->
      <el-form :model="queryParams" label-width="100px" class="filter-form">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="类型">
              <el-select
                v-model="queryParams.type"
                placeholder="请选择类型"
                clearable
                filterable
                @change="handleQuery"
              >
                <el-option
                  v-for="item in DOWNLOAD_TYPE_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="18">
            <el-form-item label=" " class="filter-actions">
              <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
              <el-button :icon="Refresh" @click="handleReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">下载记录</span>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
      >
        <el-table-column prop="id" label="ID" width="80" align="center" fixed="left" />

        <el-table-column prop="typeName" label="类型" width="150" align="center" />

        <el-table-column prop="file_name" label="文件名" min-width="200" align="center">
          <template #default="{ row }">
            <span>{{ row.file_name || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="size" label="文件大小" width="120" align="center">
          <template #default="{ row }">
            <span>{{ row.size || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            {{ row.status === 0 ? '正常' : '已清理' }}
          </template>
        </el-table-column>

        <el-table-column prop="create_time" label="创建时间" width="180" align="center" />

        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.down_url && row.size !== '已清理'"
              type="primary"
              link
              @click="handleDownload(row)"
            >
              下载
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.limit"
          :page-sizes="[10, 15, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import {
  getDownloadRecordListApi,
  deleteDownloadRecordApi,
  type DownloadRecordParams,
  type DownloadRecordItem
} from '@/api/download'
import { DOWNLOAD_TYPE_OPTIONS } from '@/constants'

// 查询参数
const queryParams = reactive<DownloadRecordParams>({
  page: 1,
  limit: 15,
  type: '' // 默认显示"全部"
})

// 表格数据
const tableData = ref<DownloadRecordItem[]>([])
const total = ref(0)
const loading = ref(false)

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const res = await getDownloadRecordListApi(queryParams)
    console.log('下载记录响应:', res)

    // 根据实际返回的数据结构处理
    if (res.code === 0) {
      tableData.value = res.data || []
      total.value = res.count || 0
    } else {
      ElMessage.error(res.msg || '获取数据失败')
    }
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 查询
const handleQuery = () => {
  queryParams.page = 1
  getList()
}

// 重置
const handleReset = () => {
  queryParams.page = 1
  queryParams.limit = 15
  queryParams.type = '' // 重置为"全部"
  getList()
}

// 分页大小改变
const handleSizeChange = (val: number) => {
  queryParams.limit = val
  queryParams.page = 1
  getList()
}

// 当前页改变
const handleCurrentChange = (val: number) => {
  queryParams.page = val
  getList()
}

// 下载文件
const handleDownload = (row: DownloadRecordItem) => {
  if (!row.down_url) {
    ElMessage.warning('下载链接不存在')
    return
  }

  if (row.size === '已清理') {
    ElMessage.warning('文件已清理，无法下载')
    return
  }

  // 打开下载链接
  window.open(row.down_url, '_blank')
}

// 删除记录
const handleDelete = async (row: DownloadRecordItem) => {
  try {
    await ElMessageBox.confirm('确定要删除这条下载记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 调用删除接口
    const res = await deleteDownloadRecordApi(row.id)

    if (res.code === 1) {
      ElMessage.success(res.msg || '删除成功')
      // 刷新列表
      getList()
    } else {
      ElMessage.error(res.msg || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败，请稍后重试')
    }
  }
}

// 页面加载时获取数据
onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
.page-container {
  padding: 20px;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-form {
  :deep(.el-form-item) {
    margin-bottom: 0;
  }
}

.filter-actions {
  :deep(.el-form-item__content) {
    justify-content: flex-start;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .card-title {
    font-size: 16px;
    font-weight: 600;
  }
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
