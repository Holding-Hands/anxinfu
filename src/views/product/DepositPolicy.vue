<template>
  <div class="page-container">
    <!-- 搜索筛选区域 -->
    <el-card class="filter-card" shadow="never">
      <el-form :model="queryParams" label-width="100px" class="filter-form">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="所属平台">
              <el-select
                v-model="queryParams.pid"
                placeholder="全部"
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
            <el-form-item label="产品名称">
              <el-input
                v-model="queryParams.product_id"
                placeholder="请输入产品ID"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="活动名称">
              <el-input
                v-model="queryParams.active_name"
                placeholder="请输入活动名称"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label=" " class="filter-actions">
              <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
              <el-button :icon="Refresh" @click="handleReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 操作按钮区域 -->
    <el-card shadow="never" style="margin-top: 10px">
      <el-row :gutter="10" style="margin-bottom: 10px">
        <el-col :span="24">
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
          <el-button type="danger" :icon="Delete" @click="handleBatchDelete">删除</el-button>
        </el-col>
      </el-row>

      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" fixed="left" />
        <el-table-column prop="id" label="ID" width="80" align="center" fixed="left" />
        <el-table-column prop="plname" label="平台名称" min-width="120" align="center" />
        <el-table-column prop="pname" label="产品名称" min-width="150" align="center" />
        <el-table-column prop="active_name" label="活动名称" min-width="200" align="center" />
        <el-table-column prop="activity_code" label="活动编码" min-width="150" align="center" />
        <el-table-column prop="yajin_money" label="押金" width="100" align="center" />
        <el-table-column prop="yajin_fh_money" label="返客户押金" width="120" align="center" />
        <el-table-column prop="active_money" label="激活奖/押金" width="120" align="center" />
        <el-table-column
          prop="active_parent_money"
          label="激活推荐人奖励"
          width="140"
          align="center"
        />
        <el-table-column
          prop="active_grand_money"
          label="激活上级奖励"
          width="130"
          align="center"
        />
        <el-table-column prop="first_money" label="一次达标奖励" width="130" align="center" />
        <el-table-column prop="second_money" label="二次达标奖励" width="130" align="center" />
        <el-table-column prop="third_money" label="三次达标奖励" width="130" align="center" />

        <el-table-column label="状态" width="120" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.statusValue"
              :active-value="1"
              :inactive-value="0"
              active-text="启用"
              inactive-text="禁用"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>

        <el-table-column prop="create_time" label="创建时间" width="180" align="center" />

        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="{ row }">
            <div class="table-actions">
              <el-link type="primary" :underline="true" @click="handleEdit(row)">编辑</el-link>
              <el-link type="danger" :underline="true" @click="handleDelete(row)">删除</el-link>
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

    <!-- 新增/编辑押金政策弹窗 -->
    <DepositPolicyForm
      v-model:visible="formVisible"
      :edit-data="editData"
      @success="handleFormSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Delete } from '@element-plus/icons-vue'
import { PRODUCT_OPTIONS } from '@/constants'
import { request } from '@/utils/request'
import DepositPolicyForm from './DepositPolicyForm.vue'

// 定义押金政策列表项接口
interface DepositPolicyItem {
  id: number
  m_id: number
  product_id: number
  sys_type: number
  active_name: string
  pname: string
  plname: string
  yajin_money: string
  yajin_fh_money: string
  active_money: string
  active_parent_money: string
  active_grand_money: string
  first_money: string
  second_money: string
  third_money: string
  sim_money: string
  first_coin: string
  status: string
  statusValue?: number // 用于开关的数字状态值
  activity_code: string
  create_time: string
  update_time: number
}

// 定义查询参数接口
interface QueryParams {
  page: number
  limit: number
  pid: number
  product_id: string
  active_name: string
}

// 定义API响应接口
interface ApiResponse {
  code: number
  msg: string
  count: number
  data: DepositPolicyItem[]
}

// 定义操作响应接口（用于删除、启用、禁用等操作）
interface OperationResponse {
  code: number
  msg: string
}

// 查询参数
const queryParams = reactive<QueryParams>({
  page: 1,
  limit: 15,
  pid: 0,
  product_id: '',
  active_name: ''
})

// 表格数据
const tableData = ref<DepositPolicyItem[]>([])
const total = ref(0)
const loading = ref(false)

// 表单相关
const formVisible = ref(false)
const editData = ref<DepositPolicyItem | undefined>(undefined)

// 选中的行
const selectedIds = ref<number[]>([])

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const params = {
      page: queryParams.page,
      limit: queryParams.limit,
      pid: queryParams.pid,
      product_id: queryParams.product_id,
      active_name: queryParams.active_name
    }

    const res = await request.get<ApiResponse>('/index/product_active/getlist.html', { params })

    console.log('押金政策列表响应:', res)

    // 列表查询接口：code: 0 表示成功
    if (res.code === 0) {
      // 处理状态字段，将字符串转换为数字
      tableData.value = (res.data || []).map((item) => ({
        ...item,
        statusValue: item.status === '启用' ? 1 : 0
      }))
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

// 查询
const handleQuery = () => {
  queryParams.page = 1
  getList()
}

// 重置
const handleReset = () => {
  queryParams.page = 1
  queryParams.limit = 15
  queryParams.pid = 0
  queryParams.product_id = ''
  queryParams.active_name = ''
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

// 新增
const handleAdd = () => {
  editData.value = undefined
  formVisible.value = true
}

// 编辑
const handleEdit = (row: DepositPolicyItem) => {
  editData.value = { ...row }
  formVisible.value = true
}

// 表单提交成功
const handleFormSuccess = () => {
  getList()
}

// 删除单个
const handleDelete = async (row: DepositPolicyItem) => {
  try {
    await ElMessageBox.confirm(`确定要删除"${row.active_name}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const formData = new URLSearchParams()
    formData.append('ids', String(row.id))

    const res = await request.post<OperationResponse>('/index/product_active/del.html', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    console.log('删除押金政策响应:', res)
    // 操作接口：code: 1 表示成功
    if (res.code === 1) {
      ElMessage.success(res.msg || '删除成功')
      await getList()
    } else {
      ElMessage.error(res.msg || '删除失败')
    }
  } catch (error: unknown) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败，请稍后重试')
    }
  }
}

// 选择行变化
const handleSelectionChange = (selection: DepositPolicyItem[]) => {
  selectedIds.value = selection.map((item) => item.id)
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的数据')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条数据吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const formData = new URLSearchParams()
    formData.append('ids', selectedIds.value.join(','))

    const res = await request.post<OperationResponse>('/index/product_active/del.html', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    console.log('批量删除押金政策响应:', res)
    // 操作接口：code: 1 表示成功
    if (res.code === 1) {
      ElMessage.success(res.msg || '删除成功')
      await getList()
    } else {
      ElMessage.error(res.msg || '删除失败')
    }
  } catch (error: unknown) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error('删除失败，请稍后重试')
    }
  }
}

// 状态切换
const handleStatusChange = async (row: DepositPolicyItem) => {
  const isEnable = row.statusValue === 1
  const url = isEnable
    ? '/index/product_active/setenable.html'
    : '/index/product_active/setdisable.html'
  const action = isEnable ? '启用' : '禁用'

  try {
    const formData = new URLSearchParams()
    formData.append('ids', String(row.id))

    const res = await request.post<OperationResponse>(url, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    console.log(`${action}押金政策响应:`, res)
    // 操作接口：code: 1 表示成功
    if (res.code === 1) {
      ElMessage.success(res.msg || `${action}成功`)
      await getList()
    } else {
      ElMessage.error(res.msg || `${action}失败`)
      // 失败时恢复原状态
      row.statusValue = isEnable ? 0 : 1
    }
  } catch (error) {
    console.error(`${action}失败:`, error)
    ElMessage.error(`${action}失败，请稍后重试`)
    // 失败时恢复原状态
    row.statusValue = isEnable ? 0 : 1
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
}

.filter-card {
  margin-bottom: 10px;
}

.filter-form {
  :deep(.el-form-item) {
    margin-bottom: 15px;
  }

  .filter-actions {
    .el-button {
      margin-right: 10px;
    }
  }
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
