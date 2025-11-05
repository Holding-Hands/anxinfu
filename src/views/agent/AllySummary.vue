<template>
  <div class="page-container">
    <el-card class="filter-card" shadow="never">
      <!-- 筛选表单 -->
      <el-form :model="queryParams" label-width="100px" class="filter-form">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="模式">
              <el-select
                v-model="queryParams.sys_type"
                placeholder="请选择模式"
                clearable
                filterable
                @change="handleQuery"
              >
                <el-option
                  v-for="item in SYS_TYPE_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="用户手机号">
              <el-input
                v-model="queryParams.mobile"
                placeholder="请输入用户手机号"
                clearable
                filterable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="月份">
              <el-date-picker
                v-model="queryParams.month"
                type="month"
                placeholder="请选择月份"
                format="YYYY-MM"
                value-format="YYYY-MM"
                style="width: 100%"
                @change="handleQuery"
              />
            </el-form-item>
          </el-col>

          <el-col :span="6">
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
          <span class="card-title">盟友业绩汇总</span>
          <div class="summary-info">
            <span class="summary-item">总计: 0</span>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
        show-summary
        :summary-method="getSummaries"
      >
        <el-table-column prop="id" label="ID" width="80" align="center" fixed="left" />
        <el-table-column prop="user_name" label="所属盟友" min-width="150" align="center" />
        <el-table-column prop="zy_money" label="直营交易" min-width="150" align="center">
          <template #default="{ row }">
            <span style="color: #67c23a; font-weight: bold">¥{{ formatMoney(row.zy_money) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="td_money" label="团队交易" min-width="150" align="center">
          <template #default="{ row }">
            <span style="color: #409eff; font-weight: bold">¥{{ formatMoney(row.td_money) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="month" label="月份" width="120" align="center" />
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
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { getAllySummaryApi, type AllySummaryParams, type AllySummaryItem } from '@/api/user'
import { SYS_TYPE_OPTIONS } from '@/constants'

// 查询参数
const queryParams = reactive<AllySummaryParams>({
  page: 1,
  limit: 15,
  sys_type: '', // 默认显示"全部"
  mobile: '',
  month: '' // 默认当前月份，可以在onMounted中设置
})

// 表格数据
const tableData = ref<AllySummaryItem[]>([])
const total = ref(0)
const loading = ref(false)

// 统计数据
const summaryData = reactive({
  totalZyMoney: 0,
  totalTdMoney: 0
})

// 格式化金额
const formatMoney = (money: string | number): string => {
  const num = typeof money === 'string' ? parseFloat(money) : money
  return isNaN(num) ? '0.00' : num.toFixed(2)
}

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const res = await getAllySummaryApi(queryParams)
    console.log('盟友业绩汇总响应:', res)

    // 根据实际返回的数据结构处理
    tableData.value = res.data || []
    total.value = res.count || res.total || 0

    // 计算统计数据
    calculateSummary()
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 计算统计数据
const calculateSummary = () => {
  let totalZy = 0
  let totalTd = 0

  tableData.value.forEach((item) => {
    const zyMoney = parseFloat(item.zy_money)
    const tdMoney = parseFloat(item.td_money)

    totalZy += isNaN(zyMoney) ? 0 : zyMoney
    totalTd += isNaN(tdMoney) ? 0 : tdMoney
  })

  summaryData.totalZyMoney = totalZy
  summaryData.totalTdMoney = totalTd
}

// 表格合计行
const getSummaries = (param: any) => {
  const { columns } = param
  const sums: string[] = []

  columns.forEach((column: any, index: number) => {
    if (index === 0) {
      sums[index] = '总计'
      return
    }

    if (column.property === 'zy_money') {
      sums[index] = `¥${summaryData.totalZyMoney.toFixed(2)}`
      return
    }

    if (column.property === 'td_money') {
      sums[index] = `¥${summaryData.totalTdMoney.toFixed(2)}`
      return
    }

    sums[index] = '-'
  })

  return sums
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
  queryParams.sys_type = ''
  queryParams.mobile = ''
  queryParams.month = ''
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

// 页面加载时获取数据
onMounted(() => {
  // 设置默认月份为当前月份
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  queryParams.month = `${year}-${month}`

  getList()
})
</script>

<style scoped lang="scss">
.page-container {
  padding: 20px;

  .filter-card {
    margin-bottom: 20px;

    :deep(.el-card__body) {
      padding-bottom: 0;
    }
  }

  .filter-form {
    .el-select,
    .el-input {
      width: 100%;
    }

    .filter-actions {
      text-align: right;

      :deep(.el-form-item__content) {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }
    }
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .card-title {
      font-size: 16px;
      font-weight: bold;
    }

    .summary-info {
      display: flex;
      gap: 20px;
      font-size: 14px;

      .summary-item {
        color: #606266;
      }
    }
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}

:deep(.el-table) {
  font-size: 13px;

  .el-table__cell {
    padding: 8px 0;
  }

  // 合计行样式
  .el-table__footer-wrapper {
    .el-table__footer {
      .cell {
        font-weight: bold;
        color: #303133;
      }
    }
  }
}
</style>
