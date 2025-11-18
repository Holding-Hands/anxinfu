<template>
  <div class="page-container">
    <!-- 搜索区域 -->
    <el-card class="filter-card" shadow="never">
      <el-form :model="queryParams" class="filter-form">
        <el-row :gutter="20" justify="space-between" align="middle">
          <el-col :xs="24" :sm="12" :md="6" :lg="5">
            <el-form-item label="用户名" label-width="70px">
              <el-input
                v-model="queryParams.username"
                placeholder="请输入用户名"
                clearable
                @keyup.enter="handleSearch"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="6" :lg="5">
            <el-form-item label="行为类型" label-width="70px">
              <el-select v-model="queryParams.type" placeholder="全部" clearable>
                <el-option
                  v-for="item in ACTION_TYPE_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" :lg="8">
            <el-form-item label="创建时间" label-width="70px">
              <el-date-picker
                v-model="dateRange"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label=" " label-width="20px">
              <div style="text-align: right; width: 100%">
                <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
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
        <el-table-column prop="id" label="ID" width="80" align="center" fixed="left" />
        <el-table-column prop="username" label="操作账号" min-width="120" align="center" />
        <el-table-column prop="action" label="行为" min-width="200" align="center" />
        <el-table-column prop="controller" label="控制器" min-width="150" align="center" />
        <el-table-column prop="msg" label="描述信息" min-width="200" align="center">
          <template #default="{ row }">
            {{ row.msg || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="params" label="请求参数" min-width="150" align="center">
          <template #default="{ row }">
            <div v-if="row.params" class="params-content" v-html="row.params"></div>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="行为类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getActionTypeTag(row.type) || undefined">
              {{ getActionTypeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="IP地址" width="150" align="center" />
        <el-table-column prop="create_time" label="创建时间" width="180" align="center" />
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.limit"
          :page-sizes="[10, 15, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { request } from '@/utils/request'

// 行为类型选项
const ACTION_TYPE_OPTIONS = [
  { label: '全部', value: 0 },
  { label: '新增', value: 1 },
  { label: '编辑', value: 2 },
  { label: '删除', value: 3 },
  { label: '启用', value: 4 },
  { label: '禁用', value: 5 },
  { label: '其它', value: 6 }
]

// 定义操作日志项接口
interface LogItem {
  id: number
  access_id: number
  m_id: number
  username: string
  action: string
  controller: string
  msg: string
  params: string
  type: number
  ip: string
  create_time: string
}

// 定义查询参数接口
interface QueryParams {
  page: number
  limit: number
  username: string
  type: string | number
  create_time: string
}

// 定义API响应接口
interface ApiResponse {
  code: number
  msg: string
  count: number
  data: LogItem[]
}

// 查询参数
const queryParams = reactive<QueryParams>({
  page: 1,
  limit: 15,
  username: '',
  type: '',
  create_time: ''
})

// 日期范围
const dateRange = ref<[string, string] | null>(null)

// 表格数据
const tableData = ref<LogItem[]>([])
const total = ref(0)
const loading = ref(false)

// 获取行为类型标签
const getActionTypeLabel = (type: number): string => {
  const option = ACTION_TYPE_OPTIONS.find((item) => item.value === type)
  return option ? option.label : '未知'
}

// 获取行为类型标签颜色
const getActionTypeTag = (type: number): 'success' | 'warning' | 'info' | 'danger' | '' => {
  const tagMap: Record<number, 'success' | 'warning' | 'info' | 'danger' | ''> = {
    0: '', // 全部
    1: 'success', // 新增
    2: 'warning', // 编辑
    3: 'danger', // 删除
    4: 'success', // 启用
    5: 'danger', // 禁用
    6: 'info' // 其它
  }
  return tagMap[type] || 'info'
}

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const params: Record<string, string | number> = {
      page: queryParams.page,
      limit: queryParams.limit
    }

    if (queryParams.username) {
      params.username = queryParams.username
    }

    if (queryParams.type !== '') {
      params.type = queryParams.type
    }

    // 处理日期范围
    if (dateRange.value && dateRange.value.length === 2) {
      params.create_time = `${dateRange.value[0]} - ${dateRange.value[1]}`
    }

    const res = await request.get<ApiResponse>('/index/team_log/getlist.html', { params })

    console.log('操作日志响应:', res)

    if (res.code === 0) {
      tableData.value = res.data || []
      total.value = res.count || 0
    } else {
      ElMessage.error(res.msg || '获取数据失败')
    }
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  getList()
}

// 重置
const handleReset = () => {
  queryParams.page = 1
  queryParams.username = ''
  queryParams.type = ''
  dateRange.value = null
  getList()
}

// 分页大小改变
const handleSizeChange = (size: number) => {
  queryParams.limit = size
  getList()
}

// 当前页改变
const handleCurrentChange = (page: number) => {
  queryParams.page = page
  getList()
}

// 页面加载时获取数据
onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
.page-container {
  padding: 20px;
}

.filter-card {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.params-content {
  word-break: break-all;
  line-height: 1.5;

  :deep(p) {
    margin: 0;
  }

  :deep(br) {
    display: block;
    content: '';
    margin: 4px 0;
  }
}
</style>
