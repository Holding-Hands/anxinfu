<template>
  <div class="page-container">
    <el-card class="filter-card" shadow="never">
      <!-- 搜索表单 -->
      <el-form :model="queryParams" label-width="100px" class="filter-form">
        <el-row :gutter="20" justify="space-between" align="middle">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="平台名称">
              <el-input
                v-model="queryParams.title"
                placeholder="请输入平台名称"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="16" :lg="18" style="text-align: right">
            <el-form-item label=" " class="filter-actions">
              <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
              <el-button :icon="Refresh" @click="handleReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 操作按钮 -->
    <div class="toolbar">
      <el-button type="primary" @click="handleAdd">新增</el-button>
      <el-button type="success" :disabled="selectedRows.length === 0" @click="handleBatchEnable">
        批量启用
      </el-button>
      <el-button type="warning" :disabled="selectedRows.length === 0" @click="handleBatchDisable">
        批量禁用
      </el-button>
      <el-button type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete">
        批量删除
      </el-button>
    </div>

    <!-- 数据表格 -->
    <el-card shadow="never">
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
        <el-table-column prop="id" label="ID" min-width="80" align="center" />
        <el-table-column prop="title" label="平台名称" min-width="150" align="center" />
        <el-table-column prop="sort" label="排序" min-width="100" align="center" />
        <el-table-column label="状态" min-width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '已启用' ? 'success' : 'danger'">
              {{ row.status === '已启用' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="250" align="center" fixed="right">
          <template #default="{ row }">
            <div class="table-actions">
              <el-link type="primary" :underline="true" @click="handleEdit(row)">编辑</el-link>
              <el-link
                :type="row.status === '已启用' ? 'warning' : 'success'"
                :underline="true"
                @click="handleToggleStatus(row)"
              >
                {{ row.status === '已启用' ? '禁用' : '启用' }}
              </el-link>
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

    <!-- 新增/编辑弹窗 -->
    <el-dialog draggable
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item label="平台名称" prop="title">
          <el-input v-model="formData.title" placeholder="请输入平台名称" />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0" :max="9999" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import {
  getPlatformListApi,
  addPlatformApi,
  editPlatformApi,
  deletePlatformApi,
  setPlatformEnableApi,
  setPlatformDisableApi,
  type PlatformListParams,
  type PlatformListItem
} from '@/api/user'

// 查询参数
const queryParams = reactive<PlatformListParams>({
  page: 1,
  limit: 15,
  title: ''
})

// 表格数据
const tableData = ref<PlatformListItem[]>([])
const total = ref(0)
const loading = ref(false)
const selectedRows = ref<PlatformListItem[]>([])

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = computed(() => (formData.id ? '编辑平台' : '新增平台'))
const formRef = ref<FormInstance>()
const formData = reactive({
  id: 0,
  title: '',
  sort: 0
})

// 表单验证规则
const formRules = reactive<FormRules>({
  title: [{ required: true, message: '请输入平台名称', trigger: 'blur' }],
  sort: [{ required: true, message: '请输入排序', trigger: 'blur' }]
})

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const res = await getPlatformListApi(queryParams)
    console.log('平台管理列表响应:', res)

    // 处理数据，将状态转换为布尔值
    const rawData = res.data || []
    tableData.value = rawData.map((item: PlatformListItem) => ({
      ...item,
      statusValue: item.status === '已启用'
    }))
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

// 重置
const handleReset = () => {
  queryParams.page = 1
  queryParams.limit = 15
  queryParams.title = ''
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

// 表格选择改变
const handleSelectionChange = (selection: PlatformListItem[]) => {
  selectedRows.value = selection
}

// 新增
const handleAdd = () => {
  formData.id = 0
  formData.title = ''
  formData.sort = 0
  dialogVisible.value = true
  formRef.value?.clearValidate()
}

// 编辑
const handleEdit = (row: PlatformListItem) => {
  formData.id = row.id
  formData.title = row.title
  formData.sort = row.sort
  dialogVisible.value = true
  formRef.value?.clearValidate()
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 根据是否有id判断是新增还是编辑
        let res
        if (formData.id) {
          // 编辑
          res = await editPlatformApi({
            id: formData.id,
            title: formData.title,
            sort: formData.sort
          })
        } else {
          // 新增
          res = await addPlatformApi({
            title: formData.title,
            sort: formData.sort
          })
        }
        ElMessage.success(res.msg || '操作成功')
        dialogVisible.value = false
        await getList()
      } catch (error) {
        console.error('提交失败:', error)
      }
    }
  })
}

// 删除单个
const handleDelete = (row: PlatformListItem) => {
  ElMessageBox.confirm('确定要删除该平台吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        const res = await deletePlatformApi({ ids: row.id })
        ElMessage.success(res.msg || '删除成功')
        await getList()
      } catch (error) {
        console.error('删除失败:', error)
      }
    })
    .catch(() => {
      // 取消删除
    })
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的数据')
    return
  }

  ElMessageBox.confirm('确定要删除选中的平台吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        const ids = selectedRows.value.map((row) => row.id).join(',')
        const res = await deletePlatformApi({ ids })
        ElMessage.success(res.msg || '删除成功')
        await getList()
      } catch (error) {
        console.error('删除失败:', error)
      }
    })
    .catch(() => {
      // 取消删除
    })
}

// 切换启用/禁用状态
const handleToggleStatus = async (row: PlatformListItem) => {
  const isEnabled = row.status === '已启用'
  const action = isEnabled ? '禁用' : '启用'

  try {
    await ElMessageBox.confirm(`确定要${action}吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 将当前行转换为启用/禁用接口需要的格式
    const jsonData = JSON.stringify([
      {
        id: row.id,
        m_id: row.m_id,
        title: row.title,
        card_price: row.card_price,
        code_price: row.code_price,
        vip_price: row.vip_price,
        sort: row.sort,
        create_time: row.create_time,
        status: isEnabled ? '已禁用' : '已启用',
        update_time: row.update_time
      }
    ])

    // 根据状态调用不同的接口
    const res = isEnabled
      ? await setPlatformDisableApi({ jsonData })
      : await setPlatformEnableApi({ jsonData })

    ElMessage.success(res.msg || `${action}成功`)
    await getList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error(`${action}失败:`, error)
      ElMessage.error(`${action}失败，请稍后重试`)
    }
  }
}

// 批量启用
const handleBatchEnable = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要启用的数据')
    return
  }

  try {
    const jsonData = JSON.stringify(
      selectedRows.value.map((row) => ({
        id: row.id,
        m_id: row.m_id,
        title: row.title,
        card_price: row.card_price,
        code_price: row.code_price,
        vip_price: row.vip_price,
        sort: row.sort,
        create_time: row.create_time,
        status: '已启用',
        update_time: row.update_time
      }))
    )

    const res = await setPlatformEnableApi({ jsonData })
    ElMessage.success(res.msg || '操作成功')
    await getList()
  } catch (error) {
    console.error('批量启用失败:', error)
  }
}

// 批量禁用
const handleBatchDisable = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要禁用的数据')
    return
  }

  try {
    const jsonData = JSON.stringify(
      selectedRows.value.map((row) => ({
        id: row.id,
        m_id: row.m_id,
        title: row.title,
        card_price: row.card_price,
        code_price: row.code_price,
        vip_price: row.vip_price,
        sort: row.sort,
        create_time: row.create_time,
        status: '已禁用',
        update_time: row.update_time
      }))
    )

    const res = await setPlatformDisableApi({ jsonData })
    ElMessage.success(res.msg || '操作成功')
    await getList()
  } catch (error) {
    console.error('批量禁用失败:', error)
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

// 修复按钮hover状态下背景色
:deep(.el-button) {
  &:hover,
  &:focus {
    background-color: #fff !important;
  }
}
</style>

<style lang="scss">
// 全局样式，用于覆盖 Dialog 中的按钮（Dialog 内容在 body 中，scoped 样式无法覆盖）
.el-button {
  &:hover,
  &:focus {
    background-color: #fff !important;
  }
}
</style>
