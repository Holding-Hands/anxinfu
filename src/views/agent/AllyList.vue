<template>
  <div class="page-container">
    <el-card class="filter-card" shadow="never">
      <!-- 筛选表单 -->
      <el-form :model="queryParams" label-width="100px" class="filter-form">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
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

          <el-col :xs="24" :sm="12" :md="8" :lg="6">
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

          <el-col :xs="24" :sm="12" :md="8" :lg="6">
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

          <el-col :xs="24" :sm="12" :md="8" :lg="6">
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

          <el-col :xs="24" :sm="12" :md="8" :lg="6">
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

          <el-col :xs="24" :sm="12" :md="8" :lg="18">
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
      <template #header>
        <div class="card-header">
          <span class="card-title">2.0盟友列表</span>
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
        <el-table-column prop="level" label="分润等级" width="100" align="center">
          <template #default="{ row }">
            {{ row.level }}
          </template>
        </el-table-column>

        <el-table-column prop="p_user" label="推荐人" width="120" align="center" />

        <el-table-column prop="is_auth" label="实名" width="100" align="center">
          <template #default="{ row }">
            <el-tag
              :type="extractAuthStatus(row.is_auth) === '已实名' ? 'success' : 'info'"
              style="cursor: pointer"
              @click="handleAuthClick(row)"
            >
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
          <template #default="{ row }">
            <span
              style="cursor: pointer; color: #409eff"
              @click="handleWalletClick(row, 'wallet1', '分润钱包')"
            >
              ¥{{ row.wallet1 }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="wallet2" label="返现钱包" width="110" align="center">
          <template #default="{ row }">
            <span
              style="cursor: pointer; color: #409eff"
              @click="handleWalletClick(row, 'wallet2', '返现钱包')"
            >
              ¥{{ row.wallet2 }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="wallet3" label="流量费钱包" width="120" align="center">
          <template #default="{ row }">
            <span
              style="cursor: pointer; color: #409eff"
              @click="handleWalletClick(row, 'wallet3', '其他钱包')"
            >
              ¥{{ row.wallet3 }}
            </span>
          </template>
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
        <el-table-column prop="status" label="状态" width="120" align="center">
          <template #default="{ row }">
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px">
              <el-switch
                v-model="row.status"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange(row)"
              />
              <span>{{ row.status === 1 ? '正常' : '不正常' }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- 提现 -->
        <el-table-column prop="is_tixian" label="提现" width="100" align="center">
          <template #default="{ row }">
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px">
              <el-switch
                v-model="row.is_tixian"
                :active-value="1"
                :inactive-value="0"
                @change="handleWithdrawChange(row)"
              />
              <span>{{ row.is_tixian === 1 ? '是' : '否' }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="wallet_status_name" label="收益状态" width="120" align="center">
          <template #default="{ row }">
            <span
              style="cursor: pointer; color: #409eff"
              @click="handleWalletStatusClick(row)"
              v-html="row.wallet_status_name"
            ></span>
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

        <!-- 运营中心 -->
        <el-table-column prop="is_yyzx" label="运营中心" width="120" align="center">
          <template #default="{ row }">
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px">
              <el-switch
                v-model="row.is_yyzx"
                :active-value="1"
                :inactive-value="0"
                @change="handleOperationCenterChange(row)"
              />
              <span>{{ row.is_yyzx === 1 ? '是' : '否' }}</span>
            </div>
          </template>
        </el-table-column>

        <!-- 股东 -->
        <el-table-column prop="is_gd" label="股东" width="100" align="center">
          <template #default="{ row }">
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px">
              <el-switch
                v-model="row.is_gd"
                :active-value="1"
                :inactive-value="0"
                @change="handleShareholderChange(row)"
              />
              <span>{{ row.is_gd === 1 ? '是' : '否' }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="create_time" label="注册时间" width="160" align="center" />

        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <div class="table-actions">
              <el-link type="warning" :underline="true" @click="handleSetLevel(row)">
                设定等级
              </el-link>
              <el-link type="success" :underline="true" @click="handleRecommendCode(row)">
                推荐码
              </el-link>
            </div>
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

    <!-- 推荐码弹窗 -->
    <el-dialog
      v-model="codeDialogVisible"
      :title="`${currentUser?.name ? extractName(currentUser.name) : ''}的邀请码`"
      width="600px"
      @close="handleCodeDialogClose"
    >
      <el-form :model="codeForm" label-width="100px">
        <el-form-item label="原本邀请码">
          <el-input v-model="codeForm.original_code" readonly disabled style="width: 100%" />
        </el-form-item>

        <el-form-item label="新邀请码">
          <el-input
            v-model="codeForm.user_code"
            placeholder="请输入新邀请码"
            clearable
            maxlength="20"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="codeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCodeConfirm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 收益状态弹窗 -->
    <el-dialog
      v-model="walletStatusDialogVisible"
      :title="`${currentUser?.name ? extractName(currentUser.name) : ''}的收益状态`"
      width="500px"
      @close="handleWalletStatusDialogClose"
    >
      <el-form :model="walletStatusForm" label-width="100px">
        <el-form-item label="收益状态">
          <el-radio-group v-model="walletStatusForm.wallet_status">
            <el-radio :label="2">收益正常</el-radio>
            <el-radio :label="1">发给直属上级</el-radio>
            <el-radio :label="0">收益关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="walletStatusDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleWalletStatusConfirm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 实名信息弹窗 -->
    <el-dialog
      v-model="authDialogVisible"
      :title="`修改${currentUser?.name ? extractName(currentUser.name) : ''}的实名信息`"
      width="600px"
      @close="handleAuthDialogClose"
    >
      <el-form :model="authForm" label-width="100px">
        <el-form-item label="姓名">
          <el-input
            v-model="authForm.name"
            placeholder="请输入姓名"
            clearable
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="身份证号">
          <el-input
            v-model="authForm.ids_num"
            placeholder="请输入身份证号"
            clearable
            maxlength="18"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="支付宝">
          <el-input
            v-model="authForm.alipay"
            placeholder="请输入支付宝账号"
            clearable
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="支付宝姓名">
          <el-input
            v-model="authForm.aliypayName"
            placeholder="请输入支付宝姓名"
            clearable
            style="width: 100%"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="authDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAuthConfirm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 钱包操作弹窗 -->
    <el-dialog
      v-model="walletDialogVisible"
      :title="`操作${currentUser?.name ? extractName(currentUser.name) : ''}的${walletTypeLabel}`"
      width="600px"
      @close="handleWalletDialogClose"
    >
      <div style="color: #e6a23c; margin-bottom: 20px; text-align: center">
        注意：正数为增加余额，负数为扣除余额，请谨慎操作
      </div>

      <el-form :model="walletForm" label-width="100px">
        <el-form-item label="钱包类型">
          <el-input v-model="walletTypeLabel" disabled style="width: 100%" />
        </el-form-item>

        <el-form-item label="钱包余额">
          <el-input v-model="currentWalletBalance" disabled style="width: 100%" />
        </el-form-item>

        <el-form-item label="操作金额">
          <el-input
            v-model="walletForm.money"
            type="number"
            placeholder="正数为增加余额，负数为扣除余额"
            clearable
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            v-model="walletForm.remark"
            type="textarea"
            :rows="3"
            placeholder="备注"
            maxlength="200"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="walletDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleWalletConfirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh, Download } from '@element-plus/icons-vue'
import {
  getAllyListApi,
  editLevelApi,
  editUserCodeApi,
  setShareholderApi,
  setOperationCenterApi,
  changeWalletStatusApi,
  setWithdrawApi,
  setUserStatusApi,
  editAuthInfoApi,
  operateWalletApi,
  type AllyListParams,
  type AllyListItem,
  type EditLevelParams,
  type EditUserCodeParams,
  type SetShareholderParams,
  type SetOperationCenterParams,
  type ChangeWalletStatusParams,
  type SetWithdrawParams,
  type SetUserStatusParams,
  type EditAuthInfoParams,
  type OperateWalletParams
} from '@/api/user'
import { USER_LEVEL_OPTIONS, USER_TYPE_OPTIONS, AUTH_STATUS_OPTIONS } from '@/constants'
import { exportExcel, type ExportColumn } from '@/utils/export'

// 查询参数
const queryParams = reactive<AllyListParams>({
  page: 1,
  limit: 15,
  mobile: '',
  name: '',
  is_auth: '', // 默认显示"全部"，传空字符串
  user_type: '', // 默认显示"全部"，传空字符串
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

// 推荐码弹窗
const codeDialogVisible = ref(false)
const codeForm = reactive<EditUserCodeParams & { original_code: string }>({
  id: 0,
  user_code: '',
  original_code: '' // 原本的推荐码（只用于显示）
})

// 收益状态弹窗
const walletStatusDialogVisible = ref(false)
const walletStatusForm = reactive<ChangeWalletStatusParams>({
  id: 0,
  wallet_status: 2 // 默认选择"收益正常"
})

// 实名信息弹窗
const authDialogVisible = ref(false)
const authForm = reactive<EditAuthInfoParams>({
  id: 0,
  name: '',
  ids_num: '',
  alipay: '',
  aliypayName: ''
})

// 钱包操作弹窗
const walletDialogVisible = ref(false)
const walletTypeLabel = ref('') // 钱包类型显示名称
const currentWalletBalance = ref('0.00') // 当前钱包余额
const walletForm = reactive<OperateWalletParams>({
  id: 0,
  money: 0,
  remark: '',
  wallet: ''
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
  queryParams.is_auth = '' // 重置为"全部"，传空字符串
  queryParams.user_type = '' // 重置为"全部"，传空字符串
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
  currentUser.value = row

  // 初始化表单
  codeForm.id = row.id
  codeForm.original_code = row.user_code
  codeForm.user_code = '' // 清空新推荐码输入框

  codeDialogVisible.value = true
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

// 关闭等级弹窗
const handleLevelDialogClose = () => {
  currentUser.value = null
}

// 推荐码确认
const handleCodeConfirm = async () => {
  try {
    // 验证
    if (!codeForm.user_code) {
      ElMessage.warning('请输入新推荐码')
      return
    }

    // 构建请求参数
    const params: EditUserCodeParams = {
      id: codeForm.id,
      user_code: codeForm.user_code
    }

    console.log('修改推荐码参数:', params)

    // 调用接口
    await editUserCodeApi(params)

    ElMessage.success('修改推荐码成功')
    codeDialogVisible.value = false

    // 刷新列表
    getList()
  } catch (error) {
    console.error('修改推荐码失败:', error)
    ElMessage.error('修改推荐码失败，请稍后重试')
  }
}

// 关闭推荐码弹窗
const handleCodeDialogClose = () => {
  currentUser.value = null
  codeForm.user_code = ''
}

// 点击收益状态
const handleWalletStatusClick = (row: AllyListItem) => {
  currentUser.value = row
  walletStatusForm.id = row.id
  walletStatusForm.wallet_status = row.wallet_status
  walletStatusDialogVisible.value = true
}

// 收益状态确认
const handleWalletStatusConfirm = async () => {
  try {
    // 构建请求参数
    const params: ChangeWalletStatusParams = {
      id: walletStatusForm.id,
      wallet_status: walletStatusForm.wallet_status
    }

    console.log('修改收益状态参数:', params)

    // 调用接口
    await changeWalletStatusApi(params)

    ElMessage.success('修改收益状态成功')
    walletStatusDialogVisible.value = false

    // 刷新列表
    getList()
  } catch (error) {
    console.error('修改收益状态失败:', error)
    ElMessage.error('修改收益状态失败，请稍后重试')
  }
}

// 关闭收益状态弹窗
const handleWalletStatusDialogClose = () => {
  currentUser.value = null
}

// 点击实名状态
const handleAuthClick = (row: AllyListItem) => {
  currentUser.value = row
  authForm.id = row.id
  authForm.name = extractName(row.name)
  authForm.ids_num = row.ids_num || ''
  authForm.alipay = row.alipay || ''
  authForm.aliypayName = row.aliypayName || ''
  authDialogVisible.value = true
}

// 实名信息确认
const handleAuthConfirm = async () => {
  try {
    // 验证
    if (!authForm.name) {
      ElMessage.warning('请输入姓名')
      return
    }
    if (!authForm.ids_num) {
      ElMessage.warning('请输入身份证号')
      return
    }
    if (!authForm.alipay) {
      ElMessage.warning('请输入支付宝账号')
      return
    }
    if (!authForm.aliypayName) {
      ElMessage.warning('请输入支付宝姓名')
      return
    }

    // 构建请求参数
    const params: EditAuthInfoParams = {
      id: authForm.id,
      name: authForm.name,
      ids_num: authForm.ids_num,
      alipay: authForm.alipay,
      aliypayName: authForm.aliypayName
    }

    console.log('修改实名信息参数:', params)

    // 调用接口
    await editAuthInfoApi(params)

    ElMessage.success('修改实名信息成功')
    authDialogVisible.value = false

    // 刷新列表
    getList()
  } catch (error) {
    console.error('修改实名信息失败:', error)
    ElMessage.error('修改实名信息失败，请稍后重试')
  }
}

// 关闭实名信息弹窗
const handleAuthDialogClose = () => {
  currentUser.value = null
  authForm.name = ''
  authForm.ids_num = ''
  authForm.alipay = ''
  authForm.aliypayName = ''
}

// 点击钱包
const handleWalletClick = (row: AllyListItem, walletField: string, walletLabel: string) => {
  currentUser.value = row
  walletTypeLabel.value = walletLabel
  walletForm.id = row.id
  walletForm.wallet = walletField
  walletForm.money = 0
  walletForm.remark = ''

  // 设置当前钱包余额
  const balanceMap: Record<string, string> = {
    wallet1: row.wallet1,
    wallet2: row.wallet2,
    wallet3: row.wallet3
  }
  currentWalletBalance.value = balanceMap[walletField] || '0.00'

  walletDialogVisible.value = true
}

// 钱包操作确认
const handleWalletConfirm = async () => {
  try {
    // 验证
    if (!walletForm.money) {
      ElMessage.warning('请输入操作金额')
      return
    }

    // 构建请求参数
    const params: OperateWalletParams = {
      id: walletForm.id,
      money: Number(walletForm.money),
      remark: walletForm.remark,
      wallet: walletForm.wallet
    }

    console.log('操作钱包参数:', params)

    // 调用接口
    await operateWalletApi(params)

    ElMessage.success('操作钱包成功')
    walletDialogVisible.value = false

    // 刷新列表
    getList()
  } catch (error) {
    console.error('操作钱包失败:', error)
    ElMessage.error('操作钱包失败，请稍后重试')
  }
}

// 关闭钱包操作弹窗
const handleWalletDialogClose = () => {
  currentUser.value = null
  walletForm.money = 0
  walletForm.remark = ''
  walletForm.wallet = ''
  walletTypeLabel.value = ''
  currentWalletBalance.value = '0.00'
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

// 处理运营中心状态变化
const handleOperationCenterChange = async (row: AllyListItem) => {
  try {
    const params: SetOperationCenterParams = {
      ids: row.id
    }
    await setOperationCenterApi(params)
    ElMessage.success('运营中心状态更新成功')
  } catch (error) {
    // 如果失败，恢复原来的状态
    row.is_yyzx = row.is_yyzx === 1 ? 0 : 1
    ElMessage.error('运营中心状态更新失败')
  }
}

// 处理股东状态变化
const handleShareholderChange = async (row: AllyListItem) => {
  try {
    const params: SetShareholderParams = {
      ids: row.id
    }
    await setShareholderApi(params)
    ElMessage.success('股东状态更新成功')
  } catch (error) {
    // 如果失败，恢复原来的状态
    row.is_gd = row.is_gd === 1 ? 0 : 1
    ElMessage.error('股东状态更新失败')
  }
}

// 处理状态变化
const handleStatusChange = async (row: AllyListItem) => {
  try {
    const params: SetUserStatusParams = {
      ids: row.id
    }
    await setUserStatusApi(params)
    ElMessage.success('用户状态更新成功')
  } catch (error) {
    // 如果失败，恢复原来的状态
    row.status = row.status === 1 ? 0 : 1
    ElMessage.error('用户状态更新失败')
  }
}

// 处理提现状态变化
const handleWithdrawChange = async (row: AllyListItem) => {
  try {
    const params: SetWithdrawParams = {
      ids: row.id
    }
    await setWithdrawApi(params)
    ElMessage.success('提现状态更新成功')
  } catch (error) {
    // 如果失败，恢复原来的状态
    row.is_tixian = row.is_tixian === 1 ? 0 : 1
    ElMessage.error('提现状态更新失败')
  }
}

// 导出Excel
const handleExport = () => {
  try {
    if (!tableData.value || tableData.value.length === 0) {
      ElMessage.warning('暂无数据可导出')
      return
    }

    // 定义导出列
    const columns: ExportColumn[] = [
      { key: 'id', title: 'ID' },
      {
        key: 'name',
        title: '姓名',
        formatter: (value) => extractName(value)
      },
      { key: 'user_code', title: '推荐码' },
      { key: 'mobile', title: '手机号' },
      { key: 'level', title: '分润等级' },
      { key: 'p_user', title: '推荐人' },
      {
        key: 'is_auth',
        title: '实名',
        formatter: (value) => extractAuthStatus(value)
      },
      { key: 'alipay', title: '支付宝账号' },
      { key: 'aliypayName', title: '支付宝姓名' },
      { key: 'wallet1', title: '分润钱包' },
      { key: 'wallet2', title: '返现钱包' },
      { key: 'wallet3', title: '流量费钱包' },
      { key: 'forz_acc_amt', title: '冻结金额' },
      { key: 'coin', title: '金币' },
      { key: 'point', title: '积分' },
      {
        key: 'stock',
        title: '机具',
        formatter: (_value, row) => Number(row?.stock || (row?.stocks as unknown[])?.length || 0)
      },
      {
        key: 'status',
        title: '状态',
        formatter: (value) => (value === 1 ? '正常' : '禁用')
      },
      {
        key: 'is_tixian',
        title: '提现',
        formatter: (value) => (value === 1 ? '是' : '否')
      },
      {
        key: 'wallet_status_name',
        title: '收益状态',
        formatter: (value) => value?.replace(/<[^>]*>/g, '').trim() || ''
      },
      {
        key: 'user_type',
        title: '用户类别',
        formatter: (value) => (value === 1 ? '代理' : value === 2 ? '商户' : '全部')
      },
      {
        key: 'level_month',
        title: '等级时效',
        formatter: (value) => value?.replace(/<[^>]*>/g, '').trim() || ''
      },
      {
        key: 'is_yyzx',
        title: '运营中心',
        formatter: (value) => (value === 1 ? '是' : value === 0 ? '否' : '')
      },
      {
        key: 'is_gd',
        title: '股东',
        formatter: (value) => (value === 1 ? '是' : value === 0 ? '否' : '')
      },
      { key: 'create_time', title: '注册时间' }
    ]

    // 执行导出
    exportExcel({
      data: tableData.value,
      columns,
      filename: '盟友列表'
    })

    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败，请稍后重试')
  }
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

      :deep(.el-form-item__content) {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }
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
