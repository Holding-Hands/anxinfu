<template>
  <div class="page-container">
    <el-card class="filter-card" shadow="never">
      <!-- 筛选表单 -->
      <el-form :model="queryParams" label-width="100px" class="filter-form">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="所属团队">
              <el-select
                v-model="queryParams.m_id"
                placeholder="请选择团队"
                clearable
                filterable
                @change="handleQuery"
              >
                <el-option
                  v-for="item in TEAM_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="手机号">
              <el-input
                v-model="queryParams.mobile"
                placeholder="请输入手机号"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="用户类别">
              <el-select
                v-model="queryParams.user_type"
                placeholder="请选择类别"
                clearable
                filterable
                @change="handleQuery"
              >
                <el-option
                  v-for="item in USER_TYPE_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="等级">
              <el-select
                v-model="queryParams.level"
                placeholder="请选择等级"
                clearable
                filterable
                @change="handleQuery"
              >
                <el-option
                  v-for="item in USER_LEVEL_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="姓名">
              <el-input
                v-model="queryParams.name"
                placeholder="请输入姓名"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="实名状态">
              <el-select
                v-model="queryParams.is_auth"
                placeholder="请选择状态"
                clearable
                filterable
                @change="handleQuery"
              >
                <el-option
                  v-for="item in AUTH_STATUS_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label=" " class="filter-actions">
              <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
              <el-button :icon="Refresh" @click="handleReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 统计标签 -->
    <div class="stats-tags">
      <el-tag type="info" size="large" effect="plain">
        合计本金: {{ formatAmount(statsData.total_amount) }}
      </el-tag>
      <el-tag type="warning" size="large" effect="plain">
        总分润余额: {{ formatAmount(statsData.total_withdraw) }}
      </el-tag>
      <el-tag type="success" size="large" effect="plain">
        总积分余额: {{ statsData.total_agent_count }}
      </el-tag>
    </div>

    <!-- 数据表格 -->
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">代理列表</span>
          <div class="header-actions">
            <el-button type="success" :icon="Download">导出</el-button>
            <el-button type="primary" :icon="Plus">新增代理</el-button>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="team" label="团队" width="120" align="center" />
        <el-table-column prop="name" label="姓名" width="120" align="center">
          <template #default="{ row }">
            <div class="user-info">
              <el-avatar :size="32" :src="getAvatar(row.name)" />
              <span style="margin-left: 8px">{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="promotion_code" label="推荐码" width="100" align="center" />
        <el-table-column prop="mobile" label="手机号" width="130" align="center" />
        <el-table-column prop="level" label="等级" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="recommend_user" label="推荐人" width="120" align="center" />
        <el-table-column prop="real_name_status" label="实名状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.real_name_status === '已实名' ? 'success' : 'info'">
              {{ row.real_name_status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pay_rate" label="支付宝" width="100" align="center" />
        <el-table-column prop="wechat_return" label="微信分润" width="100" align="center" />
        <el-table-column prop="alipay_return" label="支付宝分润" width="110" align="center" />
        <el-table-column prop="other_return" label="其他分润" width="100" align="center" />
        <el-table-column prop="frozen_amount" label="冻结金额" width="110" align="center">
          <template #default="{ row }">
            {{ formatAmount(row.frozen_amount) }}
          </template>
        </el-table-column>
        <el-table-column prop="total_score" label="积分" width="100" align="center" />
        <el-table-column prop="lottery_count" label="抽奖次数" width="100" align="center" />
        <el-table-column prop="machine_count" label="机具数" width="90" align="center" />
        <el-table-column prop="status" label="状态" width="80" align="center" fixed="right">
          <template #default="{ row }">
            <el-switch v-model="row.status" />
          </template>
        </el-table-column>
        <el-table-column prop="提现" label="提现" width="80" align="center" fixed="right">
          <template #default="{ row }">
            <el-icon v-if="row.提现" color="#67c23a" :size="20">
              <Check />
            </el-icon>
            <el-icon v-else color="#f56c6c" :size="20">
              <Close />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="operation_type" label="操作类型" width="100" align="center" fixed="right" />
        <el-table-column prop="level_name" label="等级名称" width="120" align="center" fixed="right" />
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="View" @click="handleView(row)">详情</el-button>
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.limit"
          :page-sizes="[10, 20, 50, 100]"
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
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  Refresh,
  Plus,
  Download,
  View,
  Edit,
  Delete,
  Check,
  Close
} from '@element-plus/icons-vue'
import { getAgentListApi, type AgentListParams, type AgentListItem } from '@/api/user'
import {
  USER_LEVEL_OPTIONS,
  USER_TYPE_OPTIONS,
  AUTH_STATUS_OPTIONS,
  TEAM_OPTIONS,
  LEVEL_TAG_TYPE_MAP
} from '@/constants'

// 查询参数
const queryParams = reactive<AgentListParams>({
  page: 1,
  limit: 10,
  level: '',
  mobile: '',
  name: '',
  user_type: 0,
  is_auth: 'all',
  m_id: 0
})

// 表格数据
const tableData = ref<AgentListItem[]>([])
const total = ref(0)
const loading = ref(false)

// 统计数据
const statsData = reactive({
  total_amount: 0,
  total_withdraw: 0,
  total_agent_count: 0
})

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const data = await getAgentListApi(queryParams)
    tableData.value = data.list || []
    total.value = data.total || 0
    statsData.total_amount = data.total_amount || 0
    statsData.total_withdraw = data.total_withdraw || 0
    statsData.total_agent_count = data.total_agent_count || 0
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
  queryParams.limit = 10
  queryParams.level = ''
  queryParams.mobile = ''
  queryParams.name = ''
  queryParams.user_type = 0
  queryParams.is_auth = 'all'
  queryParams.m_id = 0
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

// 查看详情
const handleView = (row: AgentListItem) => {
  ElMessage.info(`查看详情: ${row.name}`)
}

// 编辑
const handleEdit = (row: AgentListItem) => {
  ElMessage.info(`编辑: ${row.name}`)
}

// 删除
const handleDelete = (row: AgentListItem) => {
  ElMessageBox.confirm(`确定要删除代理 "${row.name}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    getList()
  }).catch(() => {
    // 取消删除
  })
}

// 格式化金额
const formatAmount = (amount: number) => {
  return amount?.toFixed(2) || '0.00'
}

// 获取头像
const getAvatar = (name: string) => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
}

// 获取等级标签类型
const getLevelType = (level: string) => {
  return LEVEL_TAG_TYPE_MAP[level] || ''
}

// 页面加载时获取数据
onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
.page-container {
  padding: 20px;

  .filter-card {
    margin-bottom: 20px;

    :deep(.el-card__body) {
      padding-bottom: 0;
    }
  }

  .filter-form {
    .el-select,
    .el-input {
      width: 100%;
    }

    .filter-actions {
      text-align: right;
    }
  }

  .stats-tags {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;

    .el-tag {
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 500;
    }
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .card-title {
      font-size: 16px;
      font-weight: bold;
    }

    .header-actions {
      display: flex;
      gap: 10px;
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}

:deep(.el-table) {
  font-size: 13px;

  .el-table__cell {
    padding: 8px 0;
  }
}
</style>

