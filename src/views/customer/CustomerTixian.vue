<template>
  <div class="page-container">
    <el-card class="filter-card" shadow="never">
      <!-- 筛选表单 -->
      <el-form :model="queryParams" label-width="100px" class="filter-form">
        <el-row :gutter="20">
          <!-- 客户姓名 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="客户姓名">
              <el-input
                v-model="queryParams.name"
                placeholder="请输入客户姓名"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <!-- 客户手机号 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="客户手机号">
              <el-input
                v-model="queryParams.mobile"
                placeholder="请输入客户手机号"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <!-- 申请时间 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="申请时间">
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
          <el-col :xs="24" :sm="24" :md="12" :lg="6">
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
      <!-- 导出按钮 -->
      <div style="margin-bottom: 15px">
        <el-button type="success" @click="handleExport">导出Excel</el-button>
      </div>

      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
      >
        <el-table-column prop="id" label="ID" min-width="80" align="center" />

        <!-- 批次号 -->
        <el-table-column
          prop="batch_no"
          label="批次号"
          min-width="150"
          align="center"
          show-overflow-tooltip
        />

        <!-- 订单号 -->
        <el-table-column
          prop="order_no"
          label="订单号"
          min-width="180"
          align="center"
          show-overflow-tooltip
        />

        <!-- 客户姓名 -->
        <el-table-column prop="customer_name" label="客户姓名" min-width="120" align="center" />

        <!-- 客户手机 -->
        <el-table-column prop="customer_mobile" label="客户手机" min-width="130" align="center" />

        <!-- 提现方式 -->
        <el-table-column prop="payment_method" label="提现方式" min-width="100" align="center" />

        <!-- 渠道 -->
        <el-table-column prop="channel" label="渠道" min-width="100" align="center" />

        <!-- 申请金额 -->
        <el-table-column prop="apply_amount" label="申请金额" min-width="100" align="center" />

        <!-- 提现金额 -->
        <el-table-column prop="arrival_amount" label="提现金额" min-width="100" align="center" />

        <!-- 支付凭证 -->
        <el-table-column prop="support_doc" label="支付凭证" min-width="100" align="center" />

        <!-- 银行开户行 -->
        <el-table-column
          prop="bank_account"
          label="银行开户行"
          min-width="150"
          align="center"
          show-overflow-tooltip
        />

        <!-- 银行卡号 -->
        <el-table-column
          prop="bank_card"
          label="银行卡号"
          min-width="180"
          align="center"
          show-overflow-tooltip
        />

        <!-- 支付宝账号 -->
        <el-table-column
          prop="alipay_account"
          label="支付宝账号"
          min-width="150"
          align="center"
          show-overflow-tooltip
        />

        <!-- 申请时间 -->
        <el-table-column prop="apply_time" label="申请时间" min-width="180" align="center" />

        <!-- 状态 -->
        <el-table-column prop="status" label="状态" min-width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === 0" type="warning">待审核</el-tag>
            <el-tag v-else-if="row.status === 1" type="success">已通过</el-tag>
            <el-tag v-else-if="row.status === 2" type="danger">已拒绝</el-tag>
            <el-tag v-else-if="row.status === 3" type="info">已完成</el-tag>
            <span v-else>{{ row.status }}</span>
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-link type="primary" :underline="false" @click="handleView(row)">查看详情</el-link>
          </template>
        </el-table-column>
      </el-table>

      <!-- 总计显示 -->
      <div v-if="totalAmount" class="total-amount">
        {{ totalAmount }}
      </div>

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
import {
  getCustomerTixianListApi,
  type CustomerTixianParams,
  type CustomerTixianItem
} from '@/api/customerTixian'
import { exportExcel } from '@/utils/export'

// 查询参数
const queryParams = reactive<CustomerTixianParams>({
  page: 1,
  limit: 15,
  name: '',
  mobile: '',
  create_time: ''
})

// 时间范围
const createTimeRange = ref<[string, string] | null>(null)

// 监听时间范围变化
watch(createTimeRange, (val) => {
  queryParams.create_time = val ? val.join(' - ') : ''
})

// 表格数据
const tableData = ref<CustomerTixianItem[]>([])
const total = ref(0)
const loading = ref(false)
const totalAmount = ref('')

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const res = await getCustomerTixianListApi(queryParams)
    console.log('客户提现响应:', res)

    // 处理返回数据
    if (res.data && res.data.length > 0) {
      // 检查是否只有总计数据（无数据情况）
      if (res.data.length === 1 && res.data[0].amount) {
        totalAmount.value = res.data[0].amount
        tableData.value = []
        total.value = 0
      } else {
        // 有数据情况，最后一条可能是总计
        const lastItem = res.data[res.data.length - 1]
        if (lastItem.amount && !lastItem.id) {
          // 最后一条是总计
          totalAmount.value = lastItem.amount
          tableData.value = res.data.slice(0, -1)
        } else {
          // 没有总计行
          totalAmount.value = ''
          tableData.value = res.data
        }
        total.value = res.count || 0
      }
    } else {
      tableData.value = []
      total.value = 0
      totalAmount.value = ''
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
  queryParams.name = ''
  queryParams.mobile = ''
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

// 导出
const handleExport = () => {
  if (tableData.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'batch_no', title: '批次号' },
    { key: 'order_no', title: '订单号' },
    { key: 'customer_name', title: '客户姓名' },
    { key: 'customer_mobile', title: '客户手机' },
    { key: 'payment_method', title: '提现方式' },
    { key: 'channel', title: '渠道' },
    { key: 'apply_amount', title: '申请金额' },
    { key: 'arrival_amount', title: '提现金额' },
    { key: 'support_doc', title: '支付凭证' },
    { key: 'bank_account', title: '银行开户行' },
    { key: 'bank_card', title: '银行卡号' },
    { key: 'alipay_account', title: '支付宝账号' },
    { key: 'apply_time', title: '申请时间' },
    {
      key: 'status',
      title: '状态',
      formatter: (value: number | string) => {
        const statusMap: Record<number | string, string> = {
          0: '待审核',
          1: '已通过',
          2: '已拒绝',
          3: '已完成'
        }
        return statusMap[value] || value
      }
    }
  ]

  exportExcel({
    data: tableData.value,
    columns,
    filename: '客户提现列表'
  })
}

// 查看详情
const handleView = (row: CustomerTixianItem) => {
  ElMessage.info(`查看详情 ID: ${row.id}`)
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

  .total-amount {
    margin-top: 15px;
    padding: 10px;
    background-color: #f5f7fa;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    font-weight: bold;
    color: #606266;
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
