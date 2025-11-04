<template>
  <div class="page-container">
    <el-card class="filter-card" shadow="never">
      <!-- 筛选表单 -->
      <el-form :model="queryParams" label-width="100px" class="filter-form">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="手机号">
              <el-input
                v-model="queryParams.mobile"
                placeholder="请输入手机号"
                clearable
                filterable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="姓名">
              <el-input
                v-model="queryParams.name"
                placeholder="请输入姓名"
                clearable
                filterable
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
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="等级">
              <el-select
                v-model="queryParams.level"
                placeholder="请选择等级"
                clearable
                filterable
                @change="handleQuery"
              >
                <el-option label="全部" :value="0" />
                <el-option
                  v-for="item in USER_LEVEL_OPTIONS.slice(1)"
                  :key="item.value"
                  :label="item.label"
                  :value="parseInt(item.value)"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="18">
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
      <el-tag type="info" size="large" effect="plain">总数: {{ statsData.total }}</el-tag>
      <el-tag type="warning" size="large" effect="plain">
        总金额: {{ formatAmount(statsData.total_amount) }}
      </el-tag>
      <el-tag type="success" size="large" effect="plain">
        总提现: {{ formatAmount(statsData.total_withdraw) }}
      </el-tag>
      <el-tag type="danger" size="large" effect="plain">
        代理总数: {{ statsData.total_agent_count }}
      </el-tag>
    </div>

    <!-- 数据表格 -->
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">盟友列表</span>
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
        <el-table-column prop="id" label="ID" width="80" align="center" fixed="left" />

        <el-table-column prop="name" label="姓名" width="150" align="center" fixed="left">
          <template #default="{ row }">
            <div class="user-info">
              <el-avatar :size="32" :src="extractAvatar(row.name, row.headimg)" />
              <span style="margin-left: 8px">{{ extractName(row.name) }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="user_code" label="推荐码" width="100" align="center" />
        <el-table-column prop="mobile" label="手机号" width="130" align="center" />

        <!-- 分润等级 - 不确定字段，可能是 profit_ratio 或 level -->
        <el-table-column prop="profit_ratio" label="分润等级" width="100" align="center">
          <template #default="{ row }">
            {{ row.profit_ratio || row.level }}
          </template>
        </el-table-column>

        <el-table-column prop="p_user" label="推荐人" width="120" align="center" />

        <el-table-column prop="is_auth" label="实名" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="extractAuthStatus(row.is_auth) === '已实名' ? 'success' : 'info'">
              {{ extractAuthStatus(row.is_auth) }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 支付宝 -->
        <el-table-column prop="alipay" label="支付宝" width="130" align="center">
          <template #default="{ row }">
            <div>{{ row.alipay }}</div>
            <div style="font-size: 12px; color: #999">{{ row.aliypayName }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="wallet1" label="分润钱包" width="110" align="center">
          <template #default="{ row }">¥{{ row.wallet1 }}</template>
        </el-table-column>

        <el-table-column prop="wallet2" label="返现钱包" width="110" align="center">
          <template #default="{ row }">¥{{ row.wallet2 }}</template>
        </el-table-column>

        <el-table-column prop="wallet3" label="流量费钱包" width="120" align="center">
          <template #default="{ row }">¥{{ row.wallet3 }}</template>
        </el-table-column>

        <!-- 冻结金额 -->
        <el-table-column prop="forz_acc_amt" label="冻结金额" width="110" align="center">
          <template #default="{ row }">
            <span style="color: #f56c6c">¥{{ row.forz_acc_amt || '0.00' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="point" label="积分" width="100" align="center" />

        <!-- 机具 - 使用 stocks 或 stock 字段 -->
        <el-table-column prop="stocks" label="机具" width="100" align="center">
          <template #default="{ row }">
            <el-tag type="warning">{{ row.stock || row.stocks?.length || 0 }}</el-tag>
          </template>
        </el-table-column>

        <!-- 状态 -->
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="is_tixian" label="提现" width="80" align="center">
          <template #default="{ row }">
            <el-icon v-if="row.is_tixian === 1" color="#67c23a" :size="20">
              <Check />
            </el-icon>
            <el-icon v-else color="#f56c6c" :size="20">
              <Close />
            </el-icon>
          </template>
        </el-table-column>

        <el-table-column prop="wallet_status_name" label="收益状态" width="120" align="center">
          <template #default="{ row }">
            <span v-html="row.wallet_status_name"></span>
          </template>
        </el-table-column>

        <el-table-column prop="user_type" label="用户类别" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.user_type === 1 ? 'success' : 'info'">
              {{ row.user_type === 1 ? '代理' : row.user_type === 2 ? '商户' : '全部' }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 等级时效 -->
        <el-table-column prop="level_month" label="等级时效" width="120" align="center">
          <template #default="{ row }">
            <span v-html="row.level_month"></span>
          </template>
        </el-table-column>

        <!-- 运营中心 - 不确定字段，可能需要你告知 -->
        <el-table-column prop="operation_center" label="运营中心" width="120" align="center">
          <template #default="{ row }">
            {{ row.operation_center || row.jgid || '--' }}
          </template>
        </el-table-column>

        <!-- 股东 - 不确定字段，可能需要你告知 -->
        <el-table-column prop="shareholder" label="股东" width="100" align="center">
          <template #default="{ row }">
            {{ row.shareholder || row.is_gd || '--' }}
          </template>
        </el-table-column>

        <el-table-column prop="create_time" label="注册时间" width="160" align="center" />

        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="warning" link @click="handleSetLevel(row)">设定等级</el-button>
            <el-button type="success" link @click="handleRecommendCode(row)">推荐码</el-button>
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
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 设定等级弹窗 -->
    <el-dialog
      v-model="levelDialogVisible"
      :title="`${currentUser?.name ? extractName(currentUser.name) : ''}的分润等级`"
      width="600px"
      @close="handleLevelDialogClose"
    >
      <el-form :model="levelForm" label-width="100px">
        <el-form-item label="分润等级">
          <el-select v-model="levelForm.level" placeholder="请选择分润等级" style="width: 100%">
            <el-option label="V1" :value="1" />
            <el-option label="V2" :value="2" />
            <el-option label="V3" :value="3" />
            <el-option label="V4" :value="4" />
            <el-option label="V5" :value="5" />
            <el-option label="V6" :value="6" />
            <el-option label="V7" :value="7" />
          </el-select>
        </el-form-item>

        <el-form-item label="请选择">
          <el-radio-group v-model="levelForm.type">
            <el-radio :label="1">永久有效</el-radio>
            <el-radio :label="2">设定到期时间</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="levelForm.type === 2" label="截止月份">
          <el-date-picker
            v-model="levelForm.level_month"
            type="month"
            placeholder="选择月份"
            format="YYYY-MM"
            value-format="YYYY-MM"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="levelDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleLevelConfirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh, Check, Close } from '@element-plus/icons-vue'
import {
  getAllyListApi,
  editLevelApi,
  type AllyListParams,
  type AllyListItem,
  type EditLevelParams
} from '@/api/user'
import { USER_LEVEL_OPTIONS, USER_TYPE_OPTIONS, AUTH_STATUS_OPTIONS } from '@/constants'

// 查询参数
const queryParams = reactive<AllyListParams>({
  page: 1,
  limit: 15,
  mobile: '',
  name: '',
  is_auth: 'all', // 默认显示"全部"
  user_type: 0, // 默认显示"全部"
  level: 0 // 默认显示"全部"
})

// 表格数据
const tableData = ref<AllyListItem[]>([])
const total = ref(0)
const loading = ref(false)

// 统计数据
const statsData = reactive({
  total: 0,
  total_amount: 0,
  total_withdraw: 0,
  total_agent_count: 0
})

// 设定等级弹窗
const levelDialogVisible = ref(false)
const currentUser = ref<AllyListItem | null>(null)
const levelForm = reactive<EditLevelParams>({
  id: 0,
  level: 1,
  type: 2, // 默认选择"设定到期时间"
  level_month: ''
})

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const res = await getAllyListApi(queryParams)
    console.log('盟友列表响应:', res)

    // 根据实际返回的数据结构处理
    tableData.value = res.data || []
    total.value = res.count || res.total || 0
    statsData.total = res.count || res.total || 0
    statsData.total_amount = res.total_amount || 0
    statsData.total_withdraw = res.total_withdraw || 0
    statsData.total_agent_count = res.total_agent_count || 0
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
  queryParams.mobile = ''
  queryParams.name = ''
  queryParams.is_auth = 'all' // 重置为"全部"
  queryParams.user_type = 0 // 重置为"全部"
  queryParams.level = 0 // 重置为"全部"
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

// 设定等级
const handleSetLevel = (row: AllyListItem) => {
  currentUser.value = row

  // 从row.level提取数字（如 "V1" -> 1）
  const levelMatch = row.level.match(/\d+/)
  const levelNum = levelMatch ? parseInt(levelMatch[0]) : 1

  // 初始化表单
  levelForm.id = row.id
  levelForm.level = levelNum
  levelForm.type = 2

  // 如果有level_month，解析它
  if (row.level_month && row.level_month !== '自动') {
    // 移除HTML标签
    const monthText = row.level_month.replace(/<[^>]*>/g, '').trim()
    // 从 "2022年05月" 格式提取
    const match = monthText.match(/(\d{4})年(\d{2})月/)
    if (match) {
      levelForm.level_month = `${match[1]}-${match[2]}`
    } else {
      // 默认为当前月份的下一个月
      const now = new Date()
      const year = now.getFullYear()
      const month = (now.getMonth() + 2).toString().padStart(2, '0')
      levelForm.level_month = `${year}-${month > '12' ? year + 1 : year}-${month > '12' ? '01' : month}`
    }
  } else {
    // 默认为当前月份的下一个月
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 2
    if (month > 12) {
      levelForm.level_month = `${year + 1}-01`
    } else {
      levelForm.level_month = `${year}-${month.toString().padStart(2, '0')}`
    }
  }

  levelDialogVisible.value = true
}

// 推荐码
const handleRecommendCode = (row: AllyListItem) => {
  ElMessage.info(`推荐码: ${row.user_code}`)
  // TODO: 这里可以实现复制推荐码或其他功能
}

// 设定等级确认
const handleLevelConfirm = async () => {
  try {
    // 验证
    if (!levelForm.level) {
      ElMessage.warning('请选择分润等级')
      return
    }

    if (levelForm.type === 2 && !levelForm.level_month) {
      ElMessage.warning('请选择截止月份')
      return
    }

    // 构建请求参数
    const params: EditLevelParams = {
      id: levelForm.id,
      level: levelForm.level,
      type: levelForm.type
    }

    // 如果是设定到期时间，添加level_month
    if (levelForm.type === 2) {
      params.level_month = levelForm.level_month
    }

    console.log('设定等级参数:', params)

    // 调用接口
    await editLevelApi(params)

    ElMessage.success('设定等级成功')
    levelDialogVisible.value = false

    // 刷新列表
    getList()
  } catch (error) {
    console.error('设定等级失败:', error)
    ElMessage.error('设定等级失败，请稍后重试')
  }
}

// 关闭弹窗
const handleLevelDialogClose = () => {
  currentUser.value = null
}

// 从HTML中提取姓名
const extractName = (nameHtml: string): string => {
  if (!nameHtml) return ''

  // 匹配 <img ...> 后面的文本
  const match = nameHtml.match(/>\s*(.+)$/)
  if (match) {
    return match[1].trim()
  }

  // 如果没有HTML标签，直接返回
  return nameHtml.replace(/<[^>]*>/g, '').trim()
}

// 从HTML中提取头像URL
const extractAvatar = (nameHtml: string, headimg: string): string => {
  if (headimg) return headimg

  // 从name字段中提取img src
  const match = nameHtml.match(/src="([^"]+)"/)
  if (match) {
    return match[1]
  }

  // 默认头像
  return 'https://axf.anxinfupp.com/public/static/images/avatar.jpg'
}

// 从HTML中提取实名状态
const extractAuthStatus = (authHtml: string): string => {
  if (!authHtml) return '未认证'

  // 移除HTML标签
  const text = authHtml.replace(/<[^>]*>/g, '').trim()
  return text || '未认证'
}

// 格式化金额
const formatAmount = (amount: number) => {
  return amount?.toFixed(2) || '0.00'
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
