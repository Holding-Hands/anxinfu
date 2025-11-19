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

          <!-- 模式 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="模式">
              <el-select v-model="queryParams.sys_type" placeholder="全部" clearable>
                <el-option label="全部" value="" />
                <el-option label="1.0模式" :value="1" />
                <el-option label="2.0模式" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- SN -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="sn">
              <el-input
                v-model="queryParams.sn"
                placeholder="请输入sn"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <!-- 状态 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="状态">
              <el-select v-model="queryParams.status" placeholder="全部" clearable>
                <el-option label="全部" value="" />
                <el-option label="未划拨" :value="1" />
                <el-option label="已划拨" :value="2" />
                <el-option label="已绑定" :value="3" />
                <el-option label="已激活" :value="4" />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 达标状态 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="达标状态">
              <el-select v-model="queryParams.dabiao_status" placeholder="全部" clearable>
                <el-option label="全部" value="" />
                <el-option label="激活" :value="1" />
                <el-option label="一次达标" :value="2" />
                <el-option label="二次达标" :value="3" />
                <el-option label="三次达标" :value="4" />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 购机类型 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="购机类型">
              <el-select v-model="queryParams.is_jf" placeholder="全部" clearable>
                <el-option label="全部" value="" />
                <el-option label="现金购机" :value="0" />
                <el-option label="积分购机" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 入库时间 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="入库时间">
              <el-date-picker
                v-model="createTimeRange"
                type="datetimerange"
                range-separator="-"
                start-placeholder="请选择起止日期"
                end-placeholder=""
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <!-- 划拨时间 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="划拨时间">
              <el-date-picker
                v-model="huaboTimeRange"
                type="datetimerange"
                range-separator="-"
                start-placeholder="请选择起止日期"
                end-placeholder=""
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <!-- 商户时间 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="商户时间">
              <el-date-picker
                v-model="merchantTimeRange"
                type="datetimerange"
                range-separator="-"
                start-placeholder="请选择起止日期"
                end-placeholder=""
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <!-- 一次达标时间 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="一次达标时间">
              <el-date-picker
                v-model="firstTimeRange"
                type="datetimerange"
                range-separator="-"
                start-placeholder="请选择起止日期"
                end-placeholder=""
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <!-- 到期时间 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="到期时间">
              <el-date-picker
                v-model="endTimeRange"
                type="datetimerange"
                range-separator="-"
                start-placeholder="请选择起止日期"
                end-placeholder=""
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <!-- 商户手机号 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="商户手机号">
              <el-input
                v-model="queryParams.mobile"
                placeholder="请输入商户手机号"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <!-- 盟友姓名 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="盟友姓名">
              <el-input
                v-model="queryParams.name"
                placeholder="请输入盟友姓名"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>

          <!-- 商户身份证号 -->
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="商户身份证号">
              <el-input
                v-model="queryParams.mer_idcard"
                placeholder="请输入商户身份证号"
                clearable
                @keyup.enter="handleQuery"
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
                <el-button type="primary" @click="handleModifyExpiry">修改到期时间</el-button>
                <el-button type="warning" @click="handleModifySimTier">改流量费档位</el-button>
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="id" label="ID" min-width="80" align="center" />

        <!-- 用户 -->
        <el-table-column prop="username" label="用户" min-width="150" align="center">
          <template #default="{ row }">
            <div v-html="row.username"></div>
          </template>
        </el-table-column>

        <!-- 产品名称 -->
        <el-table-column prop="pro_name" label="产品名称" min-width="120" align="center" />

        <!-- 模式 -->
        <el-table-column prop="sys_type_name" label="模式" min-width="100" align="center" />

        <!-- SN -->
        <el-table-column prop="sn" label="SN" min-width="180" align="center" />

        <!-- 押金 -->
        <el-table-column prop="yajin_money" label="押金" min-width="100" align="center" />

        <!-- 流量费 -->
        <el-table-column prop="sim_money" label="流量费" min-width="100" align="center" />

        <!-- 初始费率 -->
        <el-table-column prop="cs_rate" label="初始费率" min-width="100" align="center" />

        <!-- 新费率 -->
        <el-table-column prop="new_rate" label="新费率" min-width="100" align="center" />

        <!-- 状态 -->
        <el-table-column prop="status" label="状态" min-width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === 1" type="info">未划拨</el-tag>
            <el-tag v-else-if="row.status === 2" type="warning">已划拨</el-tag>
            <el-tag v-else-if="row.status === 3" type="primary">已绑定</el-tag>
            <el-tag v-else-if="row.status === 4" type="success">已激活</el-tag>
            <el-tag v-else>未知</el-tag>
          </template>
        </el-table-column>

        <!-- 达标状态 -->
        <el-table-column prop="dabiao_status" label="达标状态" min-width="120" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.dabiao_status === 1" type="info">激活</el-tag>
            <el-tag v-else-if="row.dabiao_status === 2" type="warning">一次达标</el-tag>
            <el-tag v-else-if="row.dabiao_status === 3" type="primary">二次达标</el-tag>
            <el-tag v-else-if="row.dabiao_status === 4" type="success">三次达标</el-tag>
            <el-tag v-else>未知</el-tag>
          </template>
        </el-table-column>

        <!-- 购机类型 -->
        <el-table-column prop="is_jf" label="购机类型" min-width="100" align="center" />

        <!-- 登记手机号 -->
        <el-table-column prop="mobile" label="登记手机号" min-width="130" align="center" />

        <!-- 已达标申请 -->
        <el-table-column prop="all_money" label="已达标申请" min-width="120" align="center" />

        <!-- 入库时间 -->
        <el-table-column prop="create_time" label="入库时间" min-width="180" align="center" />

        <!-- 划拨时间 -->
        <el-table-column prop="huabo_time" label="划拨时间" min-width="180" align="center" />

        <!-- 商户时间 -->
        <el-table-column prop="merchant_time" label="商户时间" min-width="180" align="center" />

        <!-- 一次达标时间 -->
        <el-table-column prop="first_time" label="一次达标时间" min-width="180" align="center" />

        <!-- 身份证 -->
        <el-table-column prop="mer_idcard" label="身份证" min-width="180" align="center" />

        <!-- 到期时间 -->
        <el-table-column prop="end_time" label="到期时间" min-width="180" align="center" />

        <!-- 业绩 -->
        <el-table-column prop="all_money" label="业绩" min-width="120" align="center" />

        <!-- 操作 -->
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-link type="primary" :underline="false" @click="handleEdit(row)">编辑</el-link>
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

    <!-- 修改到期时间对话框 -->
    <el-dialog
      v-model="expiryDialogVisible"
      title="选择到期时间"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form label-width="100px">
        <el-form-item label="到期时间">
          <el-date-picker
            v-model="expiryDate"
            type="date"
            placeholder="请选择到期时间"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="expiryDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitExpiry">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 改流量费档位对话框 -->
    <el-dialog
      v-model="simTierDialogVisible"
      title="选择流量费档位"
      width="500px"
      :close-on-click-modal="false"
    >
      <div style="color: #f56c6c; margin-bottom: 15px; font-size: 14px">
        (该操作不同步官方流量费接口，请确认已选机具在官方已修改为该档位流量费)
      </div>
      <el-form label-width="120px">
        <el-form-item label="流量费档位:">
          <el-select v-model="selectedSimTier" placeholder="请选择" style="width: 100%">
            <el-option label="通讯费返现53---68" :value="1" />
            <el-option label="通讯费99元---99" :value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="simTierDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitSimTier">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Download, Refresh } from '@element-plus/icons-vue'
import {
  getStockListApi,
  modifyExpiryTimeApi,
  updateSimTierApi,
  type StockListParams,
  type StockListItem
} from '@/api/stock'
import { getChildProductApi } from '@/api/user'
import { PRODUCT_OPTIONS } from '@/constants'
import { exportExcel } from '@/utils/export'

// 查询参数
const queryParams = reactive<StockListParams>({
  page: 1,
  limit: 15,
  platform_id: '',
  product_id: '',
  sys_type: '',
  sn: '',
  status: '',
  dabiao_status: '',
  is_jf: '',
  create_time: '',
  merchant_time: '',
  huabo_time: '',
  first_time: '',
  end_time: '',
  mobile: '',
  name: '',
  mer_idcard: ''
})

// 时间范围
const createTimeRange = ref<[string, string] | null>(null)
const merchantTimeRange = ref<[string, string] | null>(null)
const huaboTimeRange = ref<[string, string] | null>(null)
const firstTimeRange = ref<[string, string] | null>(null)
const endTimeRange = ref<[string, string] | null>(null)

// 监听时间范围变化
watch(createTimeRange, (val) => {
  queryParams.create_time = val ? val.join(' - ') : ''
})
watch(merchantTimeRange, (val) => {
  queryParams.merchant_time = val ? val.join(' - ') : ''
})
watch(huaboTimeRange, (val) => {
  queryParams.huabo_time = val ? val.join(' - ') : ''
})
watch(firstTimeRange, (val) => {
  queryParams.first_time = val ? val.join(' - ') : ''
})
watch(endTimeRange, (val) => {
  queryParams.end_time = val ? val.join(' - ') : ''
})

// 表格数据
const tableData = ref<StockListItem[]>([])
const total = ref(0)
const loading = ref(false)
const selectedRows = ref<StockListItem[]>([])

// 子产品选项
const childProductOptions = ref<Array<{ label: string; value: number }>>([])

// 修改到期时间对话框
const expiryDialogVisible = ref(false)
const expiryDate = ref('')

// 改流量费档位对话框
const simTierDialogVisible = ref(false)
const selectedSimTier = ref<number>()

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
    const res = await getStockListApi(queryParams)
    console.log('机具查询响应:', res)
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
  queryParams.sys_type = ''
  queryParams.sn = ''
  queryParams.status = ''
  queryParams.dabiao_status = ''
  queryParams.is_jf = ''
  queryParams.mobile = ''
  queryParams.name = ''
  queryParams.mer_idcard = ''
  createTimeRange.value = null
  merchantTimeRange.value = null
  huaboTimeRange.value = null
  firstTimeRange.value = null
  endTimeRange.value = null
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

// 表格选择变化
const handleSelectionChange = (selection: StockListItem[]) => {
  selectedRows.value = selection
}

// 导出
const handleExport = () => {
  if (tableData.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  const headers = [
    { key: 'id', title: 'ID' },
    {
      key: 'username',
      title: '用户',
      formatter: (value: string) => {
        // 移除 HTML 标签
        const div = document.createElement('div')
        div.innerHTML = value || ''
        return div.textContent || div.innerText || ''
      }
    },
    { key: 'pro_name', title: '产品名称' },
    { key: 'sys_type_name', title: '模式' },
    { key: 'sn', title: 'SN' },
    { key: 'yajin_money', title: '押金' },
    { key: 'sim_money', title: '流量费' },
    { key: 'cs_rate', title: '初始费率' },
    { key: 'new_rate', title: '新费率' },
    {
      key: 'status',
      title: '状态',
      formatter: (value: number) => {
        const statusMap: Record<number, string> = {
          1: '未划拨',
          2: '已划拨',
          3: '已绑定',
          4: '已激活'
        }
        return statusMap[value] || '未知'
      }
    },
    {
      key: 'dabiao_status',
      title: '达标状态',
      formatter: (value: number) => {
        const statusMap: Record<number, string> = {
          1: '激活',
          2: '一次达标',
          3: '二次达标',
          4: '三次达标'
        }
        return statusMap[value] || '未知'
      }
    },
    { key: 'is_jf', title: '购机类型' },
    { key: 'mobile', title: '登记手机号' },
    { key: 'all_money', title: '已达标申请' },
    { key: 'create_time', title: '入库时间' },
    { key: 'huabo_time', title: '划拨时间' },
    { key: 'merchant_time', title: '商户时间' },
    { key: 'first_time', title: '一次达标时间' },
    { key: 'mer_idcard', title: '身份证' },
    { key: 'end_time', title: '到期时间' }
  ]

  try {
    exportExcel({
      data: tableData.value,
      columns: headers,
      filename: '机具查询列表'
    })
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败，请稍后重试')
  }
}

// 修改到期时间
const handleModifyExpiry = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要修改的数据')
    return
  }
  expiryDate.value = ''
  expiryDialogVisible.value = true
}

// 提交修改到期时间
const handleSubmitExpiry = async () => {
  if (!expiryDate.value) {
    ElMessage.warning('请选择到期时间')
    return
  }

  try {
    const stockIds = selectedRows.value.map((row) => row.id)
    const res = await modifyExpiryTimeApi({
      end_time: expiryDate.value,
      stock_ids: stockIds
    })

    console.log('修改到期时间响应:', res)
    if (res.code === 1) {
      ElMessage.success(res.msg || '修改成功')
      expiryDialogVisible.value = false
      expiryDate.value = ''
      // 刷新列表
      getList()
    } else {
      ElMessage.error(res.msg || '修改失败')
    }
  } catch (error) {
    console.error('修改到期时间失败:', error)
    ElMessage.error('修改失败，请稍后重试')
  }
}

// 改流量费档位
const handleModifySimTier = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要修改的数据')
    return
  }

  // 检查是否所有选中的机具都是"已划拨"状态（status=2）
  const hasInvalidStatus = selectedRows.value.some((row) => row.status !== 2)
  if (hasInvalidStatus) {
    ElMessage.warning('只能设置已划拨状态的机器！')
    return
  }

  selectedSimTier.value = undefined
  simTierDialogVisible.value = true
}

// 提交改流量费档位
const handleSubmitSimTier = async () => {
  if (!selectedSimTier.value) {
    ElMessage.warning('请选择流量费档位')
    return
  }

  try {
    const stockIds = selectedRows.value.map((row) => row.id)
    const res = await updateSimTierApi({
      sim_id: selectedSimTier.value,
      stock_ids: stockIds
    })

    console.log('修改流量费档位响应:', res)
    if (res.code === 1) {
      ElMessage.success(res.msg || '修改成功')
      simTierDialogVisible.value = false
      selectedSimTier.value = undefined
      // 刷新列表
      getList()
    } else {
      ElMessage.error(res.msg || '修改失败')
    }
  } catch (error) {
    console.error('修改流量费档位失败:', error)
    ElMessage.error('修改失败，请稍后重试')
  }
}

// 编辑
const handleEdit = (row: StockListItem) => {
  ElMessage.info(`编辑机具 ID: ${row.id}`)
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
