<template>
  <div class="page-container">
    <el-card class="filter-card" shadow="never">
      <!-- 筛选表单 -->
      <el-form :model="queryParams" label-width="80px" class="filter-form">
        <el-row :gutter="20">
          <!-- 代理产品 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="代理产品">
              <el-select
                v-model="queryParams.platform_id"
                placeholder="请选择"
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
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="产品">
              <el-select
                v-model="queryParams.product_id"
                placeholder="请选择"
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

          <!-- 模式 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="模式">
              <el-select v-model="queryParams.sys_type" placeholder="全部" clearable>
                <el-option label="全部" value="" />
                <el-option label="1.0模式" :value="1" />
                <el-option label="2.0模式" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- SN -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="sn">
              <el-input
                v-model="queryParams.sn"
                placeholder="请输入sn"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <!-- 状态 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="状态">
              <el-select v-model="queryParams.status" placeholder="全部" clearable>
                <el-option label="全部" value="" />
                <el-option label="未划拨" :value="1" />
                <el-option label="已划拨" :value="2" />
                <el-option label="已绑定" :value="3" />
                <el-option label="已激活" :value="4" />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 入库时间 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
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

          <!-- 操作按钮 -->
          <el-col :xs="24" :sm="24" :md="12" :lg="12">
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

        <!-- 模式 -->
        <el-table-column prop="sys_type_name" label="模式" min-width="100" align="center" />

        <!-- 产品名称 -->
        <el-table-column prop="product_name" label="产品名称" min-width="120" align="center" />

        <!-- SN -->
        <el-table-column
          prop="sn"
          label="SN"
          min-width="180"
          align="center"
          show-overflow-tooltip
        />

        <!-- 用户 -->
        <el-table-column prop="username" label="用户" min-width="150" align="center">
          <template #default="{ row }">
            <div v-html="row.username"></div>
          </template>
        </el-table-column>

        <!-- 押金 -->
        <el-table-column prop="yajin_money" label="押金" min-width="100" align="center" />

        <!-- 流量费 -->
        <el-table-column prop="sim_money" label="流量费" min-width="100" align="center" />

        <!-- 扣款金额 -->
        <el-table-column prop="kouKuan_money" label="扣款金额" min-width="100" align="center" />

        <!-- 状态 -->
        <el-table-column prop="status" label="状态" min-width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === 1" type="info">未划拨</el-tag>
            <el-tag v-else-if="row.status === 2" type="warning">已划拨</el-tag>
            <el-tag v-else-if="row.status === 3" type="primary">已绑定</el-tag>
            <el-tag v-else-if="row.status === 4" type="success">已激活</el-tag>
            <el-tag v-else>未知</el-tag>
          </template>
        </el-table-column>

        <!-- 激活时间 -->
        <el-table-column prop="merchant_time" label="激活时间" min-width="180" align="center" />

        <!-- 扣款时间 -->
        <el-table-column prop="kouKuan_time" label="扣款时间" min-width="180" align="center" />

        <!-- 入库时间 -->
        <el-table-column prop="create_time" label="入库时间" min-width="180" align="center" />

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
import {
  getWeijihuoKouKuan2ListApi,
  type WeijihuoKouKuan2Params,
  type WeijihuoKouKuan2Item
} from '@/api/weijihuoKouKuan2'
import { getChildProductApi } from '@/api/user'
import { PRODUCT_OPTIONS } from '@/constants'
import { exportExcel } from '@/utils/export'

// 查询参数
const queryParams = reactive<WeijihuoKouKuan2Params>({
  page: 1,
  limit: 15,
  platform_id: '',
  product_id: '',
  sys_type: '',
  sn: '',
  status: '',
  create_time: ''
})

// 时间范围
const createTimeRange = ref<[string, string] | null>(null)

// 监听时间范围变化
watch(createTimeRange, (val) => {
  queryParams.create_time = val ? val.join(' - ') : ''
})

// 表格数据
const tableData = ref<WeijihuoKouKuan2Item[]>([])
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
    const res = await getWeijihuoKouKuan2ListApi(queryParams)
    console.log('未激活扣款响应:', res)
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
  queryParams.platform_id = ''
  queryParams.product_id = ''
  queryParams.sys_type = ''
  queryParams.sn = ''
  queryParams.status = ''
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

// 导出
const handleExport = () => {
  if (tableData.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'sys_type_name', title: '模式' },
    { key: 'product_name', title: '产品名称' },
    { key: 'sn', title: 'SN' },
    {
      key: 'username',
      title: '用户',
      formatter: (value: string) => {
        const div = document.createElement('div')
        div.innerHTML = value || ''
        return div.textContent || div.innerText || ''
      }
    },
    { key: 'yajin_money', title: '押金' },
    { key: 'sim_money', title: '流量费' },
    { key: 'kouKuan_money', title: '扣款金额' },
    {
      key: 'status',
      title: '状态',
      formatter: (value: number) => {
        const statusMap: Record<number, string> = {
          1: '未划拨',
          2: '已划拨',
          3: '已绑定',
          4: '已激活'
        }
        return statusMap[value] || '未知'
      }
    },
    { key: 'merchant_time', title: '激活时间' },
    { key: 'kouKuan_time', title: '扣款时间' },
    { key: 'create_time', title: '入库时间' }
  ]

  exportExcel({
    data: tableData.value,
    columns,
    filename: '未激活扣款列表'
  })
}

// 查看详情
const handleView = (row: WeijihuoKouKuan2Item) => {
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
