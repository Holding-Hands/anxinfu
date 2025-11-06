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
            <el-form-item label="产品">
              <el-select
                v-model="queryParams.product_id"
                placeholder="请选择产品"
                clearable
                filterable
                @change="handleQuery"
              >
                <el-option
                  v-for="item in PRODUCT_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="交易类型">
              <el-select
                v-model="queryParams.card_type"
                placeholder="请选择交易类型"
                clearable
                filterable
                @change="handleQuery"
              >
                <el-option
                  v-for="item in CARD_TYPE_OPTIONS"
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
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="月份">
              <el-date-picker
                v-model="queryParams.month"
                type="month"
                placeholder="请选择月份"
                format="YYYYMM"
                value-format="YYYYMM"
                clearable
                style="width: 100%"
                @change="handleQuery"
              />
            </el-form-item>
          </el-col>

          <el-col :span="18">
            <el-form-item label=" " class="filter-actions">
              <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
              <el-button :icon="Refresh" @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExport">导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">盟友业绩列表</span>
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
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="id" label="ID" width="80" align="center" fixed="left" />

        <el-table-column prop="user_name" label="所属盟友" width="200" align="center" fixed="left">
          <template #default="{ row }">
            <div>{{ row.user_name }}</div>
            <div style="font-size: 12px; color: #999">{{ row.mobile }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="sys_type_name" label="模式" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="row.sys_type === 1 ? 'success' : 'warning'">
              {{ row.sys_type_name }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="product_name" label="产品" width="150" align="center" />

        <el-table-column prop="card_type" label="交易类型" width="120" align="center">
          <template #default="{ row }">
            <el-tag>{{ row.card_type }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="zy_money" label="直营交易" width="150" align="center">
          <template #default="{ row }">
            <span style="color: #67c23a; font-weight: bold">¥{{ formatMoney(row.zy_money) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="td_money" label="团队交易" width="150" align="center">
          <template #default="{ row }">
            <span style="color: #409eff; font-weight: bold">¥{{ formatMoney(row.td_money) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="month" label="月份" width="120" align="center">
          <template #default="{ row }">
            {{ formatMonth(row.month) }}
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
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { getTradeSumListApi, type TradeSumListParams, type TradeSumListItem } from '@/api/user'
import { SYS_TYPE_OPTIONS, PRODUCT_OPTIONS, CARD_TYPE_OPTIONS } from '@/constants'
import { exportExcel, type ExportColumn } from '@/utils/export'

// 查询参数
const queryParams = reactive<TradeSumListParams>({
  page: 1,
  limit: 15,
  sys_type: '',
  product_id: 0,
  card_type: '',
  mobile: '',
  month: ''
})

// 表格数据
const tableData = ref<TradeSumListItem[]>([])
const total = ref(0)
const loading = ref(false)

// 统计数据
const totalZyMoney = ref(0)
const totalTdMoney = ref(0)

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const res = await getTradeSumListApi(queryParams)
    console.log('盟友业绩列表响应:', res)
    console.log('数据示例:', res.data?.[0])

    // 根据实际返回的数据结构处理，过滤掉无效数据
    const rawData = res.data || []
    // 过滤掉 id 为空或 undefined 的无效数据
    tableData.value = rawData.filter((item: TradeSumListItem) => item && item.id)
    total.value = res.count || res.total || 0

    // 计算总额
    calculateTotals()
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 计算总额
const calculateTotals = () => {
  totalZyMoney.value = tableData.value.reduce((sum, item) => {
    const money = parseFloat(item.zy_money || '0')
    return sum + (isNaN(money) ? 0 : money)
  }, 0)

  totalTdMoney.value = tableData.value.reduce((sum, item) => {
    const money = parseFloat(item.td_money || '0')
    return sum + (isNaN(money) ? 0 : money)
  }, 0)
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
  queryParams.product_id = 0
  queryParams.card_type = ''
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

// 格式化金额
const formatMoney = (money: string | number): string => {
  if (money === null || money === undefined || money === '') return '0.00'
  const num = typeof money === 'string' ? parseFloat(money) : money
  if (isNaN(num)) return '0.00'
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 格式化月份
const formatMonth = (month: number | string): string => {
  if (!month) return '-'
  const monthStr = String(month)
  // 格式: 202511 -> 2025-11
  if (monthStr.length === 6) {
    return `${monthStr.substring(0, 4)}-${monthStr.substring(4, 6)}`
  }
  return monthStr
}

// 合计行
const getSummaries = (param: { columns: { property?: string }[]; data: TradeSumListItem[] }) => {
  const { columns } = param
  const sums: string[] = []

  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = ''
      return
    }
    if (index === 1) {
      sums[index] = '总计'
      return
    }
    if (column.property === 'zy_money') {
      sums[index] = `¥${formatMoney(totalZyMoney.value)}`
      return
    }
    if (column.property === 'td_money') {
      sums[index] = `¥${formatMoney(totalTdMoney.value)}`
      return
    }
    sums[index] = ''
  })

  return sums
}

// 导出Excel
const handleExport = () => {
  try {
    if (!tableData.value || tableData.value.length === 0) {
      ElMessage.warning('暂无数据可导出')
      return
    }

    // 定义导出列
    const columns: ExportColumn[] = [
      { key: 'id', title: 'ID' },
      { key: 'user_name', title: '所属盟友' },
      { key: 'mobile', title: '手机号' },
      { key: 'sys_type_name', title: '模式' },
      { key: 'product_name', title: '产品' },
      { key: 'card_type', title: '交易类型' },
      { key: 'zy_money', title: '直营交易' },
      { key: 'td_money', title: '团队交易' },
      {
        key: 'month',
        title: '月份',
        formatter: (value) => formatMonth(value)
      }
    ]

    // 执行导出
    exportExcel({
      data: tableData.value,
      columns,
      filename: '盟友业绩列表'
    })

    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败，请稍后重试')
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
}
</style>
