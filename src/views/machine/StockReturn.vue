<template>
  <div class="page-container">
    <el-card class="filter-card" shadow="never">
      <!-- 筛选表单 -->
      <el-form :model="queryParams" label-width="100px" class="filter-form">
        <el-row :gutter="20">
          <!-- 代理产品 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="代理产品">
              <el-select
                v-model="queryParams.platform_id"
                placeholder="请选择代理产品"
                clearable
                filterable
                @change="handlePlatformChange"
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

          <!-- 子产品 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="产品">
              <el-select
                v-model="queryParams.product_id"
                placeholder="请选择产品"
                clearable
                filterable
                :disabled="!queryParams.platform_id || childProductOptions.length === 0"
              >
                <el-option
                  v-for="item in childProductOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 入库时间 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="入库时间">
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

          <!-- 起始SN -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="起始SN">
              <el-input
                v-model="queryParams.sn_begin"
                placeholder="请输入起始SN"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <!-- 结束SN -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="结束SN">
              <el-input
                v-model="queryParams.sn_end"
                placeholder="请输入结束SN"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <!-- 操作按钮 -->
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-form-item label=" " class="filter-actions">
              <div class="action-buttons">
                <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
                <el-button :icon="Refresh" @click="handleReset">重置</el-button>
                <!-- <el-button type="primary" @click="handleOpenReturnDialog">机具退货</el-button> -->
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="id" label="ID" width="80" align="center" sortable />
        <el-table-column prop="sn" label="SN" min-width="180" align="center" />
        <el-table-column prop="pro_name" label="产品名称" min-width="120" align="center" />
        <el-table-column prop="create_time" label="入库时间" min-width="180" align="center" />
        <el-table-column prop="operator" label="操作员" min-width="120" align="center" />
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.limit"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 机具退货对话框 -->
    <el-dialog
      v-model="returnDialogVisible"
      title="机具退货"
      width="95%"
      :close-on-click-modal="false"
      top="5vh"
    >
      <div class="return-dialog-content">
        <el-form label-width="100px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="产品名称">
                <el-select
                  v-model="returnForm.product_id"
                  placeholder="请选择产品"
                  clearable
                  filterable
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in allProductOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="入库时间">
                <el-date-picker
                  v-model="returnForm.create_time"
                  type="datetimerange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="起始SN">
                <el-input v-model="returnForm.sn_begin" placeholder="请输入起始SN" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束SN">
                <el-input v-model="returnForm.sn_end" placeholder="请输入结束SN" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label=" ">
                <el-button type="primary" @click="handleSearchReturn">筛选机具</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div class="return-tables">
          <div class="table-section">
            <div class="section-header">
              <span>待选择区({{ waitingList.length }}个)</span>
              <el-button type="success" size="small" @click="handleSelectAll">全选</el-button>
            </div>
            <el-table
              :data="waitingList"
              height="300"
              border
              style="width: 100%"
              @selection-change="handleWaitingSelectionChange"
            >
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column prop="sn" label="SN" min-width="150" align="center" />
              <el-table-column prop="pro_name" label="产品名称" min-width="120" align="center" />
              <el-table-column prop="create_time" label="入库时间" min-width="150" align="center" />
              <el-table-column label="操作" width="80" align="center">
                <template #default="{ row }">
                  <el-link type="primary" :underline="false" @click="handleMoveToSelected(row)">
                    操作
                  </el-link>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="table-section">
            <div class="section-header">
              <span>已选区({{ selectedList.length }}个)</span>
              <el-button type="success" size="small" @click="handleConfirmReturn">退货</el-button>
            </div>
            <el-table :data="selectedList" height="300" border style="width: 100%">
              <el-table-column prop="sn" label="SN" min-width="150" align="center" />
              <el-table-column prop="pro_name" label="产品名称" min-width="120" align="center" />
              <el-table-column prop="create_time" label="入库时间" min-width="150" align="center" />
              <el-table-column label="操作" width="80" align="center">
                <template #default="{ row }">
                  <el-link type="primary" :underline="false" @click="handleRemoveFromSelected(row)">
                    操作
                  </el-link>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import {
  getStockReturnListApi,
  type StockReturnListParams,
  type StockReturnListItem
} from '@/api/stockReturn'
import { getChildProductApi } from '@/api/user'
import { PRODUCT_OPTIONS } from '@/constants'

// 查询参数
const queryParams = reactive<StockReturnListParams & { platform_id?: number | string }>({
  page: 1,
  limit: 20,
  platform_id: '',
  product_id: '',
  create_time: '',
  sn_begin: '',
  sn_end: ''
})

// 时间范围
const createTimeRange = ref<[string, string] | null>(null)

// 监听时间范围变化
watch(createTimeRange, (val) => {
  queryParams.create_time = val ? val.join(' - ') : ''
})

// 表格数据
const tableData = ref<StockReturnListItem[]>([])
const total = ref(0)
const loading = ref(false)
const selectedRows = ref<StockReturnListItem[]>([])

// 子产品选项
const childProductOptions = ref<Array<{ label: string; value: number }>>([])

// 所有产品选项（用于对话框）
const allProductOptions = ref<Array<{ label: string; value: number }>>([])

// 机具退货对话框
const returnDialogVisible = ref(false)
const returnForm = reactive({
  product_id: '',
  create_time: null as [string, string] | null,
  sn_begin: '',
  sn_end: ''
})

// 待选择列表和已选列表
const waitingList = ref<StockReturnListItem[]>([])
const selectedList = ref<StockReturnListItem[]>([])
const waitingSelection = ref<StockReturnListItem[]>([])

// 获取子产品列表
const getChildProducts = async (platformId: number | string) => {
  if (!platformId) {
    childProductOptions.value = []
    return
  }

  try {
    const res = await getChildProductApi({ pid: Number(platformId) })
    const options: Array<{ label: string; value: number }> = []
    if (res.data) {
      Object.entries(res.data).forEach(([key, value]) => {
        options.push({
          value: Number(key),
          label: value as string
        })
      })
    }
    childProductOptions.value = options
  } catch (error) {
    console.error('获取子产品失败:', error)
    childProductOptions.value = []
  }
}

// 获取所有产品（用于对话框）
const getAllProducts = async () => {
  const allOptions: Array<{ label: string; value: number }> = []
  for (const platform of PRODUCT_OPTIONS) {
    try {
      const res = await getChildProductApi({ pid: Number(platform.value) })
      if (res.data) {
        Object.entries(res.data).forEach(([key, value]) => {
          allOptions.push({
            value: Number(key),
            label: value as string
          })
        })
      }
    } catch (error) {
      console.error('获取产品失败:', error)
    }
  }
  allProductOptions.value = allOptions
}

// 处理产品（平台）变化
const handlePlatformChange = async (value: number | string) => {
  queryParams.product_id = ''
  childProductOptions.value = []

  if (value) {
    await getChildProducts(value)
  }
}

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const res = await getStockReturnListApi(queryParams)
    console.log('机具退货列表响应:', res)
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
  queryParams.limit = 20
  queryParams.platform_id = ''
  queryParams.product_id = ''
  queryParams.sn_begin = ''
  queryParams.sn_end = ''
  createTimeRange.value = null
  childProductOptions.value = []
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

// 表格选择变化
const handleSelectionChange = (selection: StockReturnListItem[]) => {
  selectedRows.value = selection
}

// 打开退货对话框
// const handleOpenReturnDialog = () => {
//   returnDialogVisible.value = true
//   waitingList.value = []
//   selectedList.value = []
//   returnForm.product_id = ''
//   returnForm.create_time = null
//   returnForm.sn_begin = ''
//   returnForm.sn_end = ''
// }

// 筛选机具
const handleSearchReturn = async () => {
  try {
    const params: StockReturnListParams = {
      page: 1,
      limit: 1000,
      product_id: returnForm.product_id,
      create_time: returnForm.create_time ? returnForm.create_time.join(' - ') : '',
      sn_begin: returnForm.sn_begin,
      sn_end: returnForm.sn_end
    }
    const res = await getStockReturnListApi(params)
    waitingList.value = res.data || []
    ElMessage.success('筛选成功')
  } catch (error) {
    console.error('筛选失败:', error)
    ElMessage.error('筛选失败，请稍后重试')
  }
}

// 待选区选择变化
const handleWaitingSelectionChange = (selection: StockReturnListItem[]) => {
  waitingSelection.value = selection
}

// 全选
const handleSelectAll = () => {
  selectedList.value = [...selectedList.value, ...waitingList.value]
  waitingList.value = []
  ElMessage.success('已全部移至已选区')
}

// 移动到已选区
const handleMoveToSelected = (row: StockReturnListItem) => {
  const index = waitingList.value.findIndex((item) => item.id === row.id)
  if (index > -1) {
    waitingList.value.splice(index, 1)
    selectedList.value.push(row)
  }
}

// 从已选区移除
const handleRemoveFromSelected = (row: StockReturnListItem) => {
  const index = selectedList.value.findIndex((item) => item.id === row.id)
  if (index > -1) {
    selectedList.value.splice(index, 1)
    waitingList.value.push(row)
  }
}

// 确认退货
const handleConfirmReturn = () => {
  if (selectedList.value.length === 0) {
    ElMessage.warning('请先选择要退货的机具')
    return
  }
  ElMessage.success(`已选择 ${selectedList.value.length} 台机具进行退货`)
  // TODO: 调用退货接口
  returnDialogVisible.value = false
}

onMounted(() => {
  getList()
  getAllProducts()
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
    .filter-actions {
      :deep(.el-form-item__content) {
        justify-content: flex-end;
      }

      .action-buttons {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: flex-end;
      }
    }
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .return-dialog-content {
    .return-tables {
      display: flex;
      gap: 20px;
      margin-top: 20px;

      .table-section {
        flex: 1;
        min-width: 0;

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background: #f5f7fa;
          border: 1px solid #dcdfe6;
          border-bottom: none;
          font-weight: bold;
        }

        :deep(.el-table) {
          .el-table__body-wrapper {
            overflow-x: auto;
          }
        }
      }
    }
  }
}

:deep(.el-dialog__body) {
  max-height: 70vh;
  overflow-y: auto;
}
</style>
