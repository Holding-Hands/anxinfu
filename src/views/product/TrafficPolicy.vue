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
                placeholder="请选择"
                clearable
                filterable
                @change="handlePlatformChange"
              >
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
            <el-form-item label="名称">
              <el-input
                v-model="queryParams.name"
                placeholder="请输入名称"
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
        <el-table-column prop="name" label="名称" min-width="150" align="center" />
        <el-table-column prop="sim_money" label="流量费" width="100" align="center" />
        <el-table-column prop="back_money" label="奖励(返客户)" width="120" align="center" />
        <el-table-column prop="remark" label="备注" min-width="120" align="center" />
        <el-table-column prop="activity_code" label="政策编号" width="120" align="center" />
        <el-table-column prop="sim_nums" label="发放次数" width="100" align="center" />

        <el-table-column label="状态" min-width="160" align="center">
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

    <!-- 新增/编辑流量费政策弹窗 -->
    <el-dialog
      v-model="formVisible"
      :title="editData ? '编辑流量费政策' : '新增流量费政策'"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item label="所属平台" prop="pid">
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

        <el-form-item label="产品名称" prop="product_id">
          <el-select
            v-model="formData.product_id"
            placeholder="请选择产品"
            filterable
            :disabled="!formData.pid"
          >
            <el-option
              v-for="item in formProductList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入名称" />
        </el-form-item>

        <el-form-item label="政策编号" prop="activity_code">
          <el-input v-model="formData.activity_code" placeholder="请输入政策编号" />
        </el-form-item>

        <el-form-item label="流量费" prop="sim_money">
          <el-input v-model="formData.sim_money" placeholder="请输入流量费" />
        </el-form-item>

        <el-form-item label="奖励(返客户)" prop="back_money">
          <el-input v-model="formData.back_money" placeholder="请输入奖励金额" />
        </el-form-item>

        <el-form-item label="发放次数" prop="sim_nums">
          <el-input v-model="formData.sim_nums" type="number" placeholder="请输入发放次数" />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" :loading="formLoading" @click="handleSubmit">确定</el-button>
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

// 定义流量费政策列表项接口
interface TrafficPolicyItem {
  id: number
  m_id: number
  sys_type: number
  pid: number
  product_id: number
  name: string
  plname: string
  pname: string
  activity_code: string
  back_money: string
  sim_money: number
  sim_nums: number
  remark: string
  main_code: string
  status: number
  statusValue?: number // 用于开关的数字状态值
  create_time: string
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
  pid: number | string
  product_id: number | string
  name: string
}

// 定义表单数据接口
interface FormData {
  id?: number
  pid: number | string
  product_id: number | string
  name: string
  activity_code: string
  sim_money: string
  back_money: string
  sim_nums: string
  remark: string
  status: number
}

// 定义API响应接口
interface ApiResponse {
  code: number
  msg: string
  count: number
  data: TrafficPolicyItem[]
}

// 定义产品列表响应接口
interface ProductListResponse {
  code: number
  msg: string
  count: number
  data: ProductItem[]
}

// 查询参数
const queryParams = reactive<QueryParams>({
  page: 1,
  limit: 15,
  pid: '',
  product_id: '',
  name: ''
})

// 表格数据
const tableData = ref<TrafficPolicyItem[]>([])
const total = ref(0)
const loading = ref(false)

// 产品列表
const productList = ref<ProductItem[]>([])
const formProductList = ref<ProductItem[]>([])

// 表单相关
const formVisible = ref(false)
const formLoading = ref(false)
const formRef = ref<FormInstance>()
const editData = ref<TrafficPolicyItem | undefined>(undefined)

// 表单数据
const formData = reactive<FormData>({
  pid: '',
  product_id: '',
  name: '',
  activity_code: '',
  sim_money: '',
  back_money: '',
  sim_nums: '',
  remark: '',
  status: 1
})

// 表单验证规则
const formRules: FormRules = {
  pid: [{ required: true, message: '请选择所属平台', trigger: 'change' }],
  product_id: [{ required: true, message: '请选择产品', trigger: 'change' }],
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  activity_code: [{ required: true, message: '请输入政策编号', trigger: 'blur' }],
  sim_money: [{ required: true, message: '请输入流量费', trigger: 'blur' }],
  back_money: [{ required: true, message: '请输入奖励金额', trigger: 'blur' }],
  sim_nums: [{ required: true, message: '请输入发放次数', trigger: 'blur' }]
}

// 选中的行
const selectedIds = ref<number[]>([])

// 获取产品列表
const getProductList = async (pid: number | string, isFormQuery = false) => {
  if (!pid) {
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
const handlePlatformChange = async (value: number | string) => {
  queryParams.product_id = ''
  if (value) {
    await getProductList(value)
  } else {
    productList.value = []
  }
  handleQuery()
}

// 平台变化处理（表单区域）
const handleFormPlatformChange = async (value: number | string) => {
  formData.product_id = ''
  if (value) {
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
      product_id: queryParams.product_id,
      name: queryParams.name
    }

    const res = await request.get<ApiResponse>('/index/product_sim/getlist.html', { params })

    console.log('流量费政策列表响应:', res)

    // 列表查询接口：code: 0 表示成功
    if (res.code === 0) {
      // 处理状态字段，将数字转换为开关需要的格式
      tableData.value = (res.data || []).map((item) => ({
        ...item,
        statusValue: item.status === 1 ? 1 : 0
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
  queryParams.pid = ''
  queryParams.product_id = ''
  queryParams.name = ''
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
  formData.pid = ''
  formData.product_id = ''
  formData.name = ''
  formData.activity_code = ''
  formData.sim_money = ''
  formData.back_money = ''
  formData.sim_nums = ''
  formData.remark = ''
  formData.status = 1
  formProductList.value = []
  formVisible.value = true
  // 重置表单验证
  formRef.value?.clearValidate()
}

// 编辑
const handleEdit = async (row: TrafficPolicyItem) => {
  editData.value = { ...row }
  formData.id = row.id
  formData.pid = row.pid
  formData.product_id = row.product_id
  formData.name = row.name
  formData.activity_code = row.activity_code
  formData.sim_money = String(row.sim_money)
  formData.back_money = row.back_money
  formData.sim_nums = String(row.sim_nums)
  formData.remark = row.remark
  formData.status = row.status

  // 加载产品列表
  if (row.pid) {
    await getProductList(row.pid, true)
  }

  formVisible.value = true
  // 重置表单验证
  formRef.value?.clearValidate()
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
    formDataToSend.append('name', formData.name)
    formDataToSend.append('activity_code', formData.activity_code)
    formDataToSend.append('sim_money', formData.sim_money)
    formDataToSend.append('back_money', formData.back_money)
    formDataToSend.append('sim_nums', formData.sim_nums)
    formDataToSend.append('remark', formData.remark)
    formDataToSend.append('status', String(formData.status))

    const url = formData.id ? '/index/product_sim/edit.html' : '/index/product_sim/add.html'
    const res = await request.post(url, formDataToSend, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    console.log('提交流量费政策响应:', res)
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
const handleDelete = async (row: TrafficPolicyItem) => {
  try {
    await ElMessageBox.confirm(`确定要删除"${row.name}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const formData = new URLSearchParams()
    formData.append('ids', String(row.id))

    const res = await request.post('/index/product_sim/del.html', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    console.log('删除流量费政策响应:', res)
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
const handleSelectionChange = (selection: TrafficPolicyItem[]) => {
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

    const res = await request.post('/index/product_sim/del.html', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    console.log('批量删除流量费政策响应:', res)
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
const handleStatusChange = async (row: TrafficPolicyItem) => {
  const isEnable = row.statusValue === 1
  const url = isEnable ? '/index/product_sim/setenable.html' : '/index/product_sim/setdisable.html'
  const action = isEnable ? '启用' : '禁用'

  try {
    const formData = new URLSearchParams()
    formData.append('ids', String(row.id))

    const res = await request.post(url, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    console.log(`${action}流量费政策响应:`, res)
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
