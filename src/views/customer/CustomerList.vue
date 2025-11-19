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
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="身份证号">
              <el-input
                v-model="queryParams.ids_num"
                placeholder="请输入身份证号"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="SN">
              <el-input
                v-model="queryParams.sn"
                placeholder="请输入SN号"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

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

    <!-- 操作按钮区域 -->
    <el-card shadow="never" style="margin-top: 10px">
      <div class="toolbar">
        <el-button
          type="success"
          :icon="Select"
          :disabled="selectedRows.length === 0"
          @click="handleBatchEnable"
        >
          启用
        </el-button>
        <el-button
          type="warning"
          :icon="RemoveFilled"
          :disabled="selectedRows.length === 0"
          @click="handleBatchDisable"
        >
          禁用
        </el-button>
      </div>

      <!-- 数据表格 -->
      <template #header>
        <div class="card-header">
          <span class="card-title">客户列表</span>
        </div>
      </template>

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
        <el-table-column prop="id" label="ID" width="80" align="center" fixed="left" />
        <el-table-column prop="mobile" label="手机号" width="130" align="center" fixed="left" />
        <el-table-column prop="name" label="姓名" width="120" align="center" />

        <el-table-column prop="is_auth" label="实名状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.is_auth === 1 ? 'success' : 'info'">
              {{ row.is_auth === 1 ? '已实名' : '未认证' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="ids_num" label="身份证号" width="180" align="center" />

        <el-table-column prop="money" label="余额" width="110" align="center">
          <template #default="{ row }">
            <span style="cursor: pointer; color: #409eff" @click="handleWalletClick(row)">
              ￥{{ row.money }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="point" label="积分" width="100" align="center">
          <template #default="{ row }">
            <span style="cursor: pointer; color: #67c23a" @click="handlePointClick(row)">
              {{ row.point }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="alipay" label="支付宝" width="150" align="center">
          <template #default="{ row }">
            <div v-if="row.alipay">
              <div>{{ row.alipay }}</div>
              <div style="font-size: 12px; color: #999">{{ row.aliypayName }}</div>
            </div>
            <span v-else style="color: #999">-</span>
          </template>
        </el-table-column>

        <el-table-column prop="bank_code" label="银行卡" width="180" align="center">
          <template #default="{ row }">
            <div v-if="row.bank_code">
              <div>{{ row.bank_code }}</div>
              <div style="font-size: 12px; color: #999">{{ row.bank_name }}</div>
            </div>
            <span v-else style="color: #999">-</span>
          </template>
        </el-table-column>

        <el-table-column prop="province" label="地区" width="200" align="center">
          <template #default="{ row }">
            <span v-if="row.province">{{ row.province }} {{ row.city }} {{ row.county }}</span>
            <span v-else style="color: #999">-</span>
          </template>
        </el-table-column>

        <el-table-column prop="idcard_address" label="身份证地址" width="250" align="center">
          <template #default="{ row }">
            <span v-if="row.idcard_address">{{ row.idcard_address }}</span>
            <span v-else style="color: #999">-</span>
          </template>
        </el-table-column>

        <el-table-column prop="sn" label="SN" width="180" align="center">
          <template #default="{ row }">
            <span v-if="row.sn">{{ row.sn }}</span>
            <span v-else style="color: #999">-</span>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="is_tixian" label="提现" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.is_tixian === 1 ? 'success' : 'info'">
              {{ row.is_tixian === 1 ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="create_time" label="注册时间" width="160" align="center" />

        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <div class="table-actions">
              <el-link type="primary" :underline="true" @click="handleViewDetail(row)">
                查看详情
              </el-link>
              <el-link
                v-if="row.status === 0"
                type="success"
                :underline="true"
                @click="handleEnable(row)"
              >
                启用
              </el-link>
              <el-link v-else type="warning" :underline="true" @click="handleDisable(row)">
                禁用
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

    <!-- 客户详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="客户详情"
      width="800px"
      @close="handleDetailDialogClose"
    >
      <el-descriptions v-if="currentCustomer" :column="2" border>
        <el-descriptions-item label="ID">{{ currentCustomer.id }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ currentCustomer.mobile }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ currentCustomer.name }}</el-descriptions-item>
        <el-descriptions-item label="身份证号">
          {{ currentCustomer.ids_num || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="实名状态">
          <el-tag :type="currentCustomer.is_auth === 1 ? 'success' : 'info'">
            {{ currentCustomer.is_auth === 1 ? '已实名' : '未认证' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="认证时间">
          {{ currentCustomer.auth_time ? formatTimestamp(currentCustomer.auth_time) : '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="余额">¥{{ currentCustomer.money }}</el-descriptions-item>
        <el-descriptions-item label="积分">{{ currentCustomer.point }}</el-descriptions-item>
        <el-descriptions-item label="支付宝账号">
          {{ currentCustomer.alipay || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="支付宝姓名">
          {{ currentCustomer.aliypayName || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="银行卡号">
          {{ currentCustomer.bank_code || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="银行名称">
          {{ currentCustomer.bank_name || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="地区" :span="2">
          {{
            currentCustomer.province
              ? `${currentCustomer.province} ${currentCustomer.city} ${currentCustomer.county}`
              : '-'
          }}
        </el-descriptions-item>
        <el-descriptions-item label="身份证地址" :span="2">
          {{ currentCustomer.idcard_address || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="身份证有效期" :span="2">
          {{
            currentCustomer.idcard_start_time && currentCustomer.idcard_end_time
              ? `${currentCustomer.idcard_start_time} 至 ${currentCustomer.idcard_end_time}`
              : '-'
          }}
        </el-descriptions-item>
        <el-descriptions-item label="SN号" :span="2">
          {{ currentCustomer.sn || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentCustomer.status === 1 ? 'success' : 'danger'">
            {{ currentCustomer.status === 1 ? '正常' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="提现">
          <el-tag :type="currentCustomer.is_tixian === 1 ? 'success' : 'info'">
            {{ currentCustomer.is_tixian === 1 ? '是' : '否' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="注册时间" :span="2">
          {{ currentCustomer.create_time }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间" :span="2">
          {{ currentCustomer.update_time }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 身份证照片 -->
      <div
        v-if="currentCustomer && (currentCustomer.positiveImage || currentCustomer.oppositeImage)"
        style="margin-top: 20px"
      >
        <el-divider content-position="left">身份证照片</el-divider>
        <div style="display: flex; gap: 20px; justify-content: center">
          <div v-if="currentCustomer.positiveImage" style="text-align: center">
            <div style="margin-bottom: 8px; font-weight: bold">身份证正面</div>
            <el-image
              :src="currentCustomer.positiveImage"
              style="width: 300px; height: 200px"
              fit="contain"
              :preview-src-list="[currentCustomer.positiveImage]"
            />
          </div>
          <div v-if="currentCustomer.oppositeImage" style="text-align: center">
            <div style="margin-bottom: 8px; font-weight: bold">身份证反面</div>
            <el-image
              :src="currentCustomer.oppositeImage"
              style="width: 300px; height: 200px"
              fit="contain"
              :preview-src-list="[currentCustomer.oppositeImage]"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 钱包操作弹窗 -->
    <el-dialog
      v-model="walletDialogVisible"
      :title="`操作用户${currentCustomer?.name || ''}的钱包余额`"
      width="600px"
      @close="handleWalletDialogClose"
    >
      <div style="color: #e6a23c; margin-bottom: 20px; text-align: center">
        注意：正数为增加余额，负数为扣除余额，请谨慎操作
      </div>

      <el-form :model="walletForm" label-width="100px">
        <el-form-item label="当前余额">
          <div style="font-size: 16px; font-weight: bold; color: #409eff">
            ￥{{ currentCustomer?.money || '0.00' }}
          </div>
        </el-form-item>

        <el-form-item label="操作金额" required>
          <el-input
            v-model.number="walletForm.money"
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

    <!-- 积分操作弹窗 -->
    <el-dialog
      v-model="pointDialogVisible"
      :title="`操作用户${currentCustomer?.name || ''}的积分`"
      width="600px"
      @close="handlePointDialogClose"
    >
      <div style="color: #e6a23c; margin-bottom: 20px; text-align: center">
        注意：正数为增加积分，负数为扣除积分，请谨慎操作
      </div>

      <el-form :model="pointForm" label-width="100px">
        <el-form-item label="当前积分">
          <div style="font-size: 16px; font-weight: bold; color: #67c23a">
            {{ currentCustomer?.point || '0' }}
          </div>
        </el-form-item>

        <el-form-item label="操作积分" required>
          <el-input
            v-model.number="pointForm.money"
            type="number"
            placeholder="正数为增加积分，负数为扣除积分"
            clearable
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            v-model="pointForm.remark"
            type="textarea"
            :rows="3"
            placeholder="备注"
            maxlength="200"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="pointDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePointConfirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh, Download, Select, RemoveFilled } from '@element-plus/icons-vue'
import {
  getCustomerListApi,
  enableCustomerApi,
  disableCustomerApi,
  operateCustomerWalletApi,
  operateCustomerPointApi,
  type CustomerListParams,
  type CustomerListItem,
  type OperateCustomerWalletParams,
  type OperateCustomerPointParams
} from '@/api/customer'
import { exportExcel, type ExportColumn } from '@/utils/export'
import { ElMessageBox } from 'element-plus'

// 查询参数
const queryParams = reactive<CustomerListParams>({
  // ...
  page: 1,
  limit: 15,
  mobile: '',
  name: '',
  ids_num: '',
  sn: ''
})

// 表格数据
const tableData = ref<CustomerListItem[]>([])
const total = ref(0)
const loading = ref(false)

// 选中的行
const selectedRows = ref<CustomerListItem[]>([])

// 客户详情弹窗
const detailDialogVisible = ref(false)
const currentCustomer = ref<CustomerListItem | null>(null)

// 钱包操作弹窗
const walletDialogVisible = ref(false)
const walletForm = reactive<any>({
  id: 0,
  money: '',
  remark: ''
})

// 积分操作弹窗
const pointDialogVisible = ref(false)
const pointForm = reactive<any>({
  id: 0,
  money: '',
  remark: ''
})

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const res = await getCustomerListApi(queryParams)
    console.log('客户列表响应:', res)

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
  queryParams.mobile = ''
  queryParams.name = ''
  queryParams.ids_num = ''
  queryParams.sn = ''
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
const handleViewDetail = (row: CustomerListItem) => {
  currentCustomer.value = row
  detailDialogVisible.value = true
}

// 关闭详情弹窗
const handleDetailDialogClose = () => {
  currentCustomer.value = null
}

// 点击钱包（余额）
const handleWalletClick = (row: CustomerListItem) => {
  currentCustomer.value = row
  walletForm.id = row.id
  walletForm.money = '' // 操作金额初始为空
  walletForm.remark = ''
  walletDialogVisible.value = true
}

// 钱包操作确认
const handleWalletConfirm = async () => {
  try {
    // 验证
    if (walletForm.money === '' || walletForm.money === null || walletForm.money === undefined) {
      ElMessage.warning('请输入操作金额')
      return
    }

    const moneyValue = Number(walletForm.money)
    if (isNaN(moneyValue)) {
      ElMessage.warning('请输入有效的数字')
      return
    }

    // 构建请求参数
    const params: OperateCustomerWalletParams = {
      id: walletForm.id,
      money: moneyValue,
      remark: walletForm.remark
    }

    console.log('操作钱包参数:', params)

    // 调用接口
    const res = await operateCustomerWalletApi(params)

    if (res.code === 1) {
      ElMessage.success(res.msg || '操作钱包成功')
      walletDialogVisible.value = false

      // 刷新列表
      await getList()
    } else {
      ElMessage.error(res.msg || '操作钱包失败')
    }
  } catch (error) {
    console.error('操作钱包失败:', error)
    ElMessage.error('操作钱包失败，请稍后重试')
  }
}

// 关闭钱包操作弹窗
const handleWalletDialogClose = () => {
  currentCustomer.value = null
  walletForm.money = ''
  walletForm.remark = ''
}

// 点击积分
const handlePointClick = (row: CustomerListItem) => {
  currentCustomer.value = row
  pointForm.id = row.id
  pointForm.money = '' // 操作积分初始为空
  pointForm.remark = ''
  pointDialogVisible.value = true
}

// 积分操作确认
const handlePointConfirm = async () => {
  try {
    // 验证
    if (pointForm.money === '' || pointForm.money === null || pointForm.money === undefined) {
      ElMessage.warning('请输入积分')
      return
    }

    const moneyValue = Number(pointForm.money)
    if (isNaN(moneyValue)) {
      ElMessage.warning('请输入有效的数字')
      return
    }

    // 构建请求参数
    const params: OperateCustomerPointParams = {
      id: pointForm.id,
      money: moneyValue,
      remark: pointForm.remark
    }

    console.log('操作积分参数:', params)

    // 调用接口
    const res = await operateCustomerPointApi(params)

    if (res.code === 1) {
      ElMessage.success(res.msg || '操作积分成功')
      pointDialogVisible.value = false

      // 刷新列表
      await getList()
    } else {
      ElMessage.error(res.msg || '操作积分失败')
    }
  } catch (error) {
    console.error('操作积分失败:', error)
    ElMessage.error('操作积分失败，请稍后重试')
  }
}

// 关闭积分操作弹窗
const handlePointDialogClose = () => {
  currentCustomer.value = null
  pointForm.money = ''
  pointForm.remark = ''
}

// 格式化时间戳
const formatTimestamp = (timestamp: number): string => {
  if (!timestamp) return '-'
  const date = new Date(timestamp * 1000)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
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
      { key: 'mobile', title: '手机号' },
      { key: 'name', title: '姓名' },
      {
        key: 'is_auth',
        title: '实名状态',
        formatter: (value) => (value === 1 ? '已实名' : '未认证')
      },
      { key: 'ids_num', title: '身份证号' },
      { key: 'money', title: '余额' },
      { key: 'point', title: '积分' },
      { key: 'alipay', title: '支付宝账号' },
      { key: 'aliypayName', title: '支付宝姓名' },
      { key: 'bank_code', title: '银行卡号' },
      { key: 'bank_name', title: '银行名称' },
      {
        key: 'province',
        title: '地区',
        formatter: (_value, row) =>
          row?.province ? `${row.province} ${row.city} ${row.county}` : '-'
      },
      { key: 'idcard_address', title: '身份证地址' },
      { key: 'sn', title: 'SN号' },
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
      { key: 'create_time', title: '注册时间' }
    ]

    // 执行导出
    exportExcel({
      data: tableData.value,
      columns,
      filename: '客户列表'
    })

    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败，请稍后重试')
  }
}

// 处理选择变化
const handleSelectionChange = (selection: CustomerListItem[]) => {
  selectedRows.value = selection
}

// 启用单个客户
const handleEnable = async (row: CustomerListItem) => {
  try {
    await ElMessageBox.confirm(`确定要启用客户 ${row.name}(${row.mobile}) 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const jsonData = JSON.stringify([row])
    const res = await enableCustomerApi({ jsonData })

    if (res.code === 1) {
      ElMessage.success(res.msg || '启用成功')
      await getList()
    } else {
      ElMessage.error(res.msg || '启用失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('启用失败:', error)
      ElMessage.error('启用失败，请稍后重试')
    }
  }
}

// 禁用单个客户
const handleDisable = async (row: CustomerListItem) => {
  try {
    await ElMessageBox.confirm(`确定要禁用客户 ${row.name}(${row.mobile}) 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const jsonData = JSON.stringify([row])
    const res = await disableCustomerApi({ jsonData })

    if (res.code === 1) {
      ElMessage.success(res.msg || '禁用成功')
      await getList()
    } else {
      ElMessage.error(res.msg || '禁用失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('禁用失败:', error)
      ElMessage.error('禁用失败，请稍后重试')
    }
  }
}

// 批量启用
const handleBatchEnable = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要启用的客户')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要启用选中的 ${selectedRows.value.length} 个客户吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const jsonData = JSON.stringify(selectedRows.value)
    const res = await enableCustomerApi({ jsonData })

    if (res.code === 1) {
      ElMessage.success(res.msg || '批量启用成功')
      selectedRows.value = []
      await getList()
    } else {
      ElMessage.error(res.msg || '批量启用失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量启用失败:', error)
      ElMessage.error('批量启用失败，请稍后重试')
    }
  }
}

// 批量禁用
const handleBatchDisable = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要禁用的客户')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要禁用选中的 ${selectedRows.value.length} 个客户吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const jsonData = JSON.stringify(selectedRows.value)
    const res = await disableCustomerApi({ jsonData })

    if (res.code === 1) {
      ElMessage.success(res.msg || '批量禁用成功')
      selectedRows.value = []
      await getList()
    } else {
      ElMessage.error(res.msg || '批量禁用失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量禁用失败:', error)
      ElMessage.error('批量禁用失败，请稍后重试')
    }
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

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .card-title {
      font-size: 16px;
      font-weight: bold;
    }
  }

  .toolbar {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
  }

  .table-actions {
    display: flex;
    justify-content: center;
    gap: 10px;
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
