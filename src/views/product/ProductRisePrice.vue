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
                @change="handlePlatformChange"
              >
                <el-option label="全部" :value="0" />
                <el-option
                  v-for="item in PRODUCT_OPTIONS.filter((i) => i.value !== 0)"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="产品名称">
              <el-select
                v-model="queryParams.product_id"
                placeholder="请选择"
                clearable
                filterable
                :disabled="!queryParams.pid"
                @change="handleQuery"
              >
                <el-option
                  v-for="item in productList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
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
        <el-table-column prop="plname" label="平台名称" min-width="140" align="center" />
        <el-table-column prop="pname" label="产品名称" min-width="150" align="center" />
        <el-table-column prop="rise_type" label="类型" min-width="100" align="center" />
        <el-table-column prop="days" label="开通天数" width="100" align="center">
          <template #default="{ row }">
            {{ row.days || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="merchant_time" label="开通日期" width="130" align="center">
          <template #default="{ row }">
            {{ row.merchant_time || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="rise_price" label="分成(万)" width="100" align="center" />
        <el-table-column prop="create_time" label="创建时间" width="180" align="center" />

        <el-table-column label="状态" min-width="160" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.statusValue"
              :active-value="0"
              :inactive-value="1"
              active-text="启用"
              inactive-text="禁用"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" link :icon="Edit" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" link :icon="Delete" @click="handleDelete(row)">
              删除
            </el-button>
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

    <!-- 新增/编辑产品涨价分成弹窗 -->
    <el-dialog
      v-model="formVisible"
      :title="editData ? '编辑产品涨价分成规则' : '新增产品涨价分成规则'"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item label="平台名称" prop="pid">
          <el-select
            v-model="formData.pid"
            placeholder="请选择所属平台"
            filterable
            @change="handleFormPlatformChange"
          >
            <el-option
              v-for="item in PRODUCT_OPTIONS.filter((i) => i.value !== 0)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="产品" prop="product_id">
          <el-select
            v-model="formData.product_id"
            placeholder="请选择产品"
            filterable
            :disabled="!formData.pid || formData.pid === 0"
          >
            <el-option
              v-for="item in formProductList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="类型" prop="rise_type">
          <el-select v-model="formData.rise_type" placeholder="请选择类型" filterable>
            <el-option label="开通天数" :value="1" />
            <el-option label="开通日期" :value="2" />
          </el-select>
          <div style="color: #909399; font-size: 12px; margin-top: 5px; line-height: 1.5">
            指定开通天数：开通指定天数之后的商户有涨价分成，开通日期：指定日期之前开通的商户有涨价分成
          </div>
        </el-form-item>

        <el-form-item v-if="formData.rise_type === 1" label="开通天数">
          <el-input v-model="formData.days" type="number" placeholder="请输入开通天数" />
        </el-form-item>

        <el-form-item v-if="formData.rise_type === 2" label="开通日期">
          <el-date-picker
            v-model="formData.merchant_time"
            type="date"
            placeholder="请选择开通日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="分成" prop="rise_price">
          <el-input v-model="formData.rise_price" placeholder="涨价分成，万" />
          <div style="color: #909399; font-size: 12px; margin-top: 5px">指定分成，万</div>
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio :value="0">启用</el-radio>
            <el-radio :value="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <div style="text-align: center">
          <el-button @click="formVisible = false">取消</el-button>
          <el-button type="primary" :loading="formLoading" @click="handleSubmit">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Search, Refresh, Plus, Delete, Edit } from '@element-plus/icons-vue'
import { PRODUCT_OPTIONS } from '@/constants'
import { request } from '@/utils/request'

// 定义产品涨价分成列表项接口
interface ProductRisePriceItem {
  id: number
  m_id: number
  pid: number
  product_id: number
  plname: string
  pname: string
  rise_type: string
  days: number
  merchant_time: string
  rise_price: string
  status: string
  statusValue?: number // 用于开关的数字状态值
  create_time: string
  update_time: number
}

// 定义产品项接口
interface ProductItem {
  id: number
  name: string
  pid: number
}

// 定义查询参数接口
interface QueryParams {
  page: number
  limit: number
  pid: number
  product_id: number | string
}

// 定义表单数据接口
interface FormData {
  id?: number
  pid: number
  product_id: number | string
  rise_type: number
  days: string
  merchant_time: string
  rise_price: string
  status: number
}

// 定义API响应接口
interface ApiResponse {
  code: number
  msg: string
  count: number
  data: ProductRisePriceItem[]
}

// 定义产品列表响应接口
interface ProductListResponse {
  code: number
  msg: string
  count: number
  data: ProductItem[]
}

// 定义操作响应接口
interface OperationResponse {
  code: number
  msg: string
  data?: unknown
}

// 查询参数
const queryParams = reactive<QueryParams>({
  page: 1,
  limit: 15,
  pid: 0,
  product_id: ''
})

// 表格数据
const tableData = ref<ProductRisePriceItem[]>([])
const total = ref(0)
const loading = ref(false)

// 产品列表
const productList = ref<ProductItem[]>([])
const formProductList = ref<ProductItem[]>([])

// 表单相关
const formVisible = ref(false)
const formLoading = ref(false)
const formRef = ref<FormInstance>()
const editData = ref<ProductRisePriceItem | undefined>(undefined)

// 表单数据
const formData = reactive<FormData>({
  pid: 0,
  product_id: '',
  rise_type: 1,
  days: '',
  merchant_time: '',
  rise_price: '',
  status: 0
})

// 表单验证规则
const formRules: FormRules = {
  pid: [{ required: true, message: '请选择所属平台', trigger: 'change' }],
  product_id: [{ required: true, message: '请选择产品', trigger: 'change' }],
  rise_type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  rise_price: [{ required: true, message: '请输入涨价分成', trigger: 'blur' }]
}

// 选中的行
const selectedIds = ref<number[]>([])

// 获取产品列表
const getProductList = async (pid: number, isFormQuery = false) => {
  if (pid <= 0) {
    if (isFormQuery) {
      formProductList.value = []
    } else {
      productList.value = []
    }
    return
  }

  try {
    const res = await request.get<ProductListResponse>('/index/product/getproductlist.html', {
      params: { pid }
    })

    console.log('产品列表响应:', res)

    if (res.code === 0) {
      if (isFormQuery) {
        formProductList.value = res.data || []
      } else {
        productList.value = res.data || []
      }
    } else {
      ElMessage.error(res.msg || '获取产品列表失败')
    }
  } catch (error) {
    console.error('获取产品列表失败:', error)
    ElMessage.error('获取产品列表失败，请稍后重试')
  }
}

// 平台变化处理（搜索区域）
const handlePlatformChange = async (value: number) => {
  queryParams.product_id = ''
  if (value > 0) {
    await getProductList(value)
  } else {
    productList.value = []
  }
  handleQuery()
}

// 平台变化处理（表单区域）
const handleFormPlatformChange = async (value: number) => {
  formData.product_id = ''
  if (value > 0) {
    await getProductList(value, true)
  } else {
    formProductList.value = []
  }
}

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const params = {
      page: queryParams.page,
      limit: queryParams.limit,
      pid: queryParams.pid,
      product_id: queryParams.product_id || ''
    }

    const res = await request.get<ApiResponse>('/index/product_rise/getlist.html', { params })

    console.log('产品涨价分成列表响应:', res)

    // 列表查询接口：code: 0 表示成功
    if (res.code === 0) {
      // 处理状态字段
      tableData.value = (res.data || []).map((item) => ({
        ...item,
        // status: "禁止" 表示禁用(1), 其他表示启用(0)
        statusValue: item.status === '禁止' ? 1 : 0
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
  productList.value = []
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
const handleAdd = async () => {
  editData.value = undefined
  formData.id = undefined
  formData.pid = 0
  formData.product_id = ''
  formData.rise_type = 1
  formData.days = ''
  formData.merchant_time = ''
  formData.rise_price = ''
  formData.status = 0
  formProductList.value = []
  formVisible.value = true
  // 重置表单验证
  formRef.value?.clearValidate()
}

// 编辑
const handleEdit = async (row: ProductRisePriceItem) => {
  editData.value = { ...row }

  // 先加载产品列表（确保下拉选项已加载）
  if (row.pid) {
    await getProductList(row.pid, true)
  }

  // 设置表单数据
  formData.id = row.id
  formData.pid = row.product_id // 平台ID
  formData.product_id = row.product_id // 产品ID
  // 根据类型文本转换为数字
  formData.rise_type = row.rise_type === '天数' ? 1 : 2
  formData.days = String(row.days || '')
  formData.merchant_time = row.merchant_time === '--' ? '' : row.merchant_time
  formData.rise_price = row.rise_price
  // status: "禁止" 表示禁用(1), 其他表示启用(0)
  formData.status = row.status === '禁止' ? 1 : 0

  // 重置表单验证
  await formRef.value?.clearValidate()

  // 数据准备完成后再打开对话框
  formVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch (error) {
    return
  }

  formLoading.value = true
  try {
    const formDataToSend = new URLSearchParams()

    if (formData.id) {
      formDataToSend.append('id', String(formData.id))
    }
    formDataToSend.append('pid', String(formData.pid))
    formDataToSend.append('product_id', String(formData.product_id))
    formDataToSend.append('rise_type', String(formData.rise_type))
    formDataToSend.append('days', formData.rise_type === 1 ? formData.days : '')
    formDataToSend.append('merchant_time', formData.rise_type === 2 ? formData.merchant_time : '')
    formDataToSend.append('rise_price', formData.rise_price)
    formDataToSend.append('status', String(formData.status))

    // 根据是否有id判断是新增还是编辑
    const url = formData.id ? '/index/product_rise/edit.html' : '/index/product_rise/add.html'
    const res = await request.post<OperationResponse>(url, formDataToSend, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    console.log('提交产品涨价分成响应:', res)
    // 操作接口：code: 1 表示成功
    if (res.code === 1) {
      ElMessage.success(res.msg || '操作成功')
      formVisible.value = false
      await getList()
    } else {
      ElMessage.error(res.msg || '操作失败')
    }
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('操作失败，请稍后重试')
  } finally {
    formLoading.value = false
  }
}

// 删除单个
const handleDelete = async (row: ProductRisePriceItem) => {
  try {
    await ElMessageBox.confirm(`确定要删除"${row.pname}"的涨价分成规则吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const formData = new URLSearchParams()
    formData.append('ids', String(row.id))

    const res = await request.post<OperationResponse>('/index/product_rise/del.html', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    console.log('删除产品涨价分成响应:', res)
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
const handleSelectionChange = (selection: ProductRisePriceItem[]) => {
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

    const res = await request.post<OperationResponse>('/index/product_rise/del.html', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    console.log('批量删除产品涨价分成响应:', res)
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
const handleStatusChange = async (row: ProductRisePriceItem) => {
  const isEnable = row.statusValue === 0
  const url = isEnable
    ? '/index/product_rise/setenable.html'
    : '/index/product_rise/setdisable.html'
  const action = isEnable ? '启用' : '禁用'

  try {
    const formData = new URLSearchParams()
    formData.append('ids', String(row.id))

    const res = await request.post<OperationResponse>(url, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    console.log(`${action}产品涨价分成响应:`, res)
    // 操作接口：code: 1 表示成功
    if (res.code === 1) {
      ElMessage.success(res.msg || `${action}成功`)
      await getList()
    } else {
      ElMessage.error(res.msg || `${action}失败`)
      // 失败时恢复原状态
      row.statusValue = isEnable ? 1 : 0
    }
  } catch (error) {
    console.error(`${action}失败:`, error)
    ElMessage.error(`${action}失败，请稍后重试`)
    // 失败时恢复原状态
    row.statusValue = isEnable ? 1 : 0
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
