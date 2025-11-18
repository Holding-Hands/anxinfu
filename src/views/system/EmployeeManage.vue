<template>
  <div class="employee-manage-container">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-form-item label="角色">
          <el-select
            v-model="queryParams.group"
            placeholder="请选择角色"
            clearable
            style="width: 200px"
          >
            <el-option label="全部" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input
            v-model="queryParams.username"
            placeholder="请输入用户名"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model="queryParams.mobile"
            placeholder="请输入手机号"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 操作按钮 -->
      <div class="toolbar">
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
      </div>

      <!-- 表格 -->
      <el-table v-loading="loading" :data="tableData" style="width: 100%" border>
        <el-table-column prop="id" label="ID" min-width="80" align="center" />

        <el-table-column prop="username" label="用户名" min-width="150" align="center" />

        <el-table-column prop="nickname" label="昵称" min-width="120" align="center" />

        <el-table-column prop="mobile" label="手机号" min-width="130" align="center" />

        <el-table-column prop="email" label="邮箱" min-width="180" align="center">
          <template #default="{ row }">
            {{ row.email || '--' }}
          </template>
        </el-table-column>

        <el-table-column prop="group_name" label="角色组" min-width="150" align="center" />

        <el-table-column label="权限" min-width="100" align="center">
          <template #default="{ row }">
            {{ row.is_admin === 1 ? '全部' : '部分' }}
          </template>
        </el-table-column>

        <el-table-column label="状态" min-width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="sort" label="排序" min-width="80" align="center" />

        <el-table-column prop="update_time" label="更新时间" min-width="180" align="center" />

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
          :total="total"
          :page-sizes="[10, 15, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="getList"
          @current-change="getList"
        />
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditMode ? '编辑员工' : '新增员工'"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="formData.username"
            placeholder="必填项，用户名唯一，不能重复"
            :disabled="isEditMode"
          />
        </el-form-item>

        <el-form-item label="角色" prop="group_name">
          <el-select
            v-model="formData.group_name"
            placeholder="请选择角色"
            multiple
            style="width: 100%"
          >
            <el-option label="暂无角色" :value="0" disabled />
          </el-select>
        </el-form-item>

        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="formData.mobile" placeholder="请输入手机号" />
        </el-form-item>

        <el-form-item label="姓名" prop="nickname">
          <el-input v-model="formData.nickname" placeholder="请输入姓名" />
        </el-form-item>

        <el-form-item label="QQ" prop="qq">
          <el-input v-model="formData.qq" placeholder="请输入QQ号" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>

        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="formData.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="formData.sort"
            :min="0"
            :max="9999"
            controls-position="right"
            style="width: 100%"
          />
          <div class="form-tip">可填项，排序只能填写数字，数字越大，排序越靠前</div>
        </el-form-item>

        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model="formData.remarks"
            type="textarea"
            :rows="3"
            placeholder="请输入备注内容"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import {
  getEmployeeListApi,
  setDisableEmployeeApi,
  setEnableEmployeeApi,
  addEmployeeApi,
  editEmployeeApi,
  type EmployeeParams,
  type EmployeeItem,
  type EmployeeAddParams
} from '@/api/employee'

// 查询参数
const queryParams = reactive<EmployeeParams>({
  page: 1,
  limit: 15,
  group: 0,
  username: '',
  mobile: ''
})

// 表格数据
const tableData = ref<EmployeeItem[]>([])
const total = ref(0)
const loading = ref(false)

// 弹窗相关
const dialogVisible = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()
const isEditMode = ref(false)

// 表单数据
const formData = reactive<EmployeeAddParams & { id?: number }>({
  id: 0,
  username: '',
  mobile: '',
  nickname: '',
  qq: '',
  email: '',
  sex: 1,
  sort: 0,
  remarks: '',
  group_name: []
})

// 表单验证规则
const formRules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号格式',
      trigger: 'blur'
    }
  ],
  nickname: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    {
      pattern: /^[\u4e00-\u9fa5a-zA-Z]{2,20}$/,
      message: '姓名为2-20位中文或字母',
      trigger: 'blur'
    }
  ],
  qq: [
    {
      pattern: /^[1-9]\d{4,10}$/,
      message: '请输入正确的QQ号格式（5-11位数字）',
      trigger: 'blur'
    }
  ],
  email: [
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: '请输入正确的邮箱格式',
      trigger: 'blur'
    }
  ]
}

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const params = {
      ...queryParams,
      group: queryParams.group || 0,
      username: queryParams.username || '',
      mobile: queryParams.mobile || ''
    }
    const res = await getEmployeeListApi(params)
    if (res.code === 0) {
      tableData.value = res.data
      total.value = res.count
    } else {
      ElMessage.error(res.msg || '获取数据失败')
    }
  } catch (error) {
    console.error('获取员工列表失败:', error)
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
  queryParams.limit = 15
  queryParams.group = 0
  queryParams.username = ''
  queryParams.mobile = ''
  getList()
}

// 新增
const handleAdd = () => {
  isEditMode.value = false

  // 重置表单，默认选中第一个角色（如果有的话）
  Object.assign(formData, {
    id: 0,
    username: '',
    mobile: '',
    nickname: '',
    qq: '',
    email: '',
    sex: 1,
    sort: 0,
    remarks: '',
    group_name: [1] // 默认选中角色ID为1
  })

  // 清除表单验证
  if (formRef.value) {
    formRef.value.clearValidate()
  }

  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: EmployeeItem) => {
  isEditMode.value = true

  // 填充表单数据
  Object.assign(formData, {
    id: row.id,
    username: row.username,
    mobile: row.mobile,
    nickname: row.nickname,
    qq: row.qq,
    email: row.email,
    sex: row.sex,
    sort: row.sort,
    remarks: row.remarks,
    group_name: row.groups?.map((g) => g.id) || []
  })

  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      const res = isEditMode.value
        ? await editEmployeeApi(formData as any)
        : await addEmployeeApi(formData)

      // code: 1 表示成功，code: 0 表示失败
      if (res.code === 1) {
        ElMessage.success(res.msg || (isEditMode.value ? '编辑成功' : '新增成功'))
        dialogVisible.value = false
        getList()
      } else {
        ElMessage.error(res.msg || '操作失败')
      }
    } catch (error) {
      console.error('提交失败:', error)
      ElMessage.error('操作失败，请稍后重试')
    } finally {
      submitLoading.value = false
    }
  })
}

// 切换启用/禁用状态
const handleToggleStatus = async (row: EmployeeItem) => {
  const isEnabled = row.status === 1
  const action = isEnabled ? '禁用' : '启用'

  try {
    await ElMessageBox.confirm(`确定要${action}员工"${row.nickname}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = isEnabled ? await setDisableEmployeeApi(row.id) : await setEnableEmployeeApi(row.id)

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
const handleDelete = async (row: EmployeeItem) => {
  try {
    await ElMessageBox.confirm(`确定要删除员工"${row.nickname}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // TODO: 调用删除接口
    ElMessage.success('删除成功')
    getList()
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
.employee-manage-container {
  padding: 0;
}

.search-form {
  margin-bottom: 16px;
}

.toolbar {
  margin-bottom: 16px;
}

.table-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
}

.pagination-container {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
</style>
