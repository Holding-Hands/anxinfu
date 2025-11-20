<template>
  <div class="page-container">
    <el-card class="filter-card" shadow="never">
      <!-- 筛选表单 -->
      <el-form :model="queryParams" class="filter-form">
        <el-row :gutter="20">
          <!-- 模式 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="模式" label-width="80px">
              <el-select
                v-model="queryParams.sys_type"
                placeholder="请选择模式"
                clearable
                style="width: 100%"
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

          <!-- 产品 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="产品" label-width="80px">
              <el-select
                v-model="queryParams.product_id"
                placeholder="请选择产品"
                clearable
                style="width: 100%"
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

          <!-- 姓名 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="姓名" label-width="80px">
              <el-input
                v-model="queryParams.name"
                placeholder="请输入姓名"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <!-- SN -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="SN" label-width="80px">
              <el-input
                v-model="queryParams.sn"
                placeholder="请输入SN"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <!-- 资金类型 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="资金类型" label-width="80px">
              <el-select
                v-model="queryParams.type"
                placeholder="请选择资金类型"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in PROFIT_TYPE_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 时间 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="时间" label-width="80px">
              <el-date-picker
                v-model="timeRange"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
                @change="handleTimeChange"
              />
            </el-form-item>
          </el-col>

          <!-- 钱包 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="钱包" label-width="80px">
              <el-select
                v-model="queryParams.wallet"
                placeholder="请选择钱包"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in PROFIT_WALLET_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 操作按钮 -->
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-form-item label=" " class="filter-actions">
              <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
              <el-button :icon="Refresh" @click="handleReset">重置</el-button>
              <el-button type="success" :icon="Download" @click="handleExport">导出</el-button>
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

        <!-- 模式 -->
        <el-table-column prop="sys_type_name" label="模式" min-width="100" align="center" />

        <!-- 产品 -->
        <el-table-column prop="product_name" label="产品" min-width="120" align="center" />

        <!-- 用户 -->
        <el-table-column label="用户" min-width="180" align="center">
          <template #default="{ row }">
            <div v-html="row.username"></div>
          </template>
        </el-table-column>

        <!-- SN -->
        <el-table-column
          prop="sn"
          label="SN"
          min-width="150"
          align="center"
          show-overflow-tooltip
        />

        <!-- 税前 -->
        <el-table-column prop="pre_tax" label="税前" min-width="100" align="center" />

        <!-- 收益 -->
        <el-table-column prop="profit" label="收益" min-width="100" align="center" />

        <!-- 变动后金额 -->
        <el-table-column prop="mafter" label="变动后金额" min-width="120" align="center" />

        <!-- 资金类型 -->
        <el-table-column prop="wallet" label="资金类型" min-width="100" align="center" />

        <!-- 备注 -->
        <el-table-column
          prop="remark"
          label="备注"
          min-width="150"
          align="center"
          show-overflow-tooltip
        />

        <!-- 时间 -->
        <el-table-column prop="create_time" label="时间" min-width="180" align="center" />
      </el-table>

      <!-- 合计展示 -->
      <div v-if="totalAmount" class="total-amount">
        <span>税前合计：{{ totalAmount.pre_tax }}</span>
        <span style="margin-left: 30px">收益合计：{{ totalAmount.profit }}</span>
      </div>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="queryParams.page"
        v-model:page-size="queryParams.limit"
        :total="total"
        :page-sizes="[15, 30, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px; justify-content: flex-end"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh, Download } from '@element-plus/icons-vue'
import { getProfitListApi, type ProfitParams, type ProfitItem } from '@/api/profit'
import {
  SYS_TYPE_OPTIONS,
  PRODUCT_OPTIONS,
  PROFIT_WALLET_OPTIONS,
  PROFIT_TYPE_OPTIONS
} from '@/constants'
import { exportExcel } from '@/utils/export'

// 查询参数
const queryParams = reactive<ProfitParams>({
  page: 1,
  limit: 15,
  sys_type: '',
  product_id: '',
  name: '',
  sn: '',
  type: '',
  create_time: '',
  wallet: ''
})

// 时间范围
const timeRange = ref<[string, string] | null>(null)

// 表格数据
const tableData = ref<ProfitItem[]>([])
const total = ref(0)
const loading = ref(false)

// 合计数据
const totalAmount = ref<{ pre_tax: string; profit: string } | null>(null)

// 处理时间变化
const handleTimeChange = (value: [string, string] | null) => {
  if (value && value.length === 2) {
    queryParams.create_time = `${value[0]} - ${value[1]}`
  } else {
    queryParams.create_time = ''
  }
}

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const res = await getProfitListApi(queryParams)
    if (res.code === 0) {
      // 处理数据，分离合计行
      const data = res.data || []
      const lastItem = data[data.length - 1]

      // 判断最后一项是否为合计
      if (lastItem && lastItem.pre_tax.includes('合计')) {
        totalAmount.value = {
          pre_tax: lastItem.pre_tax,
          profit: lastItem.profit
        }
        tableData.value = data.slice(0, -1) as ProfitItem[]
      } else {
        totalAmount.value = null
        tableData.value = data as ProfitItem[]
      }

      total.value = res.count || 0
    } else {
      ElMessage.error(res.msg || '获取数据失败')
    }
  } catch (error) {
    console.error('获取收益明细列表失败:', error)
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
  queryParams.sys_type = ''
  queryParams.product_id = ''
  queryParams.name = ''
  queryParams.sn = ''
  queryParams.type = ''
  queryParams.create_time = ''
  queryParams.wallet = ''
  timeRange.value = null
  getList()
}

// 分页大小变化
const handleSizeChange = (val: number) => {
  queryParams.limit = val
  queryParams.page = 1
  getList()
}

// 当前页变化
const handleCurrentChange = (val: number) => {
  queryParams.page = val
  getList()
}

// 导出
const handleExport = () => {
  if (tableData.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  try {
    const headers = [
      { key: 'id', title: 'ID' },
      { key: 'sys_type_name', title: '模式' },
      { key: 'product_name', title: '产品' },
      {
        key: 'username',
        title: '用户',
        formatter: (value: string) => {
          const div = document.createElement('div')
          div.innerHTML = value || ''
          return div.textContent || div.innerText || ''
        }
      },
      { key: 'sn', title: 'SN' },
      { key: 'pre_tax', title: '税前' },
      { key: 'profit', title: '收益' },
      { key: 'mafter', title: '变动后金额' },
      { key: 'wallet', title: '资金类型' },
      { key: 'remark', title: '备注' },
      { key: 'create_time', title: '时间' }
    ]

    exportExcel({
      data: tableData.value,
      columns: headers,
      filename: '收益明细'
    })

    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败，请稍后重试')
  }
}

// 监听分页变化
watch(
  () => [queryParams.page, queryParams.limit],
  () => {
    getList()
  }
)

// 初始化
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

  .filter-actions {
    :deep(.el-form-item__content) {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
  }

  .total-amount {
    margin-top: 15px;
    padding: 10px;
    background-color: #f5f7fa;
    border-radius: 4px;
    font-weight: bold;
    color: #606266;
  }
}
</style>
