<template>
  <div class="page-container">
    <el-card class="filter-card" shadow="never">
      <!-- 筛选表单 -->
      <el-form :model="queryParams" class="filter-form">
        <el-row :gutter="20">
          <!-- 代理产品 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="代理产品" label-width="80px">
              <el-select
                v-model="queryParams.platform_id"
                placeholder="请选择代理产品"
                clearable
                filterable
                style="width: 100%"
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

          <!-- 产品 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="产品" label-width="80px">
              <el-select
                v-model="queryParams.product_id"
                placeholder="请选择产品"
                clearable
                filterable
                style="width: 100%"
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

          <!-- 代理名称 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="代理名称" label-width="80px">
              <el-input
                v-model="queryParams.uName"
                placeholder="请输入代理名称"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <!-- 处理状态 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="处理状态" label-width="80px">
              <el-select
                v-model="queryParams.status"
                placeholder="请选择处理状态"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in APPLY_RATE_STATUS_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 操作按钮 -->
          <el-col :xs="24" :sm="18" :md="18" :lg="18">
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

        <!-- 代理名称 -->
        <el-table-column prop="agent_name" label="代理名称" min-width="120" align="center" />

        <!-- 产品名称 -->
        <el-table-column prop="product_name" label="产品名称" min-width="120" align="center" />

        <!-- SN -->
        <el-table-column
          prop="sn"
          label="SN"
          min-width="150"
          align="center"
          show-overflow-tooltip
        />

        <!-- 申请费率 -->
        <el-table-column prop="apply_rate" label="申请费率" min-width="100" align="center" />

        <!-- 当前费率 -->
        <el-table-column prop="current_rate" label="当前费率" min-width="100" align="center" />

        <!-- 状态 -->
        <el-table-column label="状态" min-width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === 0" type="warning">处理中</el-tag>
            <el-tag v-else-if="row.status === 1" type="success">已处理</el-tag>
            <el-tag v-else-if="row.status === 2" type="danger">已驳回</el-tag>
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

        <!-- 申请时间 -->
        <el-table-column prop="apply_time" label="申请时间" min-width="180" align="center" />

        <!-- 处理时间 -->
        <el-table-column prop="handle_time" label="处理时间" min-width="180" align="center" />

        <!-- 操作 -->
        <el-table-column prop="operator" label="操作" min-width="100" align="center" />
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
import { Search, Refresh, Download } from '@element-plus/icons-vue'
import { getApplyRateListApi, type ApplyRateParams, type ApplyRateItem } from '@/api/applyRate'
import { getChildProductApi } from '@/api/user'
import {
  SYS_TYPE_OPTIONS,
  PRODUCT_OPTIONS,
  APPLY_RATE_STATUS_OPTIONS,
  APPLY_RATE_STATUS_MAP
} from '@/constants'
import { exportExcel } from '@/utils/export'

// 查询参数
const queryParams = reactive<ApplyRateParams>({
  page: 1,
  limit: 15,
  platform_id: '',
  product_id: '',
  sys_type: '',
  uName: '',
  status: 'all'
})

// 表格数据
const tableData = ref<ApplyRateItem[]>([])
const total = ref(0)
const loading = ref(false)

// 子产品选项
const childProductOptions = ref<Array<{ label: string; value: number }>>([])

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

// 处理代理产品变化
const handlePlatformChange = async (value: number | string) => {
  queryParams.product_id = ''
  await getChildProducts(value)
}

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const res = await getApplyRateListApi(queryParams)
    if (res.code === 0) {
      tableData.value = res.data || []
      total.value = res.count || 0
    } else {
      ElMessage.error(res.msg || '获取数据失败')
    }
  } catch (error) {
    console.error('获取费率申请列表失败:', error)
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
  queryParams.platform_id = ''
  queryParams.product_id = ''
  queryParams.sys_type = ''
  queryParams.uName = ''
  queryParams.status = 'all'
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
      { key: 'agent_name', title: '代理名称' },
      { key: 'product_name', title: '产品名称' },
      { key: 'sn', title: 'SN' },
      { key: 'apply_rate', title: '申请费率' },
      { key: 'current_rate', title: '当前费率' },
      {
        key: 'status',
        title: '状态',
        formatter: (value: number) => APPLY_RATE_STATUS_MAP[value] || '未知'
      },
      { key: 'remark', title: '备注' },
      { key: 'apply_time', title: '申请时间' },
      { key: 'handle_time', title: '处理时间' },
      { key: 'operator', title: '操作' }
    ]

    exportExcel({
      data: tableData.value,
      columns: headers,
      filename: '费率申请列表'
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
}
</style>
