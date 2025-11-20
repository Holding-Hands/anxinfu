<template>
  <div class="page-container">
    <el-card class="filter-card" shadow="never">
      <!-- 筛选表单 -->
      <el-form :model="queryParams" class="filter-form">
        <el-row :gutter="20">
          <!-- 用户名 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="用户名" label-width="80px">
              <el-input
                v-model="queryParams.name"
                placeholder="请输入用户名"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <!-- 手机号 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="手机号" label-width="80px">
              <el-input
                v-model="queryParams.mobile"
                placeholder="请输入手机号"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <!-- 操作时间 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="操作时间" label-width="80px">
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

          <!-- 资金类型 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="资金类型" label-width="80px">
              <el-select
                v-model="queryParams.wallet"
                placeholder="请选择资金类型"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in WALLET_TYPE_OPTIONS"
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

        <!-- 用户 -->
        <el-table-column prop="user_name" label="用户" min-width="150" align="center" />

        <!-- 申请金额 -->
        <el-table-column prop="amount" label="申请金额" min-width="120" align="center" />

        <!-- 提现金额 -->
        <el-table-column prop="money" label="提现金额" min-width="120" align="center" />

        <!-- 资金类型 -->
        <el-table-column prop="type" label="资金类型" min-width="120" align="center" />

        <!-- 提现类型 -->
        <el-table-column prop="pay_type" label="提现类型" min-width="100" align="center" />

        <!-- 渠道 -->
        <el-table-column label="渠道" min-width="100" align="center">
          <template #default="{ row }">
            {{ row.bank_type === 1 ? '支付宝' : row.bank_type === 2 ? '银行卡' : '-' }}
          </template>
        </el-table-column>

        <!-- 外名 -->
        <el-table-column prop="name" label="外名" min-width="120" align="center" />

        <!-- 支付宝账号 -->
        <el-table-column prop="alipayMobile" label="支付宝账号" min-width="130" align="center" />

        <!-- 银行开户行 -->
        <el-table-column label="银行开户行" min-width="200" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.user?.idcard_address || '-' }}
          </template>
        </el-table-column>

        <!-- 银行卡号 -->
        <el-table-column
          prop="bank_code"
          label="银行卡号"
          min-width="180"
          align="center"
          show-overflow-tooltip
        />

        <!-- 银行预留手机号 -->
        <el-table-column label="银行预留手机号" min-width="150" align="center">
          <template #default="{ row }">
            {{ row.user?.mobile || '-' }}
          </template>
        </el-table-column>

        <!-- 申请时间 -->
        <el-table-column prop="create_time" label="申请时间" min-width="180" align="center" />

        <!-- 状态 -->
        <el-table-column prop="status_name" label="状态" min-width="100" align="center">
          <template #default="{ row }">
            <div v-html="row.status_name"></div>
          </template>
        </el-table-column>

        <!-- 反馈信息 -->
        <el-table-column
          prop="alipay_msg"
          label="反馈信息"
          min-width="200"
          align="center"
          show-overflow-tooltip
        />
      </el-table>

      <!-- 总计展示 -->
      <div v-if="totalAmount" class="total-amount">
        <span>申请金额总计：{{ totalAmount.amount }}</span>
        <span style="margin-left: 30px">提现金额总计：{{ totalAmount.money }}</span>
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
import {
  getTixianRecordListApi,
  type TixianRecordParams,
  type TixianRecordItem
} from '@/api/tixianRecord'
import { WALLET_TYPE_OPTIONS } from '@/constants'
import { exportExcel } from '@/utils/export'

// 查询参数
const queryParams = reactive<TixianRecordParams>({
  page: 1,
  limit: 15,
  name: '',
  mobile: '',
  create_time: '',
  wallet: ''
})

// 时间范围
const timeRange = ref<[string, string] | null>(null)

// 表格数据
const tableData = ref<TixianRecordItem[]>([])
const total = ref(0)
const loading = ref(false)

// 总计数据
const totalAmount = ref<{ amount: string; money: string } | null>(null)

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
    const res = await getTixianRecordListApi(queryParams)
    if (res.code === 0) {
      // 处理数据，分离总计行
      const data = res.data || []
      const lastItem = data[data.length - 1]

      // 判断最后一项是否为总计
      if (lastItem && lastItem.amount.includes('总计')) {
        totalAmount.value = {
          amount: lastItem.amount,
          money: lastItem.money
        }
        tableData.value = data.slice(0, -1) as TixianRecordItem[]
      } else {
        totalAmount.value = null
        tableData.value = data as TixianRecordItem[]
      }

      total.value = res.count || 0
    } else {
      ElMessage.error(res.msg || '获取数据失败')
    }
  } catch (error) {
    console.error('获取提现记录列表失败:', error)
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
  queryParams.name = ''
  queryParams.mobile = ''
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
      { key: 'user_name', title: '用户' },
      { key: 'amount', title: '申请金额' },
      { key: 'money', title: '提现金额' },
      { key: 'type', title: '资金类型' },
      { key: 'pay_type', title: '提现类型' },
      {
        key: 'bank_type',
        title: '渠道',
        formatter: (value: number) => (value === 1 ? '支付宝' : value === 2 ? '银行卡' : '-')
      },
      { key: 'name', title: '外名' },
      { key: 'alipayMobile', title: '支付宝账号' },
      {
        key: 'user',
        title: '银行开户行',
        formatter: (value: any) => value?.idcard_address || '-'
      },
      { key: 'bank_code', title: '银行卡号' },
      {
        key: 'user',
        title: '银行预留手机号',
        formatter: (value: any) => value?.mobile || '-'
      },
      { key: 'create_time', title: '申请时间' },
      {
        key: 'status_name',
        title: '状态',
        formatter: (value: string) => {
          const div = document.createElement('div')
          div.innerHTML = value || ''
          return div.textContent || div.innerText || ''
        }
      },
      { key: 'alipay_msg', title: '反馈信息' }
    ]

    exportExcel({
      data: tableData.value,
      columns: headers,
      filename: '提现记录'
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
