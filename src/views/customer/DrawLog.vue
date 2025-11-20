<template>
  <div class="page-container">
    <el-card class="filter-card" shadow="never">
      <!-- 筛选表单 -->
      <el-form :model="queryParams" label-width="80px" class="filter-form">
        <el-row :gutter="20">
          <!-- 姓名 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="姓名">
              <el-input
                v-model="queryParams.user_name"
                placeholder="请输入姓名"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <!-- 时间 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="时间">
              <el-date-picker
                v-model="createTimeRange"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <!-- 操作按钮 -->
          <el-col :xs="24" :sm="24" :md="12" :lg="12">
            <el-form-item label="" class="button-form-item">
              <div class="action-buttons">
                <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
                <el-button :icon="Refresh" @click="handleReset">重置</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card shadow="never">
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
      >
        <el-table-column prop="id" label="ID" min-width="80" align="center" />

        <!-- 姓名 -->
        <el-table-column prop="user_name" label="姓名" min-width="120" align="center" />

        <!-- 获奖名称 -->
        <el-table-column prop="prize_name" label="获奖名称" min-width="150" align="center" />

        <!-- 金额 -->
        <el-table-column label="金额" min-width="100" align="center">
          <template #default="{ row }">
            <el-image
              v-if="row.prize_image"
              :src="row.prize_image"
              :preview-src-list="[row.prize_image]"
              fit="cover"
              style="width: 50px; height: 50px; cursor: pointer"
            />
            <span v-else>-</span>
          </template>
        </el-table-column>

        <!-- 备注 -->
        <el-table-column
          prop="remark"
          label="备注"
          min-width="200"
          align="center"
          show-overflow-tooltip
        />

        <!-- 创建时间 -->
        <el-table-column prop="create_time" label="创建时间" min-width="180" align="center" />
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.limit"
          :page-sizes="[10, 15, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { getDrawLogListApi, type DrawLogParams, type DrawLogItem } from '@/api/drawLog'

// 查询参数
const queryParams = reactive<DrawLogParams>({
  page: 1,
  limit: 15,
  user_name: '',
  create_time: ''
})

// 时间范围
const createTimeRange = ref<[string, string] | null>(null)

// 监听时间范围变化
watch(createTimeRange, (val) => {
  queryParams.create_time = val ? val.join(' - ') : ''
})

// 表格数据
const tableData = ref<DrawLogItem[]>([])
const total = ref(0)
const loading = ref(false)

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const res = await getDrawLogListApi(queryParams)
    console.log('抽奖记录响应:', res)
    tableData.value = res.data || []
    total.value = res.count || 0
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
  queryParams.user_name = ''
  createTimeRange.value = null
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

onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
.page-container {
  width: 100%;

  .filter-card {
    margin-bottom: 20px;

    :deep(.el-card__body) {
      padding: 15px;
    }
  }

  .filter-form {
    .button-form-item {
      :deep(.el-form-item__content) {
        justify-content: flex-end;
      }
    }

    .action-buttons {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
