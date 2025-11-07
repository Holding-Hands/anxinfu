<template>
  <div class="page-container">
    <!-- 搜索筛选区域 -->
    <el-card class="filter-card" shadow="never">
      <el-form :model="queryParams" label-width="100px" class="filter-form">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="模式">
              <el-select
                v-model="queryParams.sys_type"
                placeholder="全部"
                clearable
                filterable
                @change="handleQuery"
              >
                <el-option
                  v-for="item in SYS_TYPE_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

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
                v-model="queryParams.name"
                placeholder="请输入产品名称"
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
        <el-table-column prop="sys_type_name" label="模式" width="120" align="center" />
        <el-table-column prop="name" label="产品名称" min-width="150" align="center" />

        <el-table-column label="封面图片" width="120" align="center">
          <template #default="{ row }">
            <el-image
              v-if="getCoverImageUrl(row.cover)"
              :src="getCoverImageUrl(row.cover)"
              :preview-src-list="[getCoverImageUrl(row.cover)]"
              fit="cover"
              style="width: 50px; height: 50px; border-radius: 4px"
            />
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column label="采购升级" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.is_level"
              :active-value="1"
              :inactive-value="0"
              active-text="是"
              inactive-text="否"
              @change="handleLevelChange(row)"
            />
          </template>
        </el-table-column>

        <el-table-column label="积分价格" width="120" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEditCoinPrice(row)">
              <span v-html="row.show_coin_price || row.coin_price"></span>
            </el-button>
          </template>
        </el-table-column>

        <el-table-column prop="yajin_month" label="押金考核时长" width="130" align="center" />

        <el-table-column prop="yajin_yeji" label="押金考核要求" width="130" align="center" />

        <el-table-column prop="profit_ratio" label="客户奖励(万元)" width="140" align="center" />

        <el-table-column prop="point_ratio" label="客户抽奖积分(万元)" width="160" align="center" />

        <el-table-column prop="wjh_days" label="伪激活天数" width="120" align="center">
          <template #default="{ row }">{{ row.wjh_days }}天</template>
        </el-table-column>

        <el-table-column prop="wjh_yeji" label="伪激活业绩" width="120" align="center" />

        <el-table-column prop="wjh_kk_money" label="伪激活扣款" width="120" align="center" />

        <el-table-column prop="active_cycle" label="激活时长" width="120" align="center" />

        <el-table-column prop="active_yeji" label="激活要求" width="120" align="center" />

        <el-table-column prop="first_cycle" label="达标周期(一)" width="130" align="center" />

        <el-table-column prop="first_yeji" label="达标标准(一)" width="130" align="center" />

        <el-table-column prop="second_cycle" label="达标周期(二)" width="130" align="center" />

        <el-table-column prop="second_yeji" label="达标标准(二)" width="130" align="center" />

        <el-table-column label="状态" width="120" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
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

    <!-- 新增/编辑产品弹窗 -->
    <ProductForm v-model:visible="formVisible" :edit-data="editData" @success="handleFormSuccess" />

    <!-- 积分价格编辑弹窗 -->
    <el-dialog
      v-model="coinPriceVisible"
      title="操作1的积分价格"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="coinPriceForm" label-width="100px">
        <el-form-item label="积分价格">
          <el-input v-model="coinPriceForm.coin_price" placeholder="0.00" />
        </el-form-item>
        <el-form-item label="起兑数量">
          <el-input v-model="coinPriceForm.limit_dui" placeholder="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="coinPriceVisible = false">取消</el-button>
        <el-button type="primary" :loading="coinPriceLoading" @click="handleCoinPriceSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Delete, Edit } from '@element-plus/icons-vue'
import { SYS_TYPE_OPTIONS, PRODUCT_OPTIONS } from '@/constants'
import { request } from '@/utils/request'
import ProductForm from './ProductForm.vue'

// 定义产品列表项接口
interface ProductListItem {
  id: number
  sys_type: number
  sys_type_name: string
  name: string
  cover: string
  is_level: number
  coin_price: string
  show_coin_price?: string
  yajin_month: string
  yajin_yeji: string
  profit_ratio: string
  point_ratio: string
  wjh_days: number
  wjh_yeji: string
  wjh_kk_money: string
  active_cycle: string
  active_yeji: string
  first_cycle: string
  first_yeji: string
  second_cycle: string
  second_yeji: string
  status: number
  pid: number
  m_id: number
  yajin_type: number
  yajin_money: string
  active_type: number
  first_type: number
  second_type: number
  third_cycle?: string
  third_yeji?: string
  third_type?: number
  hb_days?: number
  hb_kk_money?: string
  limit_dui?: number
  sort?: number
  create_time?: string
  update_time?: string
}

// 定义查询参数接口
interface ProductQueryParams {
  page: number
  limit: number
  sys_type: string | number
  pid: number
  name: string
}

// 定义API响应接口
interface ProductListResponse {
  code: number
  msg: string
  count: number
  data: ProductListItem[]
}

// 查询参数
const queryParams = reactive<ProductQueryParams>({
  page: 1,
  limit: 15,
  sys_type: '',
  pid: 0,
  name: ''
})

// 表格数据
const tableData = ref<ProductListItem[]>([])
const total = ref(0)
const loading = ref(false)

// 表单相关
const formVisible = ref(false)
const editData = ref<ProductListItem | undefined>(undefined)
const selectedIds = ref<number[]>([]) // 选中的行ID

// 积分价格编辑
const coinPriceVisible = ref(false)
const coinPriceLoading = ref(false)
const coinPriceForm = reactive({
  id: 0,
  coin_price: '',
  limit_dui: ''
})

// 提取封面图片URL
const getCoverImageUrl = (cover: string): string => {
  if (!cover) return ''
  // 从HTML字符串中提取图片URL
  const match = cover.match(/src="([^"]+)"/)
  return match ? match[1] : ''
}

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const params = {
      page: queryParams.page,
      limit: queryParams.limit,
      sys_type: queryParams.sys_type,
      pid: queryParams.pid,
      name: queryParams.name
    }

    const res = await request.get<ProductListResponse>('/index/product/getlist.html', { params })

    console.log('产品列表响应:', res)

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

// 查询
const handleQuery = () => {
  queryParams.page = 1
  getList()
}

// 重置
const handleReset = () => {
  queryParams.page = 1
  queryParams.limit = 15
  queryParams.sys_type = ''
  queryParams.pid = 0
  queryParams.name = ''
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
const handleEdit = (row: ProductListItem) => {
  editData.value = { ...row }
  formVisible.value = true
}

// 表单提交成功
const handleFormSuccess = () => {
  getList()
}

// 选择行变化
const handleSelectionChange = (selection: ProductListItem[]) => {
  selectedIds.value = selection.map((item) => item.id)
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的产品')
    return
  }

  try {
    await ElMessageBox.confirm('确定要删除选中的产品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const formData = new URLSearchParams()
    formData.append('ids', selectedIds.value.join(','))

    const res = await request.post('/index/product/del.html', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

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

// 编辑积分价格
const handleEditCoinPrice = (row: ProductListItem) => {
  coinPriceForm.id = row.id
  coinPriceForm.coin_price = row.coin_price
  coinPriceForm.limit_dui = String(row.limit_dui || 1)
  coinPriceVisible.value = true
}

// 提交积分价格
const handleCoinPriceSubmit = async () => {
  coinPriceLoading.value = true
  try {
    const formData = new URLSearchParams()
    formData.append('id', String(coinPriceForm.id))
    formData.append('coin_price', coinPriceForm.coin_price)
    formData.append('limit_dui', coinPriceForm.limit_dui)

    const res = await request.post('/index/product/coin_price_set.html', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    // 操作接口：code: 1 表示成功
    if (res.code === 1) {
      ElMessage.success(res.msg || '设置成功')
      coinPriceVisible.value = false
      getList()
    } else {
      ElMessage.error(res.msg || '设置失败')
    }
  } catch (error) {
    ElMessage.error('设置失败，请稍后重试')
  } finally {
    coinPriceLoading.value = false
  }
}

// 采购升级状态切换
const handleLevelChange = async (row: ProductListItem) => {
  const isEnable = row.is_level === 1
  const url = isEnable ? '/index/product/setenlevel.html' : '/index/product/setdislevel.html'
  const action = isEnable ? '启用采购升级' : '禁用采购升级'

  try {
    const formData = new URLSearchParams()
    formData.append('ids', String(row.id))

    const res = await request.post(url, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    console.log('采购升级响应:', res)
    // 操作接口：code: 1 表示成功
    if (res.code === 1) {
      ElMessage.success(res.msg || `${action}成功`)
      getList()
    } else {
      ElMessage.error(res.msg || `${action}失败`)
      // 失败时恢复原状态
      row.is_level = isEnable ? 0 : 1
    }
  } catch (error) {
    console.error(`${action}失败:`, error)
    ElMessage.error(`${action}失败，请稍后重试`)
    // 失败时恢复原状态
    row.is_level = isEnable ? 0 : 1
  }
}

// 产品状态切换
const handleStatusChange = async (row: ProductListItem) => {
  const isEnable = row.status === 1
  const url = isEnable ? '/index/product/setenable.html' : '/index/product/setdisable.html'
  const action = isEnable ? '启用产品' : '禁用产品'

  try {
    const formData = new URLSearchParams()
    formData.append('ids', String(row.id))

    const res = await request.post(url, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    // 操作接口：code: 1 表示成功
    if (res.code === 1) {
      ElMessage.success(res.msg || `${action}成功`)
      await getList()
    } else {
      ElMessage.error(res.msg || `${action}失败`)
      // 失败时恢复原状态
      row.status = isEnable ? 0 : 1
    }
  } catch (error) {
    console.error(`${action}失败:`, error)
    ElMessage.error(`${action}失败，请稍后重试`)
    // 失败时恢复原状态
    row.status = isEnable ? 0 : 1
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
