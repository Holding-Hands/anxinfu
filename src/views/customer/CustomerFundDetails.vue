<template>
  <div class="page-container">
    <el-card class="filter-card" shadow="never">
      <!-- 筛选表单 -->
      <el-form :model="queryParams" label-width="100px" class="filter-form">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="产品">
              <el-select
                v-model="queryParams.product_id"
                placeholder="全部"
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

          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="姓名">
              <el-input
                v-model="queryParams.name"
                placeholder="请输入姓名"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="sn">
              <el-input
                v-model="queryParams.sn"
                placeholder="请输入sn"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="资金类型">
              <el-select
                v-model="queryParams.type"
                placeholder="所有"
                clearable
                @change="handleQuery"
              >
                <el-option label="全部" value="" />
                <el-option label="提现" :value="0" />
                <el-option label="押金返还" :value="1" />
                <el-option label="刷卡收益" :value="2" />
                <el-option label="抽奖收益" :value="3" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="时间">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD HH:mm:ss"
                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
                style="width: 100%"
                @change="handleDateChange"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="18">
            <el-form-item label=" " class="filter-actions">
              <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
              <el-button :icon="Refresh" @click="handleReset">重置</el-button>
              <el-button type="success" :icon="Download" @click="handleExport">导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 操作按钮区域 -->
    <el-card shadow="never" style="margin-top: 10px">
      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="id" label="ID" width="80" align="center" sortable="custom" />
        <el-table-column prop="customer_name" label="客户姓名" min-width="120" align="center" />
        <el-table-column prop="customer_mobile" label="客户手机" min-width="130" align="center" />
        <el-table-column prop="product_name" label="产品" min-width="120" align="center">
          <template #default="{ row }">
            {{ row.product_name || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="sn" label="SN" min-width="120" align="center" />
        <el-table-column prop="pre_tax" label="税前" min-width="100" align="center" />
        <el-table-column prop="mbefore" label="变动前" min-width="100" align="center" />
        <el-table-column prop="profit" label="收益" min-width="100" align="center" />
        <el-table-column prop="mafter" label="变动后" min-width="100" align="center" />
        <el-table-column prop="remark" label="备注" min-width="150" align="center" />
        <el-table-column prop="create_time" label="时间" min-width="160" align="center" />
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
import { Search, Refresh, Download } from '@element-plus/icons-vue'
import { PRODUCT_OPTIONS } from '@/constants'
import {
  getCustomerProfitListApi,
  type CustomerProfitListParams,
  type CustomerProfitListItem
} from '@/api/customer'
import { exportExcel, type ExportColumn } from '@/utils/export'

// 查询参数
const queryParams = reactive<CustomerProfitListParams>({
  page: 1,
  limit: 15,
  product_id: '',
  name: '',
  sn: '',
  type: '',
  create_time: ''
})

// 日期范围
const dateRange = ref<[string, string] | null>(null)

// 表格数据
const tableData = ref<CustomerProfitListItem[]>([])
const total = ref(0)
const loading = ref(false)

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    // 处理时间范围
    if (dateRange.value && dateRange.value.length === 2) {
      queryParams.create_time = `${dateRange.value[0]} - ${dateRange.value[1]}`
    } else {
      queryParams.create_time = ''
    }

    const res = await getCustomerProfitListApi(queryParams)
    console.log('客户资金明细响应:', res)

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

// 日期变化处理
const handleDateChange = (val: [string, string] | null) => {
  if (!val) {
    queryParams.create_time = ''
  }
  handleQuery()
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
  queryParams.product_id = ''
  queryParams.name = ''
  queryParams.sn = ''
  queryParams.type = ''
  queryParams.create_time = ''
  dateRange.value = null
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
      { key: 'customer_name', title: '客户姓名' },
      { key: 'customer_mobile', title: '客户手机' },
      { key: 'product_name', title: '产品' },
      { key: 'sn', title: 'SN' },
      { key: 'pre_tax', title: '税前' },
      { key: 'mbefore', title: '变动前' },
      { key: 'profit', title: '收益' },
      { key: 'mafter', title: '变动后' },
      { key: 'remark', title: '备注' },
      { key: 'create_time', title: '时间' }
    ]

    // 执行导出
    exportExcel({
      data: tableData.value,
      columns,
      filename: '客户资金明细'
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
      margin-bottom: 20px;

      :deep(.el-form-item__content) {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
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
}
</style>
