<template>
  <div class="page-container">
    <el-card class="filter-card" shadow="never">
      <!-- 筛选表单 -->
      <el-form :model="queryParams" class="filter-form">
        <el-row :gutter="20">
          <!-- 用户名 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="用户名">
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
            <el-form-item label="手机号">
              <el-input
                v-model="queryParams.mobile"
                placeholder="请输入手机号"
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

          <!-- 资金类型 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="资金类型">
              <el-select v-model="queryParams.wallet" placeholder="全部" clearable>
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

        <!-- 订单号 -->
        <el-table-column
          prop="oid"
          label="订单号"
          min-width="180"
          align="center"
          show-overflow-tooltip
        />

        <!-- 用户 -->
        <el-table-column prop="user_name" label="用户" min-width="150" align="center">
          <template #default="{ row }">
            <div v-html="row.user_name"></div>
          </template>
        </el-table-column>

        <!-- 申请金额 -->
        <el-table-column prop="amount" label="申请金额" min-width="100" align="center" />

        <!-- 提现金额 -->
        <el-table-column prop="money" label="提现金额" min-width="100" align="center" />

        <!-- 资金类型 -->
        <el-table-column prop="type" label="资金类型" min-width="120" align="center" />

        <!-- 提现类型 -->
        <el-table-column prop="pay_type" label="提现类型" min-width="100" align="center" />

        <!-- 渠道 -->
        <el-table-column prop="bank_type_name" label="渠道" min-width="100" align="center">
          <template #default="{ row }">
            <div v-html="row.bank_type_name"></div>
          </template>
        </el-table-column>

        <!-- 外名 -->
        <el-table-column prop="name" label="外名" min-width="120" align="center" />

        <!-- 支付宝账号 -->
        <el-table-column prop="alipayMobile" label="支付宝账号" min-width="130" align="center" />

        <!-- 银行开户行 -->
        <el-table-column label="银行开户行" min-width="150" align="center" show-overflow-tooltip>
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

        <!-- 操作 -->
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleAudit(row)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 总计显示 -->
      <div v-if="totalInfo.amount || totalInfo.money" class="total-amount">
        <span v-if="totalInfo.amount">{{ totalInfo.amount }}</span>
        <span v-if="totalInfo.money" style="margin-left: 20px">{{ totalInfo.money }}</span>
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

    <!-- 审核弹框 -->
    <el-dialog
      v-model="auditDialogVisible"
      title="审核提现申请"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form :model="auditForm" label-width="80px">
        <!-- 审核选项 -->
        <el-form-item label="审核">
          <el-radio-group v-model="auditForm.status">
            <el-radio :label="2">通过</el-radio>
            <el-radio :label="3">不通过</el-radio>
            <el-radio :label="4">强制通过（已经成功转账选择这个）</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 备注 -->
        <el-form-item label="备注">
          <el-input v-model="auditForm.remark" type="textarea" :rows="4" placeholder="请输入" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="auditDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmAudit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh, Download } from '@element-plus/icons-vue'
import {
  getTixianOrderListApi,
  auditTixianOrderApi,
  type TixianOrderParams,
  type TixianOrderItem,
  type AuditParams
} from '@/api/tixianOrder'
import { WALLET_TYPE_OPTIONS } from '@/constants'
import { exportExcel } from '@/utils/export'

// 查询参数
const queryParams = reactive<TixianOrderParams>({
  page: 1,
  limit: 15,
  name: '',
  mobile: '',
  create_time: '',
  wallet: 0
})

// 时间范围
const createTimeRange = ref<[string, string] | null>(null)

// 监听时间范围变化
watch(createTimeRange, (val) => {
  queryParams.create_time = val ? val.join(' - ') : ''
})

// 表格数据
const tableData = ref<TixianOrderItem[]>([])
const total = ref(0)
const loading = ref(false)
const totalInfo = ref({ amount: '', money: '' })

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const res = await getTixianOrderListApi(queryParams)
    console.log('提现审核响应:', res)

    // 处理返回数据
    if (res.data && res.data.length > 0) {
      // 检查最后一条是否是总计
      const lastItem = res.data[res.data.length - 1]
      if (lastItem.amount && lastItem.amount.includes('总计')) {
        // 最后一条是总计
        totalInfo.value = {
          amount: lastItem.amount || '',
          money: lastItem.money || ''
        }
        tableData.value = res.data.slice(0, -1)
      } else {
        // 没有总计行
        totalInfo.value = { amount: '', money: '' }
        tableData.value = res.data
      }
      total.value = res.count || 0
    } else {
      tableData.value = []
      total.value = 0
      totalInfo.value = { amount: '', money: '' }
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
  queryParams.wallet = 0
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
    { key: 'oid', title: '订单号' },
    {
      key: 'user_name',
      title: '用户',
      formatter: (value: string) => {
        const div = document.createElement('div')
        div.innerHTML = value || ''
        return div.textContent || div.innerText || ''
      }
    },
    { key: 'amount', title: '申请金额' },
    { key: 'money', title: '提现金额' },
    { key: 'type', title: '资金类型' },
    { key: 'pay_type', title: '提现类型' },
    {
      key: 'bank_type_name',
      title: '渠道',
      formatter: (value: string) => {
        const div = document.createElement('div')
        div.innerHTML = value || ''
        return div.textContent || div.innerText || ''
      }
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
    columns,
    filename: '提现审核列表'
  })
}

// 审核弹框
const auditDialogVisible = ref(false)
const auditForm = reactive<AuditParams>({
  id: 0,
  status: 2,
  remark: ''
})

// 打开审核弹框
const handleAudit = (row: TixianOrderItem) => {
  auditForm.id = row.id
  auditForm.status = 2
  auditForm.remark = ''
  auditDialogVisible.value = true
}

// 关闭弹框
const handleDialogClose = () => {
  auditForm.id = 0
  auditForm.status = 2
  auditForm.remark = ''
}

// 确认审核
const handleConfirmAudit = async () => {
  try {
    const res = await auditTixianOrderApi(auditForm)
    if (res.code === 1) {
      ElMessage.success(res.msg || '操作成功')
      auditDialogVisible.value = false
      // 重新查询列表
      getList()
    } else {
      ElMessage.error(res.msg || '操作失败')
    }
  } catch (error) {
    console.error('审核失败:', error)
    ElMessage.error('审核失败，请稍后重试')
  }
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
