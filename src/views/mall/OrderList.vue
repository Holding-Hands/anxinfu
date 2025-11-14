<template>
  <div class="page-container">
    <!-- 搜索区域 -->
    <el-card shadow="never" style="margin-bottom: 10px">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="用户手机号">
          <el-input
            v-model="queryParams.user_mobile"
            placeholder="请输入手机号"
            clearable
            style="width: 180px"
          />
        </el-form-item>

        <el-form-item label="下单时间">
          <el-input
            v-model="queryParams.create_time"
            placeholder="请输入时间"
            clearable
            style="width: 180px"
          />
        </el-form-item>

        <el-form-item label="状态">
          <el-select
            v-model="queryParams.status_id"
            placeholder="全部"
            filterable
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="item in ORDER_STATUS_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="支付方式">
          <el-select
            v-model="queryParams.pay_type"
            placeholder="全部"
            filterable
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="item in ORDER_PAY_TYPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
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
        <el-table-column prop="id" label="ID" width="80" align="center" fixed="left" />
        <el-table-column prop="oid" label="订单号" width="180" align="center" />
        <el-table-column prop="username" label="用户" width="120" align="center" />
        <el-table-column prop="user_mobile" label="手机号" width="130" align="center" />
        <el-table-column prop="create_time" label="下单时间" width="160" align="center" />
        <el-table-column prop="money" label="订单金额" width="120" align="center">
          <template #default="{ row }">
            <span style="color: #f56c6c; font-weight: bold">¥{{ row.money }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payable" label="实付金额" width="120" align="center">
          <template #default="{ row }">
            <span style="color: #67c23a; font-weight: bold">¥{{ row.payable }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="收货地址" min-width="200" align="center">
          <template #default="{ row }">
            {{ row.address || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="支付方式" width="120" align="center">
          <template #default="{ row }">
            <span v-html="row.pay_type"></span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120" align="center">
          <template #default="{ row }">
            <span v-html="row.status"></span>
          </template>
        </el-table-column>
        <el-table-column label="商品详情" min-width="600" align="center">
          <template #default="{ row }">
            <div v-html="row.goods_detail"></div>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="150" align="center">
          <template #default="{ row }">
            {{ row.remark || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="handleTransfer(row)">
              划拨机具
            </el-button>
            <el-button type="success" size="small" link @click="handleShip(row)">发货</el-button>
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

    <!-- 划拨机具弹窗 -->
    <el-dialog
      v-model="transferDialogVisible"
      :title="`下发机具：${transferForm.username} - ${transferForm.oid}`"
      width="600px"
      draggable
      align-center
      :close-on-click-modal="false"
    >
      <el-form
        ref="transferFormRef"
        :model="transferForm"
        :rules="transferFormRules"
        label-width="100px"
      >
        <el-form-item label="产品名称" prop="product_id">
          <el-select
            v-model="transferForm.product_id"
            placeholder="请选择"
            filterable
            clearable
            style="width: 100%"
            @change="handleProductChange"
          >
            <el-option
              v-for="item in PRODUCT_OPTIONS.slice(1)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="押金规格" prop="active_id">
          <el-select
            v-model="transferForm.active_id"
            placeholder="请选择"
            filterable
            clearable
            style="width: 100%"
            :disabled="!transferForm.product_id"
          >
            <el-option
              v-for="item in activeList"
              :key="item.id"
              :label="item.active_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="流量档位" prop="sim_id">
          <el-select
            v-model="transferForm.sim_id"
            placeholder="请选择"
            filterable
            clearable
            style="width: 100%"
            :disabled="!transferForm.product_id"
          >
            <el-option v-for="item in simList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <el-button type="info" @click="handleOpenDeviceFilter">筛选机具</el-button>
          <div>
            <el-button @click="transferDialogVisible = false">取消</el-button>
            <el-button type="primary" :loading="transferFormLoading" @click="handleTransferSubmit">
              确定
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>

    <!-- 筛选机具弹窗 -->
    <el-dialog
      v-model="deviceFilterVisible"
      title="筛选机具列表"
      width="900px"
      draggable
      align-center
      :close-on-click-modal="false"
    >
      <el-form :inline="true" :model="deviceFilterParams">
        <el-form-item label="产品名称">
          <el-select
            v-model="deviceFilterParams.product_id"
            placeholder="请选择"
            filterable
            clearable
            style="width: 150px"
          >
            <el-option
              v-for="item in PRODUCT_OPTIONS.slice(1)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="入库时间">
          <el-input
            v-model="deviceFilterParams.create_time"
            placeholder="请输入时间"
            clearable
            style="width: 280px"
          />
        </el-form-item>

        <el-form-item label="起始SN">
          <el-input
            v-model="deviceFilterParams.sn_begin"
            placeholder="起始SN"
            clearable
            style="width: 120px"
          />
        </el-form-item>

        <el-form-item label="结束SN">
          <el-input
            v-model="deviceFilterParams.sn_end"
            placeholder="结束SN"
            clearable
            style="width: 120px"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleDeviceSearch">筛选机具</el-button>
        </el-form-item>
      </el-form>

      <div style="margin-top: 20px">
        <div style="margin-bottom: 10px">
          <span>待选择区({{ selectedDevices.length }}个)</span>
          <el-button type="primary" size="small" style="margin-left: 10px" @click="handleAddAll">
            全选
          </el-button>
          <span style="margin-left: 20px">
            已选({{ confirmedDevices.length }} / {{ selectedDevices.length }}个)
          </span>
          <el-button
            type="success"
            size="small"
            style="margin-left: 10px"
            @click="handleConfirmDevices"
          >
            下发
          </el-button>
        </div>

        <div style="display: flex; gap: 20px">
          <!-- 待选择区 -->
          <div style="flex: 1; border: 1px solid #ddd; padding: 10px; min-height: 300px">
            <el-table
              :data="deviceList"
              stripe
              border
              height="300"
              @selection-change="handleDeviceSelectionChange"
            >
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column prop="sn" label="SN" width="150" align="center" />
              <el-table-column prop="product_name" label="产品名称" align="center" />
              <el-table-column label="操作" width="80" align="center">
                <template #default="{ row }">
                  <el-button type="text" size="small" @click="handleAddDevice(row)">添加</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 已选区 -->
          <div style="flex: 1; border: 1px solid #ddd; padding: 10px; min-height: 300px">
            <el-table :data="confirmedDevices" stripe border height="300">
              <el-table-column prop="sn" label="SN" width="150" align="center" />
              <el-table-column prop="product_name" label="产品名称" align="center" />
              <el-table-column label="操作" width="80" align="center">
                <template #default="{ $index }">
                  <el-button type="text" size="small" @click="handleRemoveDevice($index)">
                    移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>

      <template #footer>
        <div style="text-align: center">
          <el-button @click="deviceFilterVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 发货弹窗 -->
    <el-dialog
      v-model="shipDialogVisible"
      :title="`为${shipForm.username}的订单发货`"
      width="600px"
      draggable
      align-center
      :close-on-click-modal="false"
    >
      <el-form ref="shipFormRef" :model="shipForm" :rules="shipFormRules" label-width="100px">
        <el-form-item label="选择快递" prop="ship_name">
          <el-select
            v-model="shipForm.ship_name"
            placeholder="请选择"
            filterable
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="item in EXPRESS_COMPANY_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="填写单号" prop="ship_number">
          <el-input v-model="shipForm.ship_number" placeholder="请输入运单号" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div style="text-align: center">
          <el-button @click="shipDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="shipFormLoading" @click="handleShipSubmit">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { request } from '@/utils/request'
import {
  ORDER_STATUS_OPTIONS,
  ORDER_PAY_TYPE_OPTIONS,
  EXPRESS_COMPANY_OPTIONS,
  PRODUCT_OPTIONS
} from '@/constants'

// 定义订单列表项接口
interface OrderItem {
  id: number
  oid: string
  user_id: number
  username: string
  user_mobile: string
  goods_id: number
  goods_num: number
  goods_price: string
  goods_json: string
  goods_detail: string
  product_id: number
  money: string
  payable: string
  coupon_user_id: number
  pay_type: string
  pay_time: string
  pay_img: string
  status: string
  status_value: number
  address_id: number
  address_name: string
  address_mobile: string
  address_city: string
  address_info: string
  address: string
  ship_id: string
  ship_name: string
  ship_number: string
  remark: string | null
  sys_type: number
  is_transfer: number
  transfer_num: number
  transfer_json: string
  create_time: string
  update_time: string
  m_id: number
}

// 定义查询参数接口
interface QueryParams {
  page: number
  limit: number
  user_mobile: string
  create_time: string
  status_id: number
  pay_type: number
}

// 定义API响应接口
interface ApiResponse {
  code: number
  msg: string
  count: number
  data: OrderItem[]
}

// 查询参数
const queryParams = reactive<QueryParams>({
  page: 1,
  limit: 15,
  user_mobile: '',
  create_time: '',
  status_id: 2,
  pay_type: 0
})

// 表格数据
const tableData = ref<OrderItem[]>([])
const total = ref(0)
const loading = ref(false)

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const params: Record<string, string | number> = {
      page: queryParams.page,
      limit: queryParams.limit,
      user_mobile: queryParams.user_mobile,
      create_time: queryParams.create_time,
      status_id: queryParams.status_id,
      pay_type: queryParams.pay_type
    }

    const res = await request.get<ApiResponse>('/index/order/getlist.html', { params })

    console.log('订单列表响应:', res)

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
  queryParams.user_mobile = ''
  queryParams.create_time = ''
  queryParams.status_id = 2
  queryParams.pay_type = 0
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

// 划拨机具弹窗相关
const transferDialogVisible = ref(false)
const transferFormRef = ref<FormInstance>()
const transferFormLoading = ref(false)

interface ActiveItem {
  id: number
  active_name: string
  active_money: string
  yajin_money: string
  product_id: number
}

interface SimItem {
  id: number
  name: string
  sim_money: number
  product_id: number
}

interface TransferFormData {
  user_id: number
  username: string
  oid: string
  order_id: number
  product_id: number | undefined
  active_id: number | undefined
  sim_id: number | undefined
}

const transferForm = reactive<TransferFormData>({
  user_id: 0,
  username: '',
  oid: '',
  order_id: 0,
  product_id: undefined,
  active_id: undefined,
  sim_id: undefined
})

const activeList = ref<ActiveItem[]>([])
const simList = ref<SimItem[]>([])

const transferFormRules: FormRules = {
  product_id: [{ required: true, message: '请选择产品名称', trigger: 'change' }],
  active_id: [{ required: true, message: '请选择押金规格', trigger: 'change' }],
  sim_id: [{ required: true, message: '请选择流量档位', trigger: 'change' }]
}

// 打开划拨机具弹窗
const handleTransfer = async (row: OrderItem) => {
  transferForm.user_id = row.user_id
  transferForm.username = row.username
  transferForm.oid = row.oid
  transferForm.order_id = row.id

  // 解析 goods_json 获取 product_id 和 active_id
  let parsedProductId: number | undefined = undefined
  let parsedActiveId: number | undefined = undefined

  try {
    if (row.goods_json) {
      const goodsData = JSON.parse(row.goods_json)
      if (Array.isArray(goodsData) && goodsData.length > 0) {
        const firstGoods = goodsData[0]
        parsedProductId = Number(firstGoods.product_id) || undefined
        parsedActiveId = Number(firstGoods.active_id) || undefined
      }
    }
  } catch (error) {
    console.error('解析 goods_json 失败:', error)
  }

  transferForm.product_id = parsedProductId
  transferForm.active_id = undefined
  transferForm.sim_id = row.m_id
  activeList.value = []
  simList.value = []
  transferFormRef.value?.clearValidate()
  transferDialogVisible.value = true

  // 如果有 product_id，自动加载押金规格和流量档位
  if (parsedProductId) {
    await handleProductChange(parsedProductId)
    // 加载完成后设置 active_id
    if (parsedActiveId) {
      transferForm.active_id = parsedActiveId
    }
  }
}

// 产品变化时加载押金规格和流量档位
const handleProductChange = async (productId: number | undefined) => {
  if (!productId) {
    activeList.value = []
    simList.value = []
    transferForm.active_id = undefined
    transferForm.sim_id = undefined
    return
  }

  // 重置选择
  transferForm.active_id = undefined
  transferForm.sim_id = undefined

  // 加载押金规格
  try {
    const formData = new URLSearchParams()
    formData.append('product_id', String(productId))

    const res = await request.post<{ code: number; msg: string; data: ActiveItem[] }>(
      '/index/transfer/getactivebyproduct.html',
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    if (res.code === 0) {
      activeList.value = Array.isArray(res.data) ? res.data : [res.data]
    } else {
      ElMessage.error(res.msg || '获取押金规格失败')
      activeList.value = []
    }
  } catch (error) {
    console.error('获取押金规格失败:', error)
    activeList.value = []
  }

  // 加载流量档位
  try {
    const formData = new URLSearchParams()
    formData.append('product_id', String(productId))

    const res = await request.post<{ code: number; msg: string; data: SimItem[] }>(
      '/index/transfer/getsimbyproduct.html',
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    if (res.code === 0) {
      simList.value = Array.isArray(res.data) ? res.data : [res.data]
    } else {
      ElMessage.error(res.msg || '获取流量档位失败')
      simList.value = []
    }
  } catch (error) {
    console.error('获取流量档位失败:', error)
    simList.value = []
  }
}

// 提交划拨机具
const handleTransferSubmit = async () => {
  if (!transferFormRef.value) return

  try {
    await transferFormRef.value.validate()
  } catch (error) {
    return
  }

  transferFormLoading.value = true
  try {
    const formData = new URLSearchParams()
    formData.append('user_id', String(transferForm.user_id))
    formData.append('data', '[]')
    formData.append('product_id', String(transferForm.product_id))
    formData.append('order_id', String(transferForm.order_id))
    formData.append('active_id', String(transferForm.active_id))
    formData.append('sim_id', String(transferForm.sim_id))

    const res = await request.post<{ code: number; msg: string; data: string }>(
      '/index/transfer/transfer.html',
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    console.log('划拨机具响应:', res)
    // 操作接口：code: 0 表示成功
    if (res.code === 0) {
      ElMessage.error(res.msg || '划拨失败')
    } else {
      ElMessage.success(res.msg || '划拨成功')
      transferDialogVisible.value = false
      await getList()
    }
  } catch (error) {
    console.error('划拨失败:', error)
    ElMessage.error('划拨失败，请稍后重试')
  } finally {
    transferFormLoading.value = false
  }
}

// 发货弹窗相关
const shipDialogVisible = ref(false)
const shipFormRef = ref<FormInstance>()
const shipFormLoading = ref(false)

interface ShipFormData {
  id: number
  username: string
  ship_name: string
  ship_number: string
}

const shipForm = reactive<ShipFormData>({
  id: 0,
  username: '',
  ship_name: '',
  ship_number: ''
})

const shipFormRules: FormRules = {
  ship_name: [{ required: true, message: '请选择快递公司', trigger: 'change' }],
  ship_number: [{ required: true, message: '请输入运单号', trigger: 'blur' }]
}

// 打开发货弹窗
const handleShip = (row: OrderItem) => {
  shipForm.id = row.id
  shipForm.username = row.username
  shipForm.ship_name = ''
  shipForm.ship_number = ''
  shipFormRef.value?.clearValidate()
  shipDialogVisible.value = true
}

// 提交发货
const handleShipSubmit = async () => {
  if (!shipFormRef.value) return

  try {
    await shipFormRef.value.validate()
  } catch (error) {
    return
  }

  shipFormLoading.value = true
  try {
    const formData = new URLSearchParams()
    formData.append('id', String(shipForm.id))
    formData.append('ship_name', shipForm.ship_name)
    formData.append('ship_number', shipForm.ship_number)

    const res = await request.post<{ code: number; msg: string; data: string }>(
      '/index/order/ship.html',
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    console.log('发货响应:', res)
    // 操作接口：code: 1 表示成功
    if (res.code === 1) {
      ElMessage.success(res.msg || '发货成功')
      shipDialogVisible.value = false
      await getList()
    } else {
      ElMessage.error(res.msg || '发货失败')
    }
  } catch (error) {
    console.error('发货失败:', error)
    ElMessage.error('发货失败，请稍后重试')
  } finally {
    shipFormLoading.value = false
  }
}

// 筛选机具弹窗相关
const deviceFilterVisible = ref(false)

interface DeviceItem {
  sn: string
  product_name: string
  product_id: number
}

interface DeviceFilterParams {
  page: number
  limit: number
  product_id: number
  create_time: string
  sn_begin: string
  sn_end: string
}

const deviceFilterParams = reactive<DeviceFilterParams>({
  page: 1,
  limit: 60,
  product_id: 0,
  create_time: '',
  sn_begin: '',
  sn_end: ''
})

const deviceList = ref<DeviceItem[]>([])
const selectedDevices = ref<DeviceItem[]>([])
const confirmedDevices = ref<DeviceItem[]>([])

// 打开筛选机具弹窗
const handleOpenDeviceFilter = () => {
  if (!transferForm.product_id) {
    ElMessage.warning('请先选择产品名称')
    return
  }
  deviceFilterParams.product_id = transferForm.product_id
  deviceFilterParams.create_time = ''
  deviceFilterParams.sn_begin = ''
  deviceFilterParams.sn_end = ''
  deviceList.value = []
  selectedDevices.value = []
  confirmedDevices.value = []
  deviceFilterVisible.value = true
}

// 筛选机具
const handleDeviceSearch = async () => {
  try {
    const params: Record<string, string | number> = {
      page: deviceFilterParams.page,
      limit: deviceFilterParams.limit,
      product_id: deviceFilterParams.product_id,
      create_time: deviceFilterParams.create_time,
      sn_begin: deviceFilterParams.sn_begin,
      sn_end: deviceFilterParams.sn_end
    }

    const res = await request.get<{ code: number; msg: string; data: DeviceItem[] }>(
      '/index/transfer/getlist',
      { params }
    )

    console.log('机具列表响应:', res)

    if (res.code === 0) {
      deviceList.value = res.data || []
    } else {
      ElMessage.error(res.msg || '获取机具列表失败')
    }
  } catch (error) {
    console.error('获取机具列表失败:', error)
    ElMessage.error('获取机具列表失败，请稍后重试')
  }
}

// 设备选择变化
const handleDeviceSelectionChange = (selection: DeviceItem[]) => {
  selectedDevices.value = selection
}

// 全选
const handleAddAll = () => {
  confirmedDevices.value = [...selectedDevices.value]
}

// 添加单个设备
const handleAddDevice = (device: DeviceItem) => {
  if (!confirmedDevices.value.find((d) => d.sn === device.sn)) {
    confirmedDevices.value.push(device)
  }
}

// 移除设备
const handleRemoveDevice = (index: number) => {
  confirmedDevices.value.splice(index, 1)
}

// 确认下发设备
const handleConfirmDevices = () => {
  if (confirmedDevices.value.length === 0) {
    ElMessage.warning('请选择要下发的机具')
    return
  }
  ElMessage.success(`已选择 ${confirmedDevices.value.length} 个机具`)
  deviceFilterVisible.value = false
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

:deep(table) {
  width: 100% !important;
  border-collapse: collapse;

  td {
    padding: 8px;
    border: 1px solid #ddd;
    text-align: center;
  }
}
</style>
