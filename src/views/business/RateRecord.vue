<template>
  <div class="rate-record-container">
    <!-- 筛选条件 -->
    <el-card shadow="never" class="filter-card">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="代理产品">
              <el-select
                v-model="filterForm.platform_id"
                placeholder="全部"
                clearable
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
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="产品">
              <el-select v-model="filterForm.product_id" placeholder="全部" clearable>
                <el-option
                  v-for="item in productList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="代理姓名">
              <el-input
                v-model="filterForm.uName"
                placeholder="请输入代理姓名"
                clearable
                @keyup.enter="handleSearch"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="处理状态">
              <el-select v-model="filterForm.status" placeholder="全部" clearable>
                <el-option label="全部" value="" />
                <el-option label="审核中" value="0" />
                <el-option label="已通过" value="1" />
                <el-option label="失败" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-form-item class="filter-actions">
              <div class="action-buttons">
                <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
                <el-button :icon="Refresh" @click="handleReset">重置</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card shadow="never" class="table-card">
      <el-table v-loading="loading" :data="tableData" border stripe>
        <el-table-column type="index" label="ID" width="60" align="center" />
        <el-table-column prop="uName" label="代理姓名" width="120" align="center" />
        <el-table-column prop="pName" label="产品名称" width="120" align="center" />
        <el-table-column prop="sn" label="SN" width="180" align="center" />
        <el-table-column prop="merchant_name" label="商户名" width="120" align="center" />
        <el-table-column prop="merchant_code" label="商户号" width="180" align="center" />
        <el-table-column prop="card_price" label="贷记卡" width="80" align="center" />
        <el-table-column prop="code_price" label="扫码" width="80" align="center" />
        <el-table-column prop="jjk_price" label="借贷卡" width="80" align="center" />
        <el-table-column prop="top_fee" label="封顶" width="80" align="center" />
        <el-table-column prop="t0_money" label="秒到" width="80" align="center" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <span v-html="row.status_name"></span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="120" align="center" />
        <el-table-column prop="create_time" label="审核时间" width="160" align="center" />
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.limit"
        :total="pagination.total"
        :page-sizes="[15, 30, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { getRateListApi, type RateItem, type RateListParams } from '@/api/rate'
import { getChildProductApi } from '@/api/user'
import { PRODUCT_OPTIONS } from '@/constants'

// 筛选表单
const filterForm = reactive({
  platform_id: '',
  product_id: '',
  uName: '',
  status: ''
})

// 产品列表
const productList = ref<Array<{ label: string; value: string }>>([])

// 表格数据
const tableData = ref<RateItem[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  limit: 15,
  total: 0
})

// 获取子产品列表
const getChildProducts = async (platformId: number | string) => {
  try {
    const res = await getChildProductApi({ pid: Number(platformId) })
    if (res.code === 0 && res.data) {
      productList.value = Object.entries(res.data).map(([value, label]) => ({
        label: label as string,
        value: value
      }))
    }
  } catch (error) {
    console.error('获取子产品列表失败:', error)
  }
}

// 平台改变时获取产品列表
const handlePlatformChange = async (value: string) => {
  filterForm.product_id = ''
  productList.value = []
  if (value) {
    await getChildProducts(value)
  }
}

// 获取费率记录列表
const getRateList = async () => {
  loading.value = true
  try {
    const params: RateListParams = {
      page: pagination.page,
      limit: pagination.limit,
      platform_id: filterForm.platform_id,
      product_id: filterForm.product_id,
      uName: filterForm.uName,
      status: filterForm.status
    }

    const res = await getRateListApi(params)
    if (res.code === 0) {
      tableData.value = res.data
      pagination.total = Number(res.count)
    } else {
      ElMessage.error(res.msg || '获取费率记录失败')
    }
  } catch (error) {
    console.error('获取费率记录失败:', error)
    ElMessage.error('获取费率记录失败')
  } finally {
    loading.value = false
  }
}

// 查询
const handleSearch = () => {
  pagination.page = 1
  getRateList()
}

// 重置
const handleReset = () => {
  filterForm.platform_id = ''
  filterForm.product_id = ''
  filterForm.uName = ''
  filterForm.status = ''
  productList.value = []
  pagination.page = 1
  getRateList()
}

// 分页大小改变
const handleSizeChange = () => {
  pagination.page = 1
  getRateList()
}

// 当前页改变
const handleCurrentChange = () => {
  getRateList()
}

onMounted(() => {
  getRateList()
})
</script>

<style scoped lang="scss">
.rate-record-container {
  padding: 20px;

  .filter-card {
    margin-bottom: 20px;

    .filter-form {
      :deep(.el-form-item) {
        margin-bottom: 16px;
        width: 100%;

        .el-input,
        .el-select,
        .el-date-editor {
          width: 100%;
        }
      }

      .filter-actions {
        margin-bottom: 0;

        :deep(.el-form-item__content) {
          width: 100%;
        }

        .action-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          flex-wrap: wrap;
          width: 100%;
        }
      }
    }
  }

  .table-card {
    .pagination {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
