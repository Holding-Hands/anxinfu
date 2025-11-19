<template>
  <div class="page-container">
    <el-card class="filter-card" shadow="never">
      <!-- 筛选表单 -->
      <el-form :model="queryParams" label-width="100px" class="filter-form">
        <el-row :gutter="20">
          <!-- 代理产品 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="代理产品">
              <el-select
                v-model="queryParams.platform_id"
                placeholder="请选择"
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

          <!-- 子产品 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="产品">
              <el-select
                v-model="queryParams.product_id"
                placeholder="请选择"
                clearable
                filterable
                :disabled="!queryParams.platform_id || childProductOptions.length === 0"
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

          <!-- 操作时间 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="操作时间">
              <el-date-picker
                v-model="createTimeRange"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <!-- 操作按钮 -->
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-form-item label=" " class="filter-actions">
              <div class="action-buttons">
                <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
                <el-button :icon="Refresh" @click="handleReset">重置</el-button>
                <el-button type="success" :icon="Download" @click="handleExport">导出</el-button>
                <el-button type="warning" :icon="Upload" @click="handleOpenExcelDialog">
                  Excel入库
                </el-button>
                <!-- <el-button type="primary" @click="handleGoToStockReturn">机具退货</el-button> -->
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

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
        <el-table-column prop="id" label="ID" width="80" align="center" sortable />

        <!-- 模式 -->
        <el-table-column prop="sys_type_name" label="模式" min-width="100" align="center" />

        <!-- 产品名称 -->
        <el-table-column prop="pro_name" label="产品名称" min-width="120" align="center" />

        <!-- 数量 -->
        <el-table-column prop="count" label="数量" width="100" align="center" />

        <!-- 操作类型 -->
        <el-table-column prop="type" label="操作类型" min-width="100" align="center">
          <template #default="{ row }">
            <div v-html="row.type"></div>
          </template>
        </el-table-column>

        <!-- 操作时间 -->
        <el-table-column prop="create_time" label="操作时间" min-width="180" align="center" />

        <!-- 备注 -->
        <el-table-column prop="remarks" label="备注" min-width="120" align="center" />

        <!-- 操作员 -->
        <el-table-column prop="operator" label="操作员" min-width="120" align="center" />

        <!-- 操作 -->
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-link type="primary" :underline="false" @click="handleView(row)">查看</el-link>
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 查看详情对话框 -->
    <el-dialog v-model="viewDialogVisible" title="入库/减库详情" width="600px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="ID">{{ currentRow?.id }}</el-descriptions-item>
        <el-descriptions-item label="模式">{{ currentRow?.sys_type_name }}</el-descriptions-item>
        <el-descriptions-item label="产品名称">{{ currentRow?.pro_name }}</el-descriptions-item>
        <el-descriptions-item label="SN">{{ currentRow?.sn }}</el-descriptions-item>
        <el-descriptions-item label="数量">{{ currentRow?.count }}</el-descriptions-item>
        <el-descriptions-item label="操作类型">
          <div v-html="currentRow?.type"></div>
        </el-descriptions-item>
        <el-descriptions-item label="操作时间">{{ currentRow?.create_time }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ currentRow?.remarks }}</el-descriptions-item>
        <el-descriptions-item label="操作员">{{ currentRow?.operator }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button type="primary" @click="viewDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- Excel入库对话框 -->
    <el-dialog
      v-model="excelDialogVisible"
      title="Excel入库"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-upload
        ref="uploadRef"
        :auto-upload="false"
        :limit="1"
        :on-change="handleFileChange"
        :on-exceed="handleExceed"
        accept=".xls,.xlsx"
        drag
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">请上传Excel文件（.xls或.xlsx）</div>
        </template>
      </el-upload>
      <template #footer>
        <el-button @click="excelDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="uploading" @click="handleSubmitExcel">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Download, Refresh, Upload, UploadFilled } from '@element-plus/icons-vue'
import type { UploadInstance, UploadFile } from 'element-plus'
import { getRukuListApi, excelRukuApi, type RukuListParams, type RukuListItem } from '@/api/ruku'
import { getChildProductApi } from '@/api/user'
import { PRODUCT_OPTIONS } from '@/constants'
import { exportExcel } from '@/utils/export'

// 查询参数
const queryParams = reactive<RukuListParams>({
  page: 1,
  limit: 15,
  platform_id: '',
  product_id: '',
  create_time: ''
})

// 时间范围
const createTimeRange = ref<[string, string] | null>(null)

// 监听时间范围变化
watch(createTimeRange, (val) => {
  queryParams.create_time = val ? val.join(' - ') : ''
})

// 表格数据
const tableData = ref<RukuListItem[]>([])
const total = ref(0)
const loading = ref(false)

// 查看对话框
const viewDialogVisible = ref(false)
const currentRow = ref<RukuListItem | null>(null)

// Excel入库对话框
const excelDialogVisible = ref(false)
const uploadRef = ref<UploadInstance>()
const selectedFile = ref<File | null>(null)
const uploading = ref(false)

// 子产品选项
const childProductOptions = ref<Array<{ label: string; value: number }>>([])

// 获取子产品列表
const getChildProducts = async (platformId: number | string) => {
  if (!platformId) {
    childProductOptions.value = []
    return
  }

  try {
    const res = await getChildProductApi({ pid: Number(platformId) })
    const options: Array<{ label: string; value: number }> = []
    if (res.data) {
      Object.entries(res.data).forEach(([key, value]) => {
        options.push({
          value: Number(key),
          label: value as string
        })
      })
    }
    childProductOptions.value = options
  } catch (error) {
    console.error('获取子产品失败:', error)
    childProductOptions.value = []
  }
}

// 处理产品（平台）变化
const handlePlatformChange = async (value: number | string) => {
  queryParams.product_id = ''
  childProductOptions.value = []

  if (value) {
    await getChildProducts(value)
  }
}

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const res = await getRukuListApi(queryParams)
    console.log('入库/减库响应:', res)
    tableData.value = res.data || []
    total.value = res.count || 0
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
  queryParams.platform_id = ''
  queryParams.product_id = ''
  createTimeRange.value = null
  childProductOptions.value = []
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

// 导出
const handleExport = () => {
  if (tableData.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  const headers = [
    { key: 'id', title: 'ID' },
    { key: 'sys_type_name', title: '模式' },
    { key: 'pro_name', title: '产品名称' },
    { key: 'count', title: '数量' },
    {
      key: 'type',
      title: '操作类型',
      formatter: (value: string) => {
        // 移除 HTML 标签
        const div = document.createElement('div')
        div.innerHTML = value || ''
        return div.textContent || div.innerText || ''
      }
    },
    { key: 'create_time', title: '操作时间' },
    { key: 'remarks', title: '备注' },
    { key: 'operator', title: '操作员' }
  ]

  try {
    exportExcel({
      data: tableData.value,
      columns: headers,
      filename: '入库减库列表'
    })
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败，请稍后重试')
  }
}

// 查看
const handleView = (row: RukuListItem) => {
  currentRow.value = row
  viewDialogVisible.value = true
}

// 跳转到机具退货页面
// const handleGoToStockReturn = () => {
//   window.location.hash = '#/machine/stock-return'
// }

// 打开Excel入库对话框
const handleOpenExcelDialog = () => {
  selectedFile.value = null
  excelDialogVisible.value = true
}

// 文件选择变化
const handleFileChange = (uploadFile: UploadFile) => {
  if (uploadFile.raw) {
    selectedFile.value = uploadFile.raw
  }
}

// 文件超出限制
const handleExceed = () => {
  ElMessage.warning('最多只能上传1个文件')
}

// 提交Excel入库
const handleSubmitExcel = async () => {
  if (!selectedFile.value) {
    ElMessage.warning('请先选择文件')
    return
  }

  uploading.value = true
  try {
    const res = await excelRukuApi(selectedFile.value)
    console.log('Excel入库响应:', res)

    if (res.code === 1) {
      ElMessage.success(res.msg || '导入成功')
      excelDialogVisible.value = false
      // 刷新列表
      getList()
    } else {
      ElMessage.error(res.msg || '导入失败')
    }
  } catch (error) {
    console.error('Excel入库失败:', error)
    ElMessage.error('导入失败，请稍后重试')
  } finally {
    uploading.value = false
  }
}

onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
.page-container {
  width: 100%;

  .filter-card {
    margin-bottom: 20px;

    :deep(.el-card__body) {
      padding: 15px;
    }
  }

  .filter-form {
    .filter-actions {
      :deep(.el-form-item__content) {
        justify-content: flex-end;
      }

      .action-buttons {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: flex-end;
      }
    }
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
