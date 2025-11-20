<template>
  <div class="page-container">
    <el-card class="filter-card" shadow="never">
      <!-- 筛选表单 -->
      <el-form :model="queryParams" label-width="120px" class="filter-form">
        <el-row :gutter="20">
          <!-- 申请人手机 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="申请人手机">
              <el-input
                v-model="queryParams.sq_mobile"
                placeholder="请输入申请人手机"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <!-- 被申请人手机 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="被申请人手机">
              <el-input
                v-model="queryParams.dh_mobile"
                placeholder="请输入被申请人手机"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <!-- 订单状态 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="订单状态">
              <el-select v-model="queryParams.status" placeholder="全部" clearable>
                <el-option
                  v-for="item in COIN_ORDER_STATUS_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 发货状态 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="发货状态">
              <el-select v-model="queryParams.ship_status" placeholder="全部" clearable>
                <el-option
                  v-for="item in SHIP_STATUS_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 创建时间 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="创建时间">
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
          <el-col :xs="24" :sm="24" :md="12" :lg="18">
            <el-form-item label="" class="button-form-item">
              <div class="action-buttons">
                <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
                <el-button :icon="Refresh" @click="handleReset">重置</el-button>
                <el-button type="success" @click="handleExport">导出数据</el-button>
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

        <!-- 订单号 -->
        <el-table-column
          prop="order_code"
          label="订单号"
          min-width="180"
          align="center"
          show-overflow-tooltip
        />

        <!-- 商品名称 -->
        <el-table-column prop="goods_name" label="商品名称" min-width="150" align="center" />

        <!-- 积分数量 -->
        <el-table-column prop="coin_num" label="积分数量" min-width="100" align="center" />

        <!-- 申请人姓名 -->
        <el-table-column prop="sq_user_name" label="申请人姓名" min-width="120" align="center" />

        <!-- 申请人手机 -->
        <el-table-column prop="sq_mobile" label="申请人手机" min-width="130" align="center" />

        <!-- 被申请人姓名 -->
        <el-table-column prop="dh_user_name" label="被申请人姓名" min-width="120" align="center" />

        <!-- 被申请人手机 -->
        <el-table-column prop="dh_mobile" label="被申请人手机" min-width="130" align="center" />

        <!-- 订单状态 -->
        <el-table-column prop="status" label="订单状态" min-width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === 0" type="warning">申请中</el-tag>
            <el-tag v-else-if="row.status === 1" type="success">已兑换</el-tag>
            <el-tag v-else-if="row.status === 2" type="info">已撤销</el-tag>
            <el-tag v-else>未知</el-tag>
          </template>
        </el-table-column>

        <!-- 发货状态 -->
        <el-table-column prop="ship_status" label="发货状态" min-width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.ship_status === 0" type="warning">未发货</el-tag>
            <el-tag v-else-if="row.ship_status === 1" type="success">已发货</el-tag>
            <el-tag v-else>未知</el-tag>
          </template>
        </el-table-column>

        <!-- 快递公司 -->
        <el-table-column prop="express_company" label="快递公司" min-width="120" align="center" />

        <!-- 快递单号 -->
        <el-table-column
          prop="express_code"
          label="快递单号"
          min-width="150"
          align="center"
          show-overflow-tooltip
        />

        <!-- 创建时间 -->
        <el-table-column prop="create_time" label="创建时间" min-width="180" align="center" />

        <!-- 更新时间 -->
        <el-table-column prop="update_time" label="更新时间" min-width="180" align="center" />

        <!-- 操作 -->
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-link type="primary" :underline="false" @click="handleView(row)">查看详情</el-link>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { getCoinOrderListApi, type CoinOrderParams, type CoinOrderItem } from '@/api/coinOrder'
import {
  COIN_ORDER_STATUS_OPTIONS,
  SHIP_STATUS_OPTIONS,
  COIN_ORDER_STATUS_MAP,
  SHIP_STATUS_MAP
} from '@/constants'
import { exportExcel } from '@/utils/export'

// 查询参数
const queryParams = reactive<CoinOrderParams>({
  page: 1,
  limit: 15,
  sq_mobile: '',
  dh_mobile: '',
  status: '',
  ship_status: '',
  create_time: ''
})

// 时间范围
const createTimeRange = ref<[string, string] | null>(null)

// 监听时间范围变化
watch(createTimeRange, (val) => {
  queryParams.create_time = val ? val.join(' - ') : ''
})

// 表格数据
const tableData = ref<CoinOrderItem[]>([])
const total = ref(0)
const loading = ref(false)

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const res = await getCoinOrderListApi(queryParams)
    console.log('积分订单响应:', res)
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
  queryParams.sq_mobile = ''
  queryParams.dh_mobile = ''
  queryParams.status = ''
  queryParams.ship_status = ''
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
    { key: 'order_code', title: '订单号' },
    { key: 'goods_name', title: '商品名称' },
    { key: 'coin_num', title: '积分数量' },
    { key: 'sq_user_name', title: '申请人姓名' },
    { key: 'sq_mobile', title: '申请人手机' },
    { key: 'dh_user_name', title: '被申请人姓名' },
    { key: 'dh_mobile', title: '被申请人手机' },
    {
      key: 'status',
      title: '订单状态',
      formatter: (value: number) => COIN_ORDER_STATUS_MAP[value] || '未知'
    },
    {
      key: 'ship_status',
      title: '发货状态',
      formatter: (value: number) => SHIP_STATUS_MAP[value] || '未知'
    },
    { key: 'express_company', title: '快递公司' },
    { key: 'express_code', title: '快递单号' },
    { key: 'create_time', title: '创建时间' },
    { key: 'update_time', title: '更新时间' }
  ]

  exportExcel({
    data: tableData.value,
    columns,
    filename: '积分订单列表'
  })
}

// 查看详情
const handleView = (row: CoinOrderItem) => {
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

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
