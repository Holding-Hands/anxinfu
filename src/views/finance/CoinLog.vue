<template>
  <div class="page-container">
    <el-card class="filter-card" shadow="never">
      <!-- 筛选表单 -->
      <el-form :model="queryParams" class="filter-form">
        <el-row :gutter="20">
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

          <!-- 姓名 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="姓名" label-width="80px">
              <el-input
                v-model="queryParams.name"
                placeholder="请输入姓名"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <!-- 时间 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="时间" label-width="80px">
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

          <!-- 类型 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="类型" label-width="80px">
              <el-select
                v-model="queryParams.type"
                placeholder="请选择类型"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in COIN_LOG_TYPE_OPTIONS"
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

        <!-- 模式 -->
        <el-table-column prop="sys_type_name" label="模式" min-width="100" align="center" />

        <!-- 姓名 -->
        <el-table-column prop="user_name" label="姓名" min-width="120" align="center" />

        <!-- 积分变动 -->
        <el-table-column prop="coin_before" label="积分变动前" min-width="120" align="center" />

        <!-- 积分数量 -->
        <el-table-column prop="coin_change" label="积分数量" min-width="120" align="center" />

        <!-- 积分变动后 -->
        <el-table-column prop="coin_after" label="积分变动后" min-width="120" align="center" />

        <!-- 类型 -->
        <el-table-column label="类型" min-width="100" align="center">
          <template #default="{ row }">
            {{ COIN_LOG_TYPE_MAP[row.type] || '-' }}
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

        <!-- 创建时间 -->
        <el-table-column prop="create_time" label="创建时间" min-width="180" align="center" />
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
import { getCoinLogListApi, type CoinLogParams, type CoinLogItem } from '@/api/coinLog'
import { SYS_TYPE_OPTIONS, COIN_LOG_TYPE_OPTIONS, COIN_LOG_TYPE_MAP } from '@/constants'
import { exportExcel } from '@/utils/export'

// 查询参数
const queryParams = reactive<CoinLogParams>({
  page: 1,
  limit: 15,
  sys_type: '',
  name: '',
  create_time: '',
  type: 0
})

// 时间范围
const timeRange = ref<[string, string] | null>(null)

// 表格数据
const tableData = ref<CoinLogItem[]>([])
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
    const res = await getCoinLogListApi(queryParams)
    if (res.code === 0) {
      tableData.value = res.data || []
      total.value = res.count || 0
    } else {
      ElMessage.error(res.msg || '获取数据失败')
    }
  } catch (error) {
    console.error('获取积分明细列表失败:', error)
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
  queryParams.sys_type = ''
  queryParams.name = ''
  queryParams.create_time = ''
  queryParams.type = 0
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
      { key: 'sys_type_name', title: '模式' },
      { key: 'user_name', title: '姓名' },
      { key: 'coin_before', title: '积分变动前' },
      { key: 'coin_change', title: '积分数量' },
      { key: 'coin_after', title: '积分变动后' },
      {
        key: 'type',
        title: '类型',
        formatter: (value: number) => COIN_LOG_TYPE_MAP[value] || '-'
      },
      { key: 'remark', title: '备注' },
      { key: 'create_time', title: '创建时间' }
    ]

    exportExcel({
      data: tableData.value,
      columns: headers,
      filename: '积分明细'
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
