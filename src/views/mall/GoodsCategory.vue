<template>
  <div class="page-container">
    <!-- 操作按钮区域 -->
    <el-card shadow="never">
      <el-row :gutter="10" style="margin-bottom: 10px">
        <el-col :span="24">
          <el-button type="primary" :icon="Plus" @click="handleAdd">增加</el-button>
          <el-button type="success" :icon="Check" @click="handleBatchEnable">启用</el-button>
          <el-button type="warning" :icon="Close" @click="handleBatchDisable">禁用</el-button>
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
        <el-table-column prop="cat_name" label="分类名称" min-width="150" align="center" />
        <el-table-column prop="cat_desc" label="描述" min-width="200" align="center">
          <template #default="{ row }">
            {{ row.cat_desc || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="100" align="center" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
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

    <!-- 新增/编辑商品分类弹窗 -->
    <el-dialog
      v-model="formVisible"
      :title="editData ? '编辑商品分类' : '新增商品分类'"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="formData.cat_name" placeholder="请输入分类名称" />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="formData.sort"
            :min="0"
            :max="9999"
            placeholder="请输入排序"
            style="width: 100%"
          />
          <div style="color: #909399; font-size: 12px; margin-top: 5px">
            可填项，排序只能填写数字，数字越大，排序越靠前
          </div>
        </el-form-item>

        <el-form-item label="分类描述" prop="cat_desc">
          <el-input
            v-model="formData.cat_desc"
            type="textarea"
            :rows="3"
            placeholder="请输入分类描述"
          />
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
import { Plus, Delete, Edit, Check, Close } from '@element-plus/icons-vue'
import { request } from '@/utils/request'

// 定义商品分类列表项接口
interface GoodsCategoryItem {
  id: number
  cat_name: string
  cat_desc: string
  sort: number
  status: number
  create_time: number
  m_id: number
  type: number
}

// 定义查询参数接口
interface QueryParams {
  page: number
  limit: number
}

// 定义表单数据接口
interface FormData {
  id?: number
  cat_name: string
  cat_desc: string
  sort: number
}

// 定义API响应接口
interface ApiResponse {
  code: number
  msg: string
  count: number
  data: GoodsCategoryItem[]
}

// 定义操作响应接口
interface OperationResponse {
  code: number
  msg: string
  data?: unknown
  url?: string
}

// 查询参数
const queryParams = reactive<QueryParams>({
  page: 1,
  limit: 15
})

// 表格数据
const tableData = ref<GoodsCategoryItem[]>([])
const total = ref(0)
const loading = ref(false)

// 表单相关
const formVisible = ref(false)
const formLoading = ref(false)
const formRef = ref<FormInstance>()
const editData = ref<GoodsCategoryItem | undefined>(undefined)

// 表单数据
const formData = reactive<FormData>({
  cat_name: '',
  cat_desc: '',
  sort: 1
})

// 表单验证规则
const formRules: FormRules = {
  cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
}

// 选中的行
const selectedIds = ref<number[]>([])

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const params = {
      page: queryParams.page,
      limit: queryParams.limit
    }

    const res = await request.get<ApiResponse>('/index/goods_category/getlist.html', { params })

    console.log('商品分类列表响应:', res)

    // 列表查询接口：code: 0 表示成功
    if (res.code === 0) {
      tableData.value = res.data || []
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
  formData.id = undefined
  formData.cat_name = ''
  formData.cat_desc = ''
  formData.sort = 1
  formVisible.value = true
  // 重置表单验证
  formRef.value?.clearValidate()
}

// 编辑
const handleEdit = async (row: GoodsCategoryItem) => {
  editData.value = { ...row }

  // 设置表单数据
  formData.id = row.id
  formData.cat_name = row.cat_name
  formData.cat_desc = row.cat_desc || ''
  formData.sort = row.sort

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
    formDataToSend.append('cat_name', formData.cat_name)
    formDataToSend.append('sort', String(formData.sort))
    formDataToSend.append('cat_desc', formData.cat_desc)

    // 根据是否有id判断是新增还是编辑
    const url = formData.id ? '/index/goods_category/edit.html' : '/index/goods_category/add.html'
    const res = await request.post<OperationResponse>(url, formDataToSend, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    console.log('提交商品分类响应:', res)
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
const handleDelete = async (row: GoodsCategoryItem) => {
  try {
    await ElMessageBox.confirm(`确定要删除"${row.cat_name}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const formData = new URLSearchParams()
    formData.append('ids', String(row.id))

    const res = await request.post<OperationResponse>('/index/goods_category/del.html', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    console.log('删除商品分类响应:', res)
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
const handleSelectionChange = (selection: GoodsCategoryItem[]) => {
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

    const res = await request.post<OperationResponse>('/index/goods_category/del.html', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    console.log('批量删除商品分类响应:', res)
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

// 批量启用
const handleBatchEnable = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要启用的数据')
    return
  }

  try {
    const formData = new URLSearchParams()
    formData.append('ids', selectedIds.value.join(','))

    const res = await request.post<OperationResponse>(
      '/index/goods_category/setenable.html',
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    console.log('批量启用商品分类响应:', res)
    // 操作接口：code: 1 表示成功
    if (res.code === 1) {
      ElMessage.success(res.msg || '启用成功')
      await getList()
    } else {
      ElMessage.error(res.msg || '启用失败')
    }
  } catch (error) {
    console.error('批量启用失败:', error)
    ElMessage.error('启用失败，请稍后重试')
  }
}

// 批量禁用
const handleBatchDisable = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要禁用的数据')
    return
  }

  try {
    const formData = new URLSearchParams()
    formData.append('ids', selectedIds.value.join(','))

    const res = await request.post<OperationResponse>(
      '/index/goods_category/setdisable.html',
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    console.log('批量禁用商品分类响应:', res)
    // 操作接口：code: 1 表示成功
    if (res.code === 1) {
      ElMessage.success(res.msg || '禁用成功')
      await getList()
    } else {
      ElMessage.error(res.msg || '禁用失败')
    }
  } catch (error) {
    console.error('批量禁用失败:', error)
    ElMessage.error('禁用失败，请稍后重试')
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

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
