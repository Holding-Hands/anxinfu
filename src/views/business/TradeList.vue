<template>
  <div class="trade-list-container">
    <!-- 筛选条件 -->
    <el-card shadow="never" class="filter-card">
      <el-form :model="filterForm" label-width="80px" class="filter-form">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="产品">
              <el-select
                v-model="filterForm.platform_id"
                placeholder="请选择平台"
                clearable
                filterable
                @change="handlePlatformChange"
              >
                <el-option
                  v-for="item in platformList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="">
              <el-select
                v-model="filterForm.product_id"
                placeholder="请选择产品"
                clearable
                filterable
                :disabled="!filterForm.platform_id || productList.length === 0"
              >
                <el-option
                  v-for="item in productList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="模式">
              <el-select v-model="filterForm.sys_type" placeholder="全部" clearable>
                <el-option label="全部" value="" />
                <el-option label="1.0模式" value="1" />
                <el-option label="2.0模式" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="代理手机">
              <el-input
                v-model="filterForm.user_mobile"
                placeholder="请输入代理手机号"
                clearable
                @keyup.enter="handleSearch"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="SN">
              <el-input
                v-model="filterForm.sn"
                placeholder="请输入SN"
                clearable
                @keyup.enter="handleSearch"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="交易时间">
              <el-date-picker
                v-model="jiaoyiTimeRange"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="创建时间">
              <el-date-picker
                v-model="createTimeRange"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label=" " class="filter-actions">
              <div class="action-buttons">
                <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
                <el-button :icon="Refresh" @click="handleReset">重置</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card shadow="never" class="table-card">
      <el-table v-loading="loading" :data="tableData" border stripe>
        <el-table-column type="index" label="ID" width="60" align="center" />
        <el-table-column prop="sys_type_name" label="模式" width="100" align="center" />
        <el-table-column prop="order_no" label="订单号" width="220" align="center" />
        <el-table-column prop="productName" label="产品" width="120" align="center" />
        <el-table-column prop="card_type" label="交易类型" width="100" align="center" />
        <el-table-column prop="user_name" label="代理商" width="180" align="center" />
        <el-table-column prop="user_code" label="商户编号" width="120" align="center" />
        <el-table-column prop="merchant_name" label="商户名称" width="120" align="center" />
        <el-table-column prop="merchant_code" label="商户编号" width="180" align="center" />
        <el-table-column prop="sn" label="SN" width="180" align="center" />
        <el-table-column prop="money" label="金额" width="100" align="center" />
        <el-table-column prop="sxf" label="手续费" width="100" align="center" />
        <el-table-column prop="sj_sxf" label="实际手续费" width="100" align="center" />
        <el-table-column label="总分润" width="100" align="center">
          <template #default="{ row }">
            <el-link type="primary" :underline="false" @click="handleShowProfit(row)">
              <span v-html="row.total_pay"></span>
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="所属盟友" width="180" align="center" />
        <el-table-column prop="jiaoyi_time" label="交易时间" width="160" align="center" />
        <el-table-column prop="create_time" label="创建时间" width="160" align="center" />
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.limit"
        :total="pagination.total"
        :page-sizes="[15, 30, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <!-- 分润明细对话框 -->
    <el-dialog draggable
      v-model="profitDialogVisible"
      :title="`交易${currentTradeId}的分润`"
      width="60%"
      destroy-on-close
    >
      <el-table v-loading="profitLoading" :data="profitTableData" border stripe>
        <el-table-column type="index" label="ID" width="60" align="center" />
        <el-table-column label="姓名" width="200" align="center">
          <template #default="{ row }">
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px">
              <el-avatar :size="30" :src="row.user.headimg" />
              <span>{{ row.user.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sn" label="SN" width="180" align="center" />
        <el-table-column prop="pre_tax" label="税前分润" width="100" align="center" />
        <el-table-column prop="profit" label="税后分润" width="100" align="center" />
        <el-table-column prop="remark" label="备注" min-width="150" align="center" />
        <el-table-column prop="create_time" label="时间" width="160" align="center" />
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="profitPagination.page"
        v-model:page-size="profitPagination.limit"
        :total="profitPagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        class="profit-pagination"
        @size-change="handleProfitSizeChange"
        @current-change="handleProfitCurrentChange"
      />

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="profitDialogVisible = false">确定</el-button>
          <el-button @click="profitDialogVisible = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {ElMessage} from 'element-plus'
import {Refresh, Search} from '@element-plus/icons-vue'
import {getProfitListApi, getTradeListApi, type ProfitItem, type TradeItem, type TradeListParams} from '@/api/trade'
import {getChildProductApi} from '@/api/user'
import {PRODUCT_OPTIONS} from '@/constants'

// 筛选表单
const filterForm = reactive({
  platform_id: '',
  product_id: '',
  sys_type: '',
  user_mobile: '',
  sn: ''
})

// 时间范围
const jiaoyiTimeRange = ref<[string, string] | null>(null)
const createTimeRange = ref<[string, string] | null>(null)

// 平台列表
const platformList = ref(PRODUCT_OPTIONS)

// 产品列表
const productList = ref<{ label: string; value: string }[]>([])

// 表格数据
const loading = ref(false)
const tableData = ref<TradeItem[]>([])

// 分页
const pagination = reactive({
  page: 1,
  limit: 15,
  total: 0
})

// 平台改变
const handlePlatformChange = async (value: string | number) => {
  filterForm.product_id = ''
  productList.value = []

  if (value) {
    await getChildProducts(value)
  }
}

// 获取子产品列表
const getChildProducts = async (pid: string | number) => {
  try {
    const res = await getChildProductApi({ pid: Number(pid) })
    if (res.code === 0 && res.data) {
      // 将对象转换为数组
      productList.value = Object.entries(res.data).map(([value, label]) => ({
        label: label as string,
        value: value
      }))
    }
  } catch (error) {
    console.error('获取子产品列表失败:', error)
  }
}

// 分润明细对话框
const profitDialogVisible = ref(false)
const profitLoading = ref(false)
const profitTableData = ref<ProfitItem[]>([])
const currentTradeId = ref(0)
const profitPagination = reactive({
  page: 1,
  limit: 10,
  total: 0
})

// 显示分润明细
const handleShowProfit = (row: TradeItem) => {
  currentTradeId.value = row.id
  profitDialogVisible.value = true
  profitPagination.page = 1
  getProfitList()
}

// 获取分润明细列表
const getProfitList = async () => {
  profitLoading.value = true
  try {
    const res = await getProfitListApi({
      id: currentTradeId.value,
      page: profitPagination.page,
      limit: profitPagination.limit
    })
    if (res.code === 0) {
      profitTableData.value = res.data
      profitPagination.total = Number(res.count)
    } else {
      ElMessage.error(res.msg || '获取分润明细失败')
    }
  } catch (error) {
    console.error('获取分润明细失败:', error)
    ElMessage.error('获取分润明细失败')
  } finally {
    profitLoading.value = false
  }
}

// 分润明细分页大小改变
const handleProfitSizeChange = () => {
  profitPagination.page = 1
  getProfitList()
}

// 分润明细页码改变
const handleProfitCurrentChange = () => {
  getProfitList()
}

// 获取交易流水列表
const getTradeList = async () => {
  loading.value = true
  try {
    const params: TradeListParams = {
      page: pagination.page,
      limit: pagination.limit,
      platform_id: filterForm.platform_id,
      product_id: filterForm.product_id,
      sys_type: filterForm.sys_type,
      user_mobile: filterForm.user_mobile,
      sn: filterForm.sn
    }

    // 处理时间范围
    if (jiaoyiTimeRange.value && jiaoyiTimeRange.value.length === 2) {
      params.jiaoyi_time = `${jiaoyiTimeRange.value[0]} - ${jiaoyiTimeRange.value[1]}`
    }
    if (createTimeRange.value && createTimeRange.value.length === 2) {
      params.create_time = `${createTimeRange.value[0]} - ${createTimeRange.value[1]}`
    }

    const res = await getTradeListApi(params)
    if (res.code === 0) {
      // 过滤掉合计行，只显示正常数据
      tableData.value = res.data.filter((item) => 'id' in item) as TradeItem[]
      pagination.total = res.count
    }
  } catch (error) {
    ElMessage.error('获取交易流水列表失败')
  } finally {
    loading.value = false
  }
}

// 查询
const handleSearch = () => {
  pagination.page = 1
  getTradeList()
}

// 重置
const handleReset = () => {
  filterForm.platform_id = ''
  filterForm.product_id = ''
  filterForm.sys_type = ''
  filterForm.user_mobile = ''
  filterForm.sn = ''
  jiaoyiTimeRange.value = null
  createTimeRange.value = null
  productList.value = []
  handleSearch()
}

// 分页大小改变
const handleSizeChange = () => {
  pagination.page = 1
  getTradeList()
}

// 当前页改变
const handleCurrentChange = () => {
  getTradeList()
}

onMounted(() => {
  getTradeList()
})
</script>

<style scoped lang="scss">
.trade-list-container {
  padding: 20px;

  .filter-card {
    margin-bottom: 20px;

    .filter-form {
      :deep(.el-form-item) {
        margin-bottom: 16px;
        width: 100%;

        .el-input,
        .el-select,
        .el-date-editor {
          width: 100%;
        }
      }

      .filter-actions {
        margin-bottom: 0;

        :deep(.el-form-item__content) {
          width: 100%;
        }

        .action-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          flex-wrap: wrap;
          width: 100%;
        }
      }
    }
  }

  .table-card {
    .pagination {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }

  // 分润明细对话框分页样式
  .profit-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  // 对话框底部按钮居中
  .dialog-footer {
    display: flex;
    justify-content: center;
    gap: 12px;
  }
}
</style>
