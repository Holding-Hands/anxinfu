<template>
  <div class="page-container">
    <el-card class="filter-card" shadow="never">
      <!-- 筛选表单 -->
      <el-form :model="queryParams" label-width="80px" class="filter-form">
        <el-row :gutter="20">
          <!-- 模式 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="模式">
              <el-select v-model="queryParams.sys_type" placeholder="全部" clearable>
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
            <el-form-item label="姓名">
              <el-input
                v-model="queryParams.name"
                placeholder="请输入姓名"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <!-- 类型 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="类型">
              <el-select v-model="queryParams.type" placeholder="全部" clearable>
                <el-option
                  v-for="item in POINT_LOG_TYPE_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 时间 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="时间">
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
          <el-col :xs="24" :sm="24" :md="24" :lg="42">
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

        <!-- 姓名 -->
        <el-table-column prop="name" label="姓名" min-width="120" align="center" />

        <!-- 手机号 -->
        <el-table-column prop="mobile" label="手机号" min-width="130" align="center" />

        <!-- 类型 -->
        <el-table-column prop="type" label="类型" min-width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.type === 1" type="success">交易返</el-tag>
            <el-tag v-else-if="row.type === 2" type="info">其他</el-tag>
            <el-tag v-else-if="row.type === 3" type="warning">抽奖消耗</el-tag>
            <el-tag v-else>未知</el-tag>
          </template>
        </el-table-column>

        <!-- 积分数量 -->
        <el-table-column prop="point_num" label="积分数量" min-width="100" align="center" />

        <!-- 变动前积分 -->
        <el-table-column prop="before_point" label="变动前积分" min-width="120" align="center" />

        <!-- 变动后积分 -->
        <el-table-column prop="after_point" label="变动后积分" min-width="120" align="center" />

        <!-- 备注 -->
        <el-table-column
          prop="remark"
          label="备注"
          min-width="200"
          align="center"
          show-overflow-tooltip
        />

        <!-- 创建时间 -->
        <el-table-column prop="create_time" label="创建时间" min-width="180" align="center" />
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
import { getPointLogListApi, type PointLogParams, type PointLogItem } from '@/api/pointLog'
import { SYS_TYPE_OPTIONS, POINT_LOG_TYPE_OPTIONS, POINT_LOG_TYPE_MAP } from '@/constants'
import { exportExcel } from '@/utils/export'

// 查询参数
const queryParams = reactive<PointLogParams>({
  page: 1,
  limit: 15,
  sys_type: '',
  name: '',
  create_time: '',
  type: 1
})

// 时间范围
const createTimeRange = ref<[string, string] | null>(null)

// 监听时间范围变化
watch(createTimeRange, (val) => {
  queryParams.create_time = val ? val.join(' - ') : ''
})

// 表格数据
const tableData = ref<PointLogItem[]>([])
const total = ref(0)
const loading = ref(false)

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const res = await getPointLogListApi(queryParams)
    console.log('抽奖积分响应:', res)
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
  queryParams.sys_type = ''
  queryParams.name = ''
  queryParams.type = 1
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
    { key: 'sys_type_name', title: '模式' },
    { key: 'name', title: '姓名' },
    { key: 'mobile', title: '手机号' },
    {
      key: 'type',
      title: '类型',
      formatter: (value: number) => POINT_LOG_TYPE_MAP[value] || '未知'
    },
    { key: 'point_num', title: '积分数量' },
    { key: 'before_point', title: '变动前积分' },
    { key: 'after_point', title: '变动后积分' },
    { key: 'remark', title: '备注' },
    { key: 'create_time', title: '创建时间' }
  ]

  exportExcel({
    data: tableData.value,
    columns,
    filename: '抽奖积分列表'
  })
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
