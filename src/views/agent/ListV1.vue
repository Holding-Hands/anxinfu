<template>
  <div class="page-container">
    <el-card class="filter-card" shadow="never">
      <!-- 筛选表单 -->
      <el-form :model="queryParams" label-width="100px" class="filter-form">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="产品">
              <el-select
                v-model="queryParams.platform_id"
                placeholder="请选择平台"
                clearable
                filterable
                @change="handleQuery"
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

          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="选择样">
              <el-select
                v-model="queryParams.product_id"
                placeholder="请选择样"
                clearable
                filterable
                @change="handleQuery"
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
            <el-form-item label="团队长手机号">
              <el-input
                v-model="queryParams.tdz_mobile"
                placeholder="请输入团队长手机号"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="18">
            <el-form-item label=" " class="filter-actions">
              <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 导出按钮 -->
    <el-button type="success" style="margin-bottom: 20px" @click="handleExport">
      导出Excel
    </el-button>

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
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="id" label="ID" min-width="80" align="center" />

        <el-table-column prop="uName" label="姓名" min-width="120" align="center" />

        <el-table-column prop="uMobile" label="电话" min-width="150" align="center" />

        <el-table-column prop="pnums" label="第N代" min-width="100" align="center" />

        <el-table-column prop="pName" label="产品名称" min-width="150" align="center" />

        <el-table-column prop="code_price" label="扫码结算价" min-width="120" align="center">
          <template #default="{ row }">
            {{ formatNumber(row.code_price) }}
          </template>
        </el-table-column>

        <el-table-column prop="card_price" label="刷卡结算价" min-width="120" align="center">
          <template #default="{ row }">
            {{ formatNumber(row.card_price) }}
          </template>
        </el-table-column>

        <el-table-column prop="rise_price" label="上流结算价(万)" min-width="140" align="center">
          <template #default="{ row }">
            <span
              style="color: #409eff; cursor: pointer; text-decoration: underline"
              @click="handleEditPrice(row)"
            >
              {{ formatNumber(row.rise_price) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="tjfc_percent" label="调价分成%" min-width="120" align="center">
          <template #default="{ row }">
            <span
              style="color: #e6a23c; cursor: pointer; text-decoration: underline"
              @click="handleEditTjfcPercent(row)"
            >
              {{ formatNumber(row.tjfc_percent) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="first_money" label="一次达标" min-width="120" align="center">
          <template #default="{ row }">
            {{ formatNumber(row.first_money) }}
          </template>
        </el-table-column>

        <el-table-column prop="second_money" label="二次达标" min-width="120" align="center">
          <template #default="{ row }">
            {{ formatNumber(row.second_money) }}
          </template>
        </el-table-column>

        <el-table-column prop="third_money" label="三次达标" min-width="120" align="center">
          <template #default="{ row }">
            {{ formatNumber(row.third_money) }}
          </template>
        </el-table-column>

        <el-table-column prop="create_time" label="创建时间" min-width="180" align="center" />

        <el-table-column label="操作" min-width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="handleEdit(row)">编辑</el-button>
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

    <!-- 编辑上流结算价弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="请输入涨价数值（万0-3之间），同时设置整个团队"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-input
        v-model="editForm.number"
        type="number"
        placeholder="请输入涨价数值"
        :min="0"
        :max="3"
        step="0.01"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitEdit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑调价分成弹窗 -->
    <el-dialog
      v-model="tjfcDialogVisible"
      title="请输入调价分成%（0-100之间）"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-input
        v-model="tjfcEditForm.number"
        type="number"
        placeholder="请输入调价分成%"
        :min="0"
        :max="100"
        step="0.01"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="tjfcDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitTjfcEdit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑用户结算价弹窗 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑结算价"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="editUserForm" label-width="120px">
        <el-form-item label="姓名：">
          <el-input v-model="editUserForm.uName" disabled />
        </el-form-item>

        <el-form-item label="电话：">
          <el-input v-model="editUserForm.uMobile" disabled />
        </el-form-item>

        <el-form-item label="产品：">
          <el-input v-model="editUserForm.pName" disabled />
        </el-form-item>

        <el-form-item label="扫码结算价：" required>
          <el-input v-model="editUserForm.code_price" type="number" step="0.01" />
          <div style="color: #999; font-size: 12px; margin-top: 5px">
            例：[ 0.2-0.39 ] 修改0.22%，请填写0.22
          </div>
        </el-form-item>

        <el-form-item label="刷卡结算价：" required>
          <el-input v-model="editUserForm.card_price" type="number" step="0.01" />
          <div style="color: #999; font-size: 12px; margin-top: 5px">
            例：[ 0.5-0.65 ] 修改0.52%，请填写0.52
          </div>
        </el-form-item>

        <el-form-item label="流量费：">
          <el-input v-model="editUserForm.liu_percent" type="number" step="0.01" />
          <div style="color: #999; font-size: 12px; margin-top: 5px">单位：元</div>
        </el-form-item>

        <el-form-item label="一次达标奖：">
          <el-input v-model="editUserForm.first_money" type="number" step="0.01" />
        </el-form-item>

        <el-form-item label="二次达标奖：">
          <el-input v-model="editUserForm.second_money" type="number" step="0.01" />
        </el-form-item>

        <el-form-item label="三次达标奖：">
          <el-input v-model="editUserForm.third_money" type="number" step="0.01" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitUserEdit">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import {
  getUserSettleListApi,
  editSettlePriceApi,
  editTjfcPercentApi,
  editUserSettleApi,
  type UserSettleListParams,
  type UserSettleListItem
} from '@/api/user'
import { PRODUCT_OPTIONS } from '@/constants'
import { exportExcel } from '@/utils/export'

// 查询参数
const queryParams = reactive<UserSettleListParams>({
  page: 1,
  limit: 15,
  platform_id: '',
  product_id: '',
  name: '',
  mobile: '',
  tdz_mobile: ''
})

// 表格数据
const tableData = ref<UserSettleListItem[]>([])
const total = ref(0)
const loading = ref(false)

// 编辑上流结算价弹窗
const dialogVisible = ref(false)
const editForm = reactive({
  id: 0,
  number: 0
})

// 编辑调价分成弹窗
const tjfcDialogVisible = ref(false)
const tjfcEditForm = reactive({
  id: 0,
  number: 0
})

// 编辑用户结算价弹窗
const editDialogVisible = ref(false)
const editUserForm = reactive({
  id: 0,
  uName: '',
  uMobile: '',
  pName: '',
  code_price: '',
  card_price: '',
  liu_percent: '',
  first_money: '',
  second_money: '',
  third_money: ''
})

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const res = await getUserSettleListApi(queryParams)
    console.log('1.0盟友结算价列表响应:', res)
    console.log('数据示例:', res.data?.[0])

    // 根据实际返回的数据结构处理
    const rawData = res.data || []
    // 过滤掉无效数据
    tableData.value = rawData.filter((item: UserSettleListItem) => item && item.id)
    total.value = res.count || res.total || 0
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

// 格式化数字
const formatNumber = (value: string | number): string => {
  if (value === null || value === undefined || value === '') return '0.00'
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '0.00'
  return num.toFixed(2)
}

// 编辑
const handleEdit = (row: UserSettleListItem) => {
  // 填充表单数据
  editUserForm.id = row.id
  editUserForm.uName = row.uName
  editUserForm.uMobile = row.uMobile
  editUserForm.pName = row.pName
  editUserForm.code_price = row.code_price
  editUserForm.card_price = row.card_price
  editUserForm.liu_percent = row.liu_percent
  editUserForm.first_money = row.first_money
  editUserForm.second_money = row.second_money
  editUserForm.third_money = row.third_money

  // 打开弹窗
  editDialogVisible.value = true
}

// 点击上流结算价进行编辑
const handleEditPrice = (row: UserSettleListItem) => {
  editForm.id = row.id
  editForm.number = parseFloat(row.rise_price) || 0
  dialogVisible.value = true
}

// 提交编辑上流结算价
const handleSubmitEdit = async () => {
  if (editForm.number < 0 || editForm.number > 3) {
    ElMessage.warning('涨价数值必须在0-3之间')
    return
  }

  try {
    const res = await editSettlePriceApi({
      id: editForm.id,
      number: editForm.number
    })

    // 响应拦截器已经处理了错误情况，能执行到这里说明请求成功
    console.log('编辑上流结算价响应:', res)
    ElMessage.success(res.msg || '设置成功')
    dialogVisible.value = false
    // 刷新列表
    await getList()
  } catch (error) {
    console.error('编辑失败:', error)
    // 错误已由拦截器处理，这里不需要再次提示
  }
}

// 提交编辑用户结算价
const handleSubmitUserEdit = async () => {
  // 验证必填字段
  if (!editUserForm.code_price || !editUserForm.card_price) {
    ElMessage.warning('扫码结算价和刷卡结算价为必填项')
    return
  }

  try {
    const res = await editUserSettleApi({
      id: editUserForm.id,
      code_price: editUserForm.code_price,
      card_price: editUserForm.card_price,
      liu_percent: editUserForm.liu_percent || '0',
      first_money: editUserForm.first_money || '0',
      second_money: editUserForm.second_money || '0',
      third_money: editUserForm.third_money || '0'
    })

    // 响应拦截器已经处理了错误情况，能执行到这里说明请求成功
    console.log('编辑用户结算价响应:', res)
    ElMessage.success(res.msg || '提交成功')
    editDialogVisible.value = false
    // 刷新列表
    await getList()
  } catch (error) {
    console.error('提交失败:', error)
    // 错误已由拦截器处理，这里不需要再次提示
  }
}

// 点击调价分成进行编辑
const handleEditTjfcPercent = (row: UserSettleListItem) => {
  tjfcEditForm.id = row.id
  tjfcEditForm.number = row.tjfc_percent || 0
  tjfcDialogVisible.value = true
}

// 提交编辑调价分成
const handleSubmitTjfcEdit = async () => {
  if (tjfcEditForm.number < 0 || tjfcEditForm.number > 100) {
    ElMessage.warning('调价分成%必须在0-100之间')
    return
  }

  try {
    const res = await editTjfcPercentApi({
      id: tjfcEditForm.id,
      number: tjfcEditForm.number
    })

    // 响应拦截器已经处理了错误情况，能执行到这里说明请求成功
    console.log('编辑调价分成响应:', res)
    ElMessage.success(res.msg || '设置成功')
    tjfcDialogVisible.value = false
    // 刷新列表
    await getList()
  } catch (error) {
    console.error('编辑失败:', error)
    // 错误已由拦截器处理，这里不需要再次提示
  }
}

// 导出Excel
const handleExport = () => {
  if (tableData.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'uName', title: '姓名' },
    { key: 'uMobile', title: '电话' },
    { key: 'pnums', title: '第N代' },
    { key: 'pName', title: '产品名称' },
    { key: 'code_price', title: '扫码结算价' },
    { key: 'card_price', title: '刷卡结算价' },
    { key: 'rise_price', title: '上流结算价(万)' },
    { key: 'tjfc_percent', title: '调价分成%' },
    { key: 'first_money', title: '一次达标' },
    { key: 'second_money', title: '二次达标' },
    { key: 'third_money', title: '三次达标' },
    { key: 'create_time', title: '创建时间' }
  ]

  exportExcel({
    data: tableData.value,
    columns,
    filename: '1.0盟友结算价列表'
  })
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
