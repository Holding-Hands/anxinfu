<template>
  <div class="permission-manage-container">
    <!-- 查询筛选区域 -->
    <el-card class="filter-card" shadow="never">
      <el-form :model="queryParams" label-width="100px" class="filter-form">
        <el-row :gutter="20" justify="space-between" align="middle">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="角色名称">
              <el-input
                v-model="queryParams.title"
                placeholder="请输入角色名称"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="16" :lg="18" style="text-align: right">
            <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
            <el-button :icon="Refresh" @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" style="margin-top: 10px">
      <!-- 操作按钮 -->
      <div class="toolbar">
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
        <el-button type="success" :icon="Select" @click="handleBatchEnable">启用</el-button>
        <el-button type="warning" :icon="RemoveFilled" @click="handleBatchDisable">禁用</el-button>
        <el-button type="danger" :icon="Delete" @click="handleBatchDelete">删除</el-button>
      </div>

      <!-- 表格 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />

        <el-table-column prop="id" label="ID" min-width="80" align="center" />

        <el-table-column prop="title" label="角色名" min-width="200" align="center" />

        <el-table-column prop="sort" label="排序" min-width="100" align="center" />

        <el-table-column label="状态" min-width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="250" align="center" fixed="right">
          <template #default="{ row }">
            <div class="table-actions">
              <el-link type="primary" :underline="true" @click="handleEdit(row)">编辑</el-link>
              <el-link
                :type="row.status === 1 ? 'warning' : 'success'"
                :underline="true"
                @click="handleToggleStatus(row)"
              >
                {{ row.status === 1 ? '禁用' : '启用' }}
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
          @size-change="getList"
          @current-change="getList"
        />
      </div>
    </el-card>

    <!-- 编辑角色弹窗 -->
    <el-dialog v-model="dialogVisible" title="权限管理" width="600px" :close-on-click-modal="false">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="角色信息" name="info">
          <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
            <el-form-item label="角色名称" prop="title">
              <el-input v-model="formData.title" placeholder="请输入角色名称" />
            </el-form-item>

            <el-form-item label="权限" prop="is_all">
              <el-radio-group v-model="formData.is_all">
                <el-radio :label="0">个性化设置</el-radio>
                <el-radio :label="1">所有</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="排序" prop="sort">
              <el-input-number
                v-model="formData.sort"
                :min="0"
                :max="9999"
                controls-position="right"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="系统权限" name="permission">
          <div class="permission-tip">个性化权限设置功能开发中...</div>
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <el-button @click="dialogVisible = false">返回上级</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          立即提交
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Search, Refresh, Plus, Select, RemoveFilled, Delete } from '@element-plus/icons-vue'
import {
  getPermissionListApi,
  editRoleApi,
  addRoleApi,
  setDisableRoleApi,
  setEnableRoleApi,
  deleteRoleApi,
  type PermissionParams,
  type PermissionItem,
  type RoleEditParams,
  type RoleAddParams
} from '@/api/permission'

// 查询参数
const queryParams = reactive<PermissionParams & { title?: string }>({
  page: 1,
  limit: 15,
  title: ''
})

// 表格数据
const tableData = ref<PermissionItem[]>([])
const total = ref(0)
const loading = ref(false)

// 选中的数据
const selectedIds = ref<number[]>([])

// 弹窗相关
const dialogVisible = ref(false)
const activeTab = ref('info')
const submitLoading = ref(false)
const formRef = ref<FormInstance>()
const isEditMode = ref(false) // true-编辑模式 false-新增模式

// 表单数据
const formData = reactive<RoleEditParams>({
  id: 0,
  title: '',
  is_all: 1,
  sort: 0
})

// 表单验证规则
const formRules: FormRules = {
  title: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  is_all: [{ required: true, message: '请选择权限类型', trigger: 'change' }],
  sort: [{ required: true, message: '请输入排序', trigger: 'blur' }]
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

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const res = await getPermissionListApi(queryParams)
    console.log('权限管理列表响应:', res)

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

// 新增
const handleAdd = () => {
  isEditMode.value = false
  formData.id = 0
  formData.title = ''
  formData.is_all = 1
  formData.sort = 0
  activeTab.value = 'info'
  dialogVisible.value = true

  // 清除表单验证
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

// 编辑
const handleEdit = (row: PermissionItem) => {
  isEditMode.value = true

  // 直接使用角色组数据
  formData.id = row.id
  formData.title = row.title
  formData.is_all = row.is_all
  formData.sort = row.sort

  activeTab.value = 'info'
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      let res

      if (isEditMode.value) {
        // 编辑模式
        res = await editRoleApi(formData)
      } else {
        // 新增模式
        const addData: RoleAddParams = {
          title: formData.title,
          is_all: formData.is_all,
          sort: formData.sort
        }
        res = await addRoleApi(addData)
      }

      if (res.code === 0 || res.code === 1 || res.msg === '操作成功' || res.msg === '新增成功') {
        ElMessage.success(res.msg || '保存成功')
        dialogVisible.value = false
        getList()
      } else {
        ElMessage.error(res.msg || '保存失败')
      }
    } catch (error) {
      console.error('保存失败:', error)
      ElMessage.error('保存失败，请稍后重试')
    } finally {
      submitLoading.value = false
    }
  })
}

// 切换启用/禁用状态
const handleToggleStatus = async (row: PermissionItem) => {
  const isEnabled = row.status === 1
  const action = isEnabled ? '禁用' : '启用'

  try {
    await ElMessageBox.confirm(`确定要${action}角色"${row.title}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = isEnabled ? await setDisableRoleApi(row.id) : await setEnableRoleApi(row.id)

    if (res.code === 1 || res.msg === `${action}成功`) {
      ElMessage.success(res.msg || `${action}成功`)
      getList()
    } else {
      ElMessage.error(res.msg || `${action}失败`)
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error(`${action}失败:`, error)
      ElMessage.error(`${action}失败，请稍后重试`)
    }
  }
}

// 删除
const handleDelete = async (row: PermissionItem) => {
  try {
    await ElMessageBox.confirm(`确定要删除角色"${row.title}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await deleteRoleApi(row.id)

    if (res.code === 1 || res.msg === '删除成功') {
      ElMessage.success(res.msg || '删除成功')
      getList()
    } else {
      ElMessage.error(res.msg || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败，请稍后重试')
    }
  }
}

// 表格选择变化
const handleSelectionChange = (selection: PermissionItem[]) => {
  selectedIds.value = selection.map((item) => item.id)
}

// 批量启用
const handleBatchEnable = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请先选择要启用的角色')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要启用选中的 ${selectedIds.value.length} 个角色吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await setEnableRoleApi(selectedIds.value.join(','))

    if (res.code === 1 || res.msg === '启用成功') {
      ElMessage.success(res.msg || '启用成功')
      selectedIds.value = []
      getList()
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

// 批量禁用
const handleBatchDisable = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请先选择要禁用的角色')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要禁用选中的 ${selectedIds.value.length} 个角色吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await setDisableRoleApi(selectedIds.value.join(','))

    if (res.code === 1 || res.msg === '禁用成功') {
      ElMessage.success(res.msg || '禁用成功')
      selectedIds.value = []
      getList()
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

// 批量删除
const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的角色')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedIds.value.length} 个角色吗？此操作不可恢复！`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const res = await deleteRoleApi(selectedIds.value.join(','))

    if (res.code === 1 || res.msg === '删除成功') {
      ElMessage.success(res.msg || '删除成功')
      selectedIds.value = []
      getList()
    } else {
      ElMessage.error(res.msg || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败，请稍后重试')
    }
  }
}

// 页面加载时获取数据
onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
.permission-manage-container {
  padding: 0;
}

.toolbar {
  margin-bottom: 16px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.permission-tip {
  padding: 40px 20px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
}
</style>
