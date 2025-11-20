<template>
  <div class="page-container">
    <el-card class="filter-card" shadow="never">
      <!-- 筛选表单 -->
      <el-form :model="queryParams" class="filter-form">
        <el-row :gutter="20">
          <!-- 产品 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="产品">
              <el-select v-model="queryParams.product_id" placeholder="请选择" clearable filterable>
                <el-option
                  v-for="item in PRODUCT_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 划拨时间 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="划拨时间">
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

          <!-- SN -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="SN">
              <el-input
                v-model="queryParams.sn_str"
                placeholder="请输入SN"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <!-- 操作按钮 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
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

        <!-- 模式 -->
        <el-table-column prop="sys_type_name" label="模式" min-width="100" align="center" />

        <!-- 产品名称 -->
        <el-table-column prop="product_name" label="产品名称" min-width="120" align="center" />

        <!-- 数量 -->
        <el-table-column prop="nums" label="数量" min-width="80" align="center" />

        <!-- SN(串号) -->
        <el-table-column
          prop="sn_str"
          label="SN(串号)"
          min-width="200"
          align="center"
          show-overflow-tooltip
        />

        <!-- 下发人 -->
        <el-table-column prop="from_user_name" label="下发人" min-width="150" align="center">
          <template #default="{ row }">
            <div v-html="row.from_user_name"></div>
          </template>
        </el-table-column>

        <!-- 接收人 -->
        <el-table-column prop="to_user_name" label="接收人" min-width="120" align="center" />

        <!-- 订单号 -->
        <el-table-column prop="order_code" label="订单号" min-width="180" align="center">
          <template #default="{ row }">
            <div v-html="row.order_code"></div>
          </template>
        </el-table-column>

        <!-- 下发时间 -->
        <el-table-column prop="create_time" label="下发时间" min-width="180" align="center" />

        <!-- 操作人 (ID) -->
        <el-table-column prop="operator" label="操作人 (ID)" min-width="150" align="center">
          <template #default="{ row }">
            {{ row.operator || '--' }}
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-link type="primary" :underline="false" @click="handleView(row)">查看</el-link>
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 查看详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="划拨记录详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="ID">{{ currentRow?.id }}</el-descriptions-item>
        <el-descriptions-item label="模式">{{ currentRow?.sys_type_name }}</el-descriptions-item>
        <el-descriptions-item label="产品名称">{{ currentRow?.product_name }}</el-descriptions-item>
        <el-descriptions-item label="数量">{{ currentRow?.nums }}</el-descriptions-item>
        <el-descriptions-item label="下发人" :span="2">
          <div v-html="currentRow?.from_user_name"></div>
        </el-descriptions-item>
        <el-descriptions-item label="接收人">{{ currentRow?.to_user_name }}</el-descriptions-item>
        <el-descriptions-item label="操作人">
          {{ currentRow?.operator || '--' }}
        </el-descriptions-item>
        <el-descriptions-item label="订单号" :span="2">
          <div v-html="currentRow?.order_code"></div>
        </el-descriptions-item>
        <el-descriptions-item label="下发时间" :span="2">
          {{ currentRow?.create_time }}
        </el-descriptions-item>
        <el-descriptions-item label="SN(串号)" :span="2">
          <div style="word-break: break-all">{{ currentRow?.sn_str }}</div>
        </el-descriptions-item>
      </el-descriptions>

      <!-- 下发人详细信息 -->
      <el-divider content-position="left">下发人详细信息</el-divider>
      <el-descriptions v-if="currentRow?.from" :column="2" border>
        <el-descriptions-item label="姓名">{{ currentRow.from.name }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ currentRow.from.mobile }}</el-descriptions-item>
        <el-descriptions-item label="用户类型">
          {{ currentRow.from.user_type }}
        </el-descriptions-item>
        <el-descriptions-item label="用户编码">
          {{ currentRow.from.user_code }}
        </el-descriptions-item>
        <el-descriptions-item label="支付宝账号">{{ currentRow.from.alipay }}</el-descriptions-item>
        <el-descriptions-item label="支付宝姓名">
          {{ currentRow.from.aliypayName }}
        </el-descriptions-item>
        <el-descriptions-item label="钱包1">{{ currentRow.from.wallet1 }}</el-descriptions-item>
        <el-descriptions-item label="钱包2">{{ currentRow.from.wallet2 }}</el-descriptions-item>
        <el-descriptions-item label="钱包3">{{ currentRow.from.wallet3 }}</el-descriptions-item>
        <el-descriptions-item label="累计钱包">
          {{ currentRow.from.leiji_wallet }}
        </el-descriptions-item>
        <el-descriptions-item label="身份证号" :span="2">
          {{ currentRow.from.ids_num }}
        </el-descriptions-item>
        <el-descriptions-item label="银行名称">
          {{ currentRow.from.bank_name }}
        </el-descriptions-item>
        <el-descriptions-item label="银行卡号">
          {{ currentRow.from.bank_code }}
        </el-descriptions-item>
        <el-descriptions-item label="地址" :span="2">
          {{ currentRow.from.province }} {{ currentRow.from.city }} {{ currentRow.from.county }}
        </el-descriptions-item>
        <el-descriptions-item label="身份证地址" :span="2">
          {{ currentRow.from.idcard_address }}
        </el-descriptions-item>
        <el-descriptions-item label="身份证有效期" :span="2">
          {{ currentRow.from.idcard_start_time }} 至 {{ currentRow.from.idcard_end_time }}
        </el-descriptions-item>
      </el-descriptions>
      <el-empty v-else description="无下发人详细信息" :image-size="100" />

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { getTransferLogListApi, type TransferLogParams, type TransferLogItem } from '@/api/transfer'
import { PRODUCT_OPTIONS } from '@/constants'

// 查询参数
const queryParams = reactive<TransferLogParams>({
  page: 1,
  limit: 50,
  product_id: '',
  create_time: '',
  sn_str: ''
})

// 时间范围
const createTimeRange = ref<[string, string] | null>(null)

// 监听时间范围变化
watch(createTimeRange, (val) => {
  queryParams.create_time = val ? val.join(' - ') : ''
})

// 表格数据
const tableData = ref<TransferLogItem[]>([])
const total = ref(0)
const loading = ref(false)

// 详情对话框
const detailDialogVisible = ref(false)
const currentRow = ref<TransferLogItem | null>(null)

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const res = await getTransferLogListApi(queryParams)
    console.log('划拨记录响应:', res)
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
  queryParams.limit = 50
  queryParams.product_id = ''
  queryParams.sn_str = ''
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

// 查看
const handleView = (row: TransferLogItem) => {
  currentRow.value = row
  detailDialogVisible.value = true
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
