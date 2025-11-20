<template>
  <div class="merchant-list-container">
    <!-- 筛选条件 -->
    <el-card shadow="never" class="filter-card">
      <el-form :model="filterForm" label-width="80px" class="filter-form">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="产品">
              <el-select
                v-model="filterForm.platform_id"
                placeholder="请选择平台"
                clearable
                filterable
                @change="handlePlatformChange"
              >
                <el-option
                  v-for="item in platformList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="">
              <el-select
                v-model="filterForm.product_id"
                placeholder="请选择产品"
                clearable
                filterable
                :disabled="!filterForm.platform_id || productList.length === 0"
              >
                <el-option
                  v-for="item in productList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="模式">
              <el-select v-model="filterForm.sys_type" placeholder="全部" clearable>
                <el-option label="全部" value="" />
                <el-option label="1.0模式" value="1" />
                <el-option label="2.0模式" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="商户编号">
              <el-input
                v-model="filterForm.merchant_code"
                placeholder="请输入商户编号"
                clearable
                @keyup.enter="handleSearch"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="商户名称">
              <el-input
                v-model="filterForm.merchant_name"
                placeholder="请输入商户名称"
                clearable
                @keyup.enter="handleSearch"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="sn号">
              <el-input
                v-model="filterForm.sn"
                placeholder="请输入sn号"
                clearable
                @keyup.enter="handleSearch"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="状态">
              <el-select v-model="filterForm.status" placeholder="全部" clearable>
                <el-option label="全部" value="" />
                <el-option label="未激活" value="1" />
                <el-option label="已激活" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="商户时间">
              <el-date-picker
                v-model="merTimeRange"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-form-item label=" " class="filter-actions">
              <div class="action-buttons">
                <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
                <el-button :icon="Refresh" @click="handleReset">重置</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card shadow="never" class="table-card">
      <el-table v-loading="loading" :data="tableData" border stripe>
        <el-table-column type="index" label="ID" width="60" align="center" />
        <el-table-column prop="sys_type_name" label="模式" width="100" align="center" />
        <el-table-column prop="platform_id" label="平台" width="120" align="center" />
        <el-table-column prop="product_id" label="产品" width="120" align="center" />
        <el-table-column prop="m_type_name" label="类型" width="80" align="center" />
        <el-table-column prop="user_name" label="盟友姓名" width="100" align="center" />
        <el-table-column prop="user_mobile" label="盟友手机" width="120" align="center" />
        <el-table-column prop="merchant_code" label="商户编号" width="180" align="center" />
        <el-table-column prop="sn" label="sn号" width="180" align="center" />
        <el-table-column prop="merchant_name" label="商户姓名" width="120" align="center" />
        <el-table-column prop="mer_time" label="商户时间" width="160" align="center" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <span v-html="row.status_name"></span>
          </template>
        </el-table-column>
        <el-table-column prop="last_jiaoyi_time" label="上次交易" width="160" align="center" />
        <el-table-column prop="cm_days" label="已沉默(天)" width="100" align="center" />
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <div class="table-actions">
              <el-link type="success" :underline="true" @click="handleUnbind(row)">解绑</el-link>
              <el-link type="warning" :underline="true" @click="handleTransfer(row)">
                商户转移
              </el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.limit"
        :total="pagination.total"
        :page-sizes="[15, 30, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <!-- 商户转移对话框 -->
    <el-dialog
      v-model="transferDialogVisible"
      title="商户转移终字"
      width="900px"
      :close-on-click-modal="false"
    >
      <!-- 搜索条件 -->
      <el-form :inline="true" :model="transferSearch" class="transfer-search">
        <el-form-item label="姓名">
          <el-input
            v-model="transferSearch.name"
            placeholder="请输入姓名"
            clearable
            @keyup.enter="handleTransferSearch"
          />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model="transferSearch.mobile"
            placeholder="请输入手机号"
            clearable
            @keyup.enter="handleTransferSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleTransferSearch">查询</el-button>
        </el-form-item>
      </el-form>

      <!-- 盟友列表 -->
      <el-table
        v-loading="transferLoading"
        :data="transferUserList"
        border
        highlight-current-row
        :row-class-name="getRowClassName"
        @current-change="handleUserSelect"
      >
        <el-table-column type="index" label="#" width="60" align="center" />
        <el-table-column label="姓名" min-width="150" align="center">
          <template #default="{ row }">
            <div class="user-info">
              <el-avatar :src="row.headimg" :size="30" />
              <span class="user-name-text">{{ extractName(row.name) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" width="150" align="center" />
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="transferPagination.page"
        v-model:page-size="transferPagination.limit"
        :total="transferPagination.total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        class="transfer-pagination"
        @size-change="handleTransferSizeChange"
        @current-change="handleTransferCurrentChange"
      />

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="transferDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmTransfer">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import {
  getMerchantListApi,
  getTransferUserListApi,
  transferMerchantApi,
  unbindMerchantApi,
  type MerchantItem,
  type MerchantListParams,
  type TransferUserItem
} from '@/api/merchant'
import { getChildProductApi } from '@/api/user'
import { PRODUCT_OPTIONS } from '@/constants'

// 筛选表单
const filterForm = reactive({
  platform_id: '',
  product_id: '',
  sys_type: '',
  merchant_code: '',
  merchant_name: '',
  sn: '',
  status: ''
})

// 商户时间范围
const merTimeRange = ref<[string, string] | null>(null)

// 平台列表（代理产品）
const platformList = ref(PRODUCT_OPTIONS)
// 子产品列表
const productList = ref<Array<{ label: string; value: string }>>([])

// 表格数据
const tableData = ref<MerchantItem[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  limit: 15,
  total: 0
})

// 获取子产品列表
const getChildProducts = async (platformId: number | string) => {
  try {
    const res = await getChildProductApi({ pid: Number(platformId) })
    if (res.code === 0 && res.data) {
      // data 是一个对象 {id: name}，需要转换为数组
      productList.value = Object.entries(res.data).map(([id, name]) => ({
        label: name,
        value: id
      }))
    }
  } catch (error) {
    console.error('获取子产品失败:', error)
    productList.value = []
  }
}

// 平台改变时获取产品列表
const handlePlatformChange = async (platformId: string) => {
  filterForm.product_id = ''
  productList.value = []

  if (platformId) {
    await getChildProducts(platformId)
  }
}

// 获取商户列表
const getMerchantList = async () => {
  loading.value = true
  try {
    const params: MerchantListParams = {
      page: pagination.page,
      limit: pagination.limit,
      ...filterForm
    }

    // 处理时间范围
    if (merTimeRange.value && merTimeRange.value.length === 2) {
      params.mer_time = `${merTimeRange.value[0]} - ${merTimeRange.value[1]}`
    }

    const res = await getMerchantListApi(params)
    if (res.code === 0) {
      tableData.value = res.data
      pagination.total = res.count
    }
  } catch (error) {
    ElMessage.error('获取商户列表失败')
  } finally {
    loading.value = false
  }
}

// 查询
const handleSearch = () => {
  pagination.page = 1
  getMerchantList()
}

// 重置
const handleReset = () => {
  Object.assign(filterForm, {
    platform_id: '',
    product_id: '',
    sys_type: '',
    merchant_code: '',
    merchant_name: '',
    sn: '',
    status: ''
  })
  merTimeRange.value = null
  productList.value = []
  handleSearch()
}

// 分页大小改变
const handleSizeChange = () => {
  pagination.page = 1
  getMerchantList()
}

// 当前页改变
const handleCurrentChange = () => {
  getMerchantList()
}

// 商户转移相关
const transferDialogVisible = ref(false)
const transferLoading = ref(false)
const currentMerchant = ref<MerchantItem | null>(null)
const selectedUser = ref<TransferUserItem | null>(null)

// 转移搜索条件
const transferSearch = reactive({
  name: '',
  mobile: ''
})

// 盟友列表
const transferUserList = ref<TransferUserItem[]>([])

// 转移分页
const transferPagination = reactive({
  page: 1,
  limit: 10,
  total: 0
})

// 获取盟友列表
const getTransferUserList = async () => {
  transferLoading.value = true
  try {
    const res = await getTransferUserListApi({
      page: transferPagination.page,
      limit: transferPagination.limit,
      name: transferSearch.name,
      mobile: transferSearch.mobile
    })
    if (res.code === 0) {
      transferUserList.value = res.data
      transferPagination.total = res.count
    }
  } catch (error) {
    ElMessage.error('获取盟友列表失败')
  } finally {
    transferLoading.value = false
  }
}

// 打开商户转移对话框
const handleTransfer = (row: MerchantItem) => {
  currentMerchant.value = row
  selectedUser.value = null
  transferSearch.name = ''
  transferSearch.mobile = ''
  transferPagination.page = 1
  transferDialogVisible.value = true
  getTransferUserList()
}

// 转移搜索
const handleTransferSearch = () => {
  transferPagination.page = 1
  getTransferUserList()
}

// 转移分页大小改变
const handleTransferSizeChange = () => {
  transferPagination.page = 1
  getTransferUserList()
}

// 转移当前页改变
const handleTransferCurrentChange = () => {
  getTransferUserList()
}

// 选择盟友
const handleUserSelect = (row: TransferUserItem | null) => {
  // 如果点击的是已选中的行，则取消选中
  if (selectedUser.value && row && selectedUser.value.id === row.id) {
    selectedUser.value = null
  } else {
    selectedUser.value = row
  }
}

// 提取姓名（去除HTML标签）
const extractName = (htmlName: string) => {
  if (!htmlName) return ''
  // 使用正则提取 > 后面的文本内容
  const match = htmlName.match(/>([^<]+)$/)
  return match ? match[1].trim() : htmlName
}

// 获取行样式类名
const getRowClassName = ({ row }: { row: TransferUserItem }) => {
  return selectedUser.value && selectedUser.value.id === row.id ? 'selected-row' : ''
}

// 确认转移
const handleConfirmTransfer = async () => {
  if (!selectedUser.value) {
    ElMessage.warning('请选择要转移的盟友')
    return
  }

  if (!currentMerchant.value) {
    ElMessage.error('商户信息丢失')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确认要将商户 ${currentMerchant.value.merchant_name} 转移给 ${extractName(selectedUser.value.name)} 吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const res = await transferMerchantApi({
      id: currentMerchant.value.id,
      user_id: selectedUser.value.id
    })

    if (res.code === 1) {
      ElMessage.success('转移成功')
      transferDialogVisible.value = false
      getMerchantList()
    } else {
      ElMessage.error(res.msg || '转移失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('转移失败')
    }
  }
}

// 解绑
const handleUnbind = async (row: MerchantItem) => {
  try {
    await ElMessageBox.confirm(
      `确认要解绑商户 ${row.merchant_name || row.merchant_code} 吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const res = await unbindMerchantApi({
      id: row.id
    })

    if (res.code === 1) {
      ElMessage.success(res.msg || '解绑成功')
      getMerchantList()
    } else {
      ElMessage.error(res.msg || '解绑失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('解绑失败')
    }
  }
}

onMounted(() => {
  getMerchantList()
})
</script>

<style scoped lang="scss">
.merchant-list-container {
  padding: 20px;

  .filter-card {
    margin-bottom: 20px;

    .filter-form {
      :deep(.el-form-item) {
        margin-bottom: 16px;
        width: 100%;

        .el-input,
        .el-select,
        .el-date-editor {
          width: 100%;
        }
      }

      .filter-actions {
        margin-bottom: 0;

        :deep(.el-form-item__content) {
          width: 100%;
        }

        .action-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          flex-wrap: wrap;
          width: 100%;
        }
      }
    }
  }

  .table-card {
    .table-actions {
      display: flex;
      justify-content: center;
      gap: 12px;
    }

    .pagination {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
}

// 商户转移对话框样式
.transfer-search {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;

  :deep(.el-form-item) {
    margin-bottom: 0;
  }
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  .user-name-text {
    font-size: 14px;
    color: #606266;
  }
}

// 选中行样式
:deep(.selected-row) {
  background-color: #ecf5ff !important;

  td {
    background-color: #ecf5ff !important;
  }

  .user-info .user-name-text {
    color: #409eff !important;
    font-weight: 500;
  }

  &:hover > td {
    background-color: #d9ecff !important;
  }
}

// 覆盖 Element Plus 默认的当前行高亮样式
:deep(.el-table__body tr.current-row > td) {
  background-color: transparent !important;
}

.transfer-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
