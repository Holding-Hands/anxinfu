<template>
  <div class="page-container">
    <el-card class="filter-card" shadow="never">
      <!-- 筛选表单 -->
      <el-form :model="queryParams" class="filter-form">
        <el-row :gutter="20">
          <!-- 状态 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="状态">
              <el-select
                v-model="queryParams.status"
                placeholder="请选择状态"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in ARREARS_STATUS_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 欠款人手机 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="欠款人手机" label-width="100px">
              <el-input
                v-model="queryParams.qkr_user_mobile"
                placeholder="请输入欠款人手机"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <!-- 收款人手机 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="收款人手机" label-width="100px">
              <el-input
                v-model="queryParams.skr_user_mobile"
                placeholder="请输入收款人手机"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <!-- 时间 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="时间" label-width="100px">
              <el-date-picker
                  v-model="timeRange"
                  teleported
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

          <!-- 操作按钮 -->
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
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
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
      >
        <el-table-column prop="id" label="ID" min-width="80" align="center" />

        <!-- 编号 -->
        <el-table-column prop="order_no" label="编号" min-width="150" align="center" />

        <!-- 钱包 -->
        <el-table-column prop="wallet" label="钱包" min-width="100" align="center" />

        <!-- 欠款人 -->
        <el-table-column prop="qkr_user_name" label="欠款人" min-width="120" align="center" />

        <!-- 收款人 -->
        <el-table-column prop="skr_user_name" label="收款人" min-width="120" align="center" />

        <!-- 总金额 -->
        <el-table-column prop="total_amount" label="总金额" min-width="100" align="center" />

        <!-- 期数 -->
        <el-table-column prop="periods" label="期数" min-width="80" align="center" />

        <!-- 物流信息 -->
        <el-table-column prop="logistics_info" label="物流信息" min-width="150" align="center" />

        <!-- 扣款日期 -->
        <el-table-column prop="deduct_date" label="扣款日期" min-width="120" align="center" />

        <!-- 已还 -->
        <el-table-column prop="paid_amount" label="已还" min-width="100" align="center" />

        <!-- 状态 -->
        <el-table-column label="状态" min-width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === 0" type="warning">待确认</el-tag>
            <el-tag v-else-if="row.status === 1" type="success">已确认</el-tag>
            <el-tag v-else-if="row.status === 2" type="info">已退回</el-tag>
            <el-tag v-else-if="row.status === 3" type="success">已结束</el-tag>
            <el-tag v-else-if="row.status === 4" type="danger">已取消</el-tag>
            <el-tag v-else type="info">未知</el-tag>
          </template>
        </el-table-column>

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

        <!-- 操作 -->
        <el-table-column label="操作" min-width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

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
import { Search, Refresh } from '@element-plus/icons-vue'
import { getArrearsListApi, type ArrearsParams, type ArrearsItem } from '@/api/arrears'
import { ARREARS_STATUS_OPTIONS } from '@/constants'

// 查询参数
const queryParams = reactive<ArrearsParams>({
  page: 1,
  limit: 15,
  status: '',
  qkr_user_mobile: '',
  skr_user_mobile: '',
  create_time: ''
})

// 时间范围
const timeRange = ref<[string, string] | null>(null)

// 表格数据
const tableData = ref<ArrearsItem[]>([])
const total = ref(0)
const loading = ref(false)

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
    const res = await getArrearsListApi(queryParams)
    if (res.code === 0) {
      tableData.value = res.data || []
      total.value = res.count || 0
    } else {
      ElMessage.error(res.msg || '获取数据失败')
    }
  } catch (error) {
    console.error('获取账单分期列表失败:', error)
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
  queryParams.status = ''
  queryParams.qkr_user_mobile = ''
  queryParams.skr_user_mobile = ''
  queryParams.create_time = ''
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

// 查看详情
const handleView = (row: ArrearsItem) => {
  ElMessage.info(`查看详情：${row.id}`)
  // TODO: 实现查看详情功能
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
}
</style>
