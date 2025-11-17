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

          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="请选择">
              <el-select
                v-model="queryParams.product_id"
                placeholder="请选择"
                clearable
                filterable
                :disabled="!queryParams.platform_id || childProductOptions.length === 0"
                @change="handleQuery"
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

          <el-col :xs="24" :sm="12" :md="8" :lg="5">
            <el-form-item label="姓名">
              <el-input
                v-model="queryParams.name"
                placeholder="请输入姓名"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="5">
            <el-form-item label="手机号">
              <el-input
                v-model="queryParams.mobile"
                placeholder="请输入手机号"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="2">
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

        <el-table-column prop="pName" label="产品名称" min-width="150" align="center" />

        <el-table-column prop="sim_money" label="流量费" min-width="120" align="center">
          <template #default="{ row }">
            {{ formatNumber(row.sim_money) }}
          </template>
        </el-table-column>

        <el-table-column prop="u_sim_money" label="首年流量费" min-width="120" align="center">
          <template #default="{ row }">
            {{ formatNumber(row.u_sim_money) }}
          </template>
        </el-table-column>

        <el-table-column prop="u_sim_money2" label="次年流量费" min-width="120" align="center">
          <template #default="{ row }">
            {{ formatNumber(row.u_sim_money2) }}
          </template>
        </el-table-column>

        <el-table-column prop="create_time" label="创建时间" min-width="180" align="center" />

        <el-table-column label="操作" min-width="100" align="center" fixed="right">
          <template #default="{ row }">
            <div class="table-actions">
              <el-link type="primary" :underline="true" @click="handleEdit(row)">编辑</el-link>
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

    <!-- 编辑流量费政策弹窗 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑流量费政策"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="editForm" label-width="120px">
        <el-form-item label="姓名：">
          <el-input v-model="editForm.uName" disabled />
        </el-form-item>

        <el-form-item label="电话：">
          <el-input v-model="editForm.uMobile" disabled />
        </el-form-item>

        <el-form-item label="产品：">
          <el-input v-model="editForm.pName" disabled />
        </el-form-item>

        <el-form-item label="流量费：" required>
          <el-input v-model="editForm.p_sim_money" type="number" step="0.01" />
          <div style="color: #999; font-size: 12px; margin-top: 5px">例：69元填69</div>
        </el-form-item>

        <el-form-item label="首年流量费：">
          <el-input v-model="editForm.sim_money" type="number" step="0.01" />
          <div style="color: #999; font-size: 12px; margin-top: 5px">元，例：53.0元填53.0</div>
        </el-form-item>

        <el-form-item label="次年流量费：">
          <el-input v-model="editForm.sim_money2" type="number" step="0.01" />
          <div style="color: #999; font-size: 12px; margin-top: 5px">元，例：0元填0</div>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitEdit">提交</el-button>
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
  getUserSimListApi,
  editUserSimApi,
  getChildProductApi,
  type UserSimListParams,
  type UserSimListItem
} from '@/api/user'
import { PRODUCT_OPTIONS } from '@/constants'
import { exportExcel } from '@/utils/export'

// 查询参数
const queryParams = reactive<UserSimListParams>({
  page: 1,
  limit: 15,
  platform_id: '',
  product_id: '',
  name: '',
  mobile: ''
})

// 表格数据
const tableData = ref<UserSimListItem[]>([])
const total = ref(0)
const loading = ref(false)

// 子产品选项
const childProductOptions = ref<Array<{ label: string; value: number }>>([])
const loadingChildProducts = ref(false)

// 编辑流量费政策弹窗
const editDialogVisible = ref(false)
const editForm = reactive({
  id: 0,
  uName: '',
  uMobile: '',
  pName: '',
  p_sim_money: '', // 档位
  sim_money: '', // 首年流量费
  sim_money2: '' // 次年流量费
})

// 获取子产品列表
const getChildProducts = async (platformId: number | string) => {
  if (!platformId) {
    childProductOptions.value = []
    return
  }

  loadingChildProducts.value = true
  try {
    const res = await getChildProductApi({ pid: Number(platformId) })
    console.log('子产品响应:', res)

    // 将返回的数据对象转换为选项数组
    const options: Array<{ label: string; value: number }> = []
    if (res.data) {
      Object.entries(res.data).forEach(([key, value]) => {
        options.push({
          value: Number(key),
          label: value
        })
      })
    }
    childProductOptions.value = options
  } catch (error) {
    console.error('获取子产品失败:', error)
    childProductOptions.value = []
  } finally {
    loadingChildProducts.value = false
  }
}

// 处理产品（平台）变化
const handlePlatformChange = async (value: number | string) => {
  // 清空子产品选择
  queryParams.product_id = ''
  childProductOptions.value = []

  // 如果选择了产品，获取子产品列表
  if (value) {
    await getChildProducts(value)
  }

  // 查询列表
  handleQuery()
}

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const res = await getUserSimListApi(queryParams)
    console.log('代理流量费政策列表响应:', res)
    console.log('数据示例:', res.data?.[0])

    // 根据实际返回的数据结构处理
    const rawData = res.data || []
    // 过滤掉无效数据
    tableData.value = rawData.filter((item: UserSimListItem) => item && item.id)
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
const handleEdit = (row: UserSimListItem) => {
  // 填充表单数据
  editForm.id = row.id
  editForm.uName = row.uName
  editForm.uMobile = row.uMobile
  editForm.pName = row.pName
  editForm.p_sim_money = String(row.sim_money) // 流量费
  editForm.sim_money = row.u_sim_money // 首年流量费
  editForm.sim_money2 = row.u_sim_money2 // 次年流量费

  // 打开弹窗
  editDialogVisible.value = true
}

// 提交编辑流量费政策
const handleSubmitEdit = async () => {
  // 验证必填字段
  if (!editForm.p_sim_money) {
    ElMessage.warning('流量费为必填项')
    return
  }

  try {
    const res = await editUserSimApi({
      id: editForm.id,
      uName: editForm.uName,
      uMobile: editForm.uMobile,
      pName: editForm.pName,
      p_sim_money: editForm.p_sim_money || '0',
      sim_money: editForm.sim_money || '0',
      sim_money2: editForm.sim_money2 || '0'
    })

    // 响应拦截器已经处理了错误情况，能执行到这里说明请求成功
    console.log('编辑流量费政策响应:', res)
    ElMessage.success(res.msg || '设置成功')
    editDialogVisible.value = false
    // 刷新列表
    await getList()
  } catch (error) {
    console.error('提交失败:', error)
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
    { key: 'pName', title: '产品名称' },
    { key: 'sim_money', title: '流量费' },
    { key: 'u_sim_money', title: '首年流量费' },
    { key: 'u_sim_money2', title: '次年流量费' },
    { key: 'create_time', title: '创建时间' }
  ]

  exportExcel({
    data: tableData.value,
    columns,
    filename: '代理流量费政策列表'
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
