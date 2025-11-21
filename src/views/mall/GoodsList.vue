<template>
  <div class="page-container">
    <!-- 搜索区域 -->
    <el-card class="filter-card" shadow="never">
      <el-form :model="queryParams" label-width="100px" class="filter-form">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="分类">
              <el-select v-model="queryParams.cat_id" placeholder="全部" clearable>
                <el-option label="全部" value="" />
                <el-option
                  v-for="item in categoryList"
                  :key="item.id"
                  :label="item.cat_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="状态">
              <el-select v-model="queryParams.status" placeholder="全部" clearable>
                <el-option
                  v-for="item in GOODS_STATUS_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" :lg="12" style="text-align: right">
            <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
            <el-button :icon="Refresh" @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

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
        <el-table-column label="商品图片" width="100" align="center">
          <template #default="{ row }">
            <el-image
              v-if="row.goods_img"
              :src="row.goods_img"
              :preview-src-list="[row.goods_img]"
              fit="cover"
              style="width: 60px; height: 60px; border-radius: 4px"
            />
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" min-width="150" align="center" />
        <el-table-column label="分类" width="120" align="center">
          <template #default="{ row }">
            {{ row.cate || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="系统模式" width="120" align="center">
          <template #default="{ row }">
            <span v-html="row.sys_type_name"></span>
          </template>
        </el-table-column>
        <el-table-column prop="shop_price" label="价格" width="100" align="center">
          <template #default="{ row }">
            <span style="color: #f56c6c; font-weight: bold">¥{{ row.shop_price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="goods_number" label="库存" width="100" align="center" />
        <el-table-column prop="limitbuy" label="限购" width="100" align="center" />
        <el-table-column prop="sort" label="排序" width="100" align="center" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '已上架' : '已下架' }}
            </el-tag>
          </template>
        </el-table-column>

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

    <!-- 新增/编辑商品弹窗 -->
    <el-dialog draggable
      v-model="editDialogVisible"
      :title="editForm.id ? '编辑商品' : '新增商品'"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="120px">
        <el-form-item label="商品分类" prop="cat_id">
          <el-select v-model="editForm.cat_id" placeholder="请选择分类" style="width: 100%">
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.cat_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="系统模式" prop="sys_type">
          <el-select v-model="editForm.sys_type" placeholder="请选择系统模式" style="width: 100%">
            <el-option
              v-for="item in SYS_TYPE_OPTIONS.slice(1)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name" placeholder="请输入商品名称" />
        </el-form-item>

        <el-form-item label="关联产品" prop="product_id">
          <el-select v-model="editForm.product_id" placeholder="请选择产品" style="width: 100%">
            <el-option
              v-for="item in PRODUCT_OPTIONS.slice(1)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="本店售价" prop="shop_price">
          <el-input-number
            v-model="editForm.shop_price"
            :min="0"
            :precision="2"
            placeholder="请输入价格"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="限购数量" prop="limitbuy">
          <el-input-number
            v-model="editForm.limitbuy"
            :min="0"
            placeholder="请输入限购数量"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="单位" prop="unit">
          <el-input-number
            v-model="editForm.unit"
            :min="0"
            placeholder="请输入单位"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="商品图片" prop="goods_img">
          <el-input v-model="editForm.goods_img" placeholder="请输入图片URL" />
          <el-image
            v-if="editForm.goods_img"
            :src="editForm.goods_img"
            fit="cover"
            style="width: 100px; height: 100px; margin-top: 10px; border-radius: 4px"
          />
        </el-form-item>

        <el-form-item label="库存数量" prop="goods_number">
          <el-input-number
            v-model="editForm.goods_number"
            :min="0"
            placeholder="请输入库存数量"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="editForm.sort"
            :min="0"
            :max="9999"
            placeholder="请输入排序"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="商品描述" prop="goods_desc">
          <div style="border: 1px solid #ccc; width: 100%">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editorRef"
              :default-config="toolbarConfig"
              mode="default"
            />
            <Editor
              v-model="editForm.goods_desc"
              style="height: 300px; overflow-y: hidden"
              :default-config="editorConfig"
              mode="default"
              @on-created="handleCreated"
            />
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <div style="text-align: center">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="editFormLoading" @click="handleEditSubmit">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, shallowRef, nextTick } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Delete, Check, Close, Search, Refresh } from '@element-plus/icons-vue'
import { request } from '@/utils/request'
import { GOODS_STATUS_OPTIONS, SYS_TYPE_OPTIONS, PRODUCT_OPTIONS } from '@/constants'
import '@wangeditor/editor/dist/css/style.css'
// @ts-ignore
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'

// 定义商品列表项接口
interface GoodsItem {
  id: number
  goods_name: string
  goods_img: string
  goods_desc: string
  shop_price: string
  goods_number: number
  limitbuy: number
  sort: number
  status: number
  is_hot: number
  is_market: number
  cat_id: number
  cate: string
  sys_type: number
  sys_type_name: string
  product_name: string
  unit: string
  create_time: string
  update_time: string
}

// 定义查询参数接口
interface QueryParams {
  page: number
  limit: number
  cat_id: string | number
  status: string | number
}

// 定义API响应接口
interface ApiResponse {
  code: number
  msg: string
  count: number
  data: GoodsItem[]
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
  cat_id: '',
  status: ''
})

// 表格数据
const tableData = ref<GoodsItem[]>([])
const total = ref(0)
const loading = ref(false)

// 选中的行
const selectedIds = ref<number[]>([])

// 商品分类列表
const categoryList = ref<{ id: number; cat_name: string }[]>([])

// 获取商品分类列表
const getCategoryList = async () => {
  try {
    const res = await request.get<{
      code: number
      msg: string
      data: { id: number; cat_name: string }[]
    }>('/index/goods_category/getlist.html')

    if (res.code === 0) {
      categoryList.value = res.data || []
    }
  } catch (error) {
    console.error('获取商品分类失败:', error)
  }
}

// 编辑弹窗相关
const editDialogVisible = ref(false)
const editFormLoading = ref(false)
const editFormRef = ref<FormInstance>()

// 编辑表单数据接口
interface EditFormData {
  id: number
  cat_id: number
  sys_type: number
  goods_name: string
  product_id: number
  shop_price: number
  limitbuy: number
  unit: number
  goods_img: string
  goods_number: number
  sort: number
  goods_desc: string
}

// 编辑表单数据
const editForm = reactive<EditFormData>({
  id: 0,
  cat_id: 5,
  sys_type: 1,
  goods_name: '',
  product_id: 5,
  shop_price: 0,
  limitbuy: 10,
  unit: 10,
  goods_img: '',
  goods_number: 0,
  sort: 5,
  goods_desc: ''
})

// 编辑表单验证规则
const editFormRules: FormRules = {
  cat_id: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  sys_type: [{ required: true, message: '请选择系统模式', trigger: 'change' }],
  goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  product_id: [{ required: true, message: '请选择关联产品', trigger: 'change' }],
  shop_price: [{ required: true, message: '请输入本店售价', trigger: 'blur' }],
  goods_img: [{ required: true, message: '请输入商品图片URL', trigger: 'blur' }]
}

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const params: Record<string, string | number> = {
      page: queryParams.page,
      limit: queryParams.limit
    }

    if (queryParams.cat_id !== '') {
      params.cat_id = queryParams.cat_id
    }

    if (queryParams.status !== '') {
      params.status = queryParams.status
    }

    const res = await request.get<ApiResponse>('/index/goods/getlist.html', { params })

    console.log('商品列表响应:', res)

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

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  getList()
}

// 重置
const handleReset = () => {
  queryParams.page = 1
  queryParams.cat_id = ''
  queryParams.status = ''
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
  // 先关闭弹窗，确保表单完全重置
  editDialogVisible.value = false

  // 等待下一帧，确保DOM更新
  await nextTick()

  // 重置表单数据
  editForm.id = 0
  editForm.cat_id = categoryList.value.length > 0 ? categoryList.value[0].id : 5
  editForm.sys_type = 1
  editForm.goods_name = ''
  editForm.product_id = 5
  editForm.shop_price = 0
  editForm.limitbuy = 10
  editForm.unit = 10
  editForm.goods_img = ''
  editForm.goods_number = 0
  editForm.sort = 5
  editForm.goods_desc = ''

  // 清空富文本编辑器内容
  if (editorRef.value) {
    editorRef.value.clear()
  }

  // 重置表单验证
  await editFormRef.value?.clearValidate()

  // 打开弹窗
  editDialogVisible.value = true
}

// 编辑
const handleEdit = async (row: GoodsItem) => {
  // 设置表单数据
  editForm.id = row.id
  editForm.cat_id = row.cat_id
  editForm.sys_type = row.sys_type
  editForm.goods_name = row.goods_name
  editForm.product_id = Number(row.product_name) || 5
  editForm.shop_price = Number(row.shop_price)
  editForm.limitbuy = row.limitbuy
  editForm.unit = Number(row.unit)
  editForm.goods_img = row.goods_img
  editForm.goods_number = row.goods_number
  editForm.sort = row.sort
  editForm.goods_desc = row.goods_desc

  // 重置表单验证
  await editFormRef.value?.clearValidate()

  // 打开弹窗
  editDialogVisible.value = true
}

// 提交编辑表单
const handleEditSubmit = async () => {
  if (!editFormRef.value) return

  try {
    await editFormRef.value.validate()
  } catch (error) {
    return
  }

  editFormLoading.value = true
  try {
    const formData = new URLSearchParams()

    // 如果有id，说明是编辑，否则是新增
    if (editForm.id) {
      formData.append('id', String(editForm.id))
    }

    formData.append('cat_id', String(editForm.cat_id))
    formData.append('sys_type', String(editForm.sys_type))
    formData.append('goods_name', editForm.goods_name)
    formData.append('product_id', String(editForm.product_id))
    formData.append('shop_price', String(editForm.shop_price))
    formData.append('limitbuy', String(editForm.limitbuy))
    formData.append('unit', String(editForm.unit))
    formData.append('goods_img', editForm.goods_img)
    formData.append('goods_number', String(editForm.goods_number))
    formData.append('sort', String(editForm.sort))
    formData.append('goods_desc', editForm.goods_desc)

    // 根据是否有id判断是新增还是编辑
    const url = editForm.id ? '/index/goods/edit.html' : '/index/goods/add.html'
    const res = await request.post<OperationResponse>(url, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    console.log('提交商品响应:', res)
    // 操作接口：code: 1 表示成功
    if (res.code === 1) {
      ElMessage.success(res.msg || '操作成功')
      editDialogVisible.value = false
      await getList()
    } else {
      ElMessage.error(res.msg || '操作失败')
    }
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('操作失败，请稍后重试')
  } finally {
    editFormLoading.value = false
  }
}

// 删除单个
const handleDelete = async (row: GoodsItem) => {
  try {
    await ElMessageBox.confirm(`确定要删除"${row.goods_name}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const formData = new URLSearchParams()
    formData.append('ids', String(row.id))

    const res = await request.post<OperationResponse>('/index/goods/del.html', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    console.log('删除商品响应:', res)
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
const handleSelectionChange = (selection: GoodsItem[]) => {
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

    const res = await request.post<OperationResponse>('/index/goods/del.html', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    console.log('批量删除商品响应:', res)
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
    // 获取选中行的完整数据
    const selectedRows = tableData.value.filter((item) => selectedIds.value.includes(item.id))

    // 转换为表单格式，jsonData作为字符串
    const formData = new URLSearchParams()
    formData.append('jsonData', JSON.stringify(selectedRows))

    const res = await request.post<OperationResponse>('/index/goods/setenable.html', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    console.log('批量启用商品响应:', res)
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
    // 获取选中行的完整数据
    const selectedRows = tableData.value.filter((item) => selectedIds.value.includes(item.id))

    // 转换为表单格式，jsonData作为字符串
    const formData = new URLSearchParams()
    formData.append('jsonData', JSON.stringify(selectedRows))

    const res = await request.post<OperationResponse>('/index/goods/setdisable.html', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    console.log('批量禁用商品响应:', res)
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

// 富文本编辑器相关
const editorRef = shallowRef<IDomEditor>()

const toolbarConfig: Partial<IToolbarConfig> = {
  toolbarKeys: [
    'bold',
    'italic',
    'underline',
    'color',
    'bgColor',
    '|',
    'fontSize',
    'fontFamily',
    'lineHeight',
    '|',
    'bulletedList',
    'numberedList',
    '|',
    'justifyLeft',
    'justifyCenter',
    'justifyRight',
    '|',
    'insertLink',
    'insertImage',
    '|',
    'undo',
    'redo'
  ]
}

const editorConfig: Partial<IEditorConfig> = {
  placeholder: '请输入商品描述...',
  MENU_CONF: {
    uploadImage: {
      // 自定义上传图片
      customUpload: async (file: File, insertFn: (url: string) => void) => {
        // 这里可以实现图片上传逻辑
        // 暂时使用本地预览
        const reader = new FileReader()
        reader.onload = (e) => {
          const url = e.target?.result as string
          insertFn(url)
        }
        reader.readAsDataURL(file)
      }
    }
  }
}

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor
}

// 页面加载时获取数据
onMounted(() => {
  getList()
  getCategoryList()
})

// 组件销毁时，销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
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
