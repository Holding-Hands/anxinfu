<template>
  <div class="page-container">
    <el-card shadow="never">
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="120px"
        style="max-width: 800px"
      >
        <el-form-item label="选择商品" prop="goods_id">
          <el-select
            v-model="form.goods_id"
            placeholder="请选择商品"
            style="width: 100%"
            filterable
            @change="handleGoodsChange"
          >
            <el-option
              v-for="item in goodsList"
              :key="item.id"
              :label="`${item.goods_name} - 价格：${item.shop_price} - 库存：${item.goods_number}`"
              :value="item.id"
            >
              <div style="display: flex; align-items: center; justify-content: space-between">
                <span>{{ item.goods_name }}</span>
                <span style="color: #909399; font-size: 13px">
                  价格：
                  <span style="color: #f56c6c; font-weight: bold">¥{{ item.shop_price }}</span>
                  | 库存：{{ item.goods_number }}
                </span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择规格" prop="active_id">
          <el-select
            v-model="form.active_id"
            placeholder="请先选择商品"
            style="width: 100%"
            :disabled="!form.goods_id"
            :loading="specLoading"
          >
            <el-option
              v-for="item in specList"
              :key="item.id"
              :label="getSpecLabel(item)"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="购买数量" prop="goods_num">
          <el-input-number
            v-model="form.goods_num"
            :min="1"
            :max="99999"
            placeholder="请输入购买数量"
            style="width: 100%"
          />
          <div v-if="minBuyNum > 0" style="color: #909399; font-size: 12px; margin-top: 5px">
            起买数量：{{ minBuyNum }}
          </div>
        </el-form-item>

        <el-form-item label="选择盟友" prop="user_id">
          <el-select
            v-model="form.user_id"
            placeholder="请选择盟友"
            style="width: 100%"
            filterable
            remote
            :remote-method="searchAlly"
            :loading="allyLoading"
          >
            <el-option
              v-for="item in allyList"
              :key="item.id"
              :label="getDisplayName(item)"
              :value="item.id"
            >
              <div style="display: flex; align-items: center">
                <span>{{ getDisplayName(item) }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="支付方式" prop="pay_type">
          <el-radio-group v-model="form.pay_type">
            <el-radio :label="5">线下支付</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="有效期" prop="expire_time">
          <el-date-picker
            v-model="form.expire_time"
            type="date"
            placeholder="请选择有效期"
            style="width: 100%"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="地址ID" prop="address_id">
          <el-input-number
            v-model="form.address_id"
            :min="0"
            placeholder="请输入地址ID"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
            立即提交
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { request } from '@/utils/request'

// 定义接口类型
interface GoodsItem {
  id: number
  goods_name: string
  shop_price: string
  goods_img: string
  goods_number: number
}

interface SpecItem {
  id: number
  active_name?: string
  yajin_money?: string
  min_buy_num?: number
  [key: string]: unknown
}

interface AllyItem {
  id: number
  name?: string
  nickname?: string
  mobile: string
  avatar?: string
  [key: string]: unknown
}

// 表单数据
const form = reactive({
  goods_id: null as number | null,
  active_id: null as number | null,
  goods_num: 1,
  user_id: null as number | null,
  pay_type: 5,
  expire_time: '',
  address_id: 0
})

// 表单验证规则
const formRules: FormRules = {
  goods_id: [{ required: true, message: '请选择商品', trigger: 'change' }],
  active_id: [{ required: true, message: '请选择规格', trigger: 'change' }],
  goods_num: [{ required: true, message: '请输入购买数量', trigger: 'blur' }],
  user_id: [{ required: true, message: '请选择盟友', trigger: 'change' }],
  pay_type: [{ required: true, message: '请选择支付方式', trigger: 'change' }],
  expire_time: [{ required: true, message: '请选择有效期', trigger: 'change' }]
}

const formRef = ref<FormInstance>()
const submitLoading = ref(false)
const specLoading = ref(false)
const allyLoading = ref(false)

// 商品列表
const goodsList = ref<GoodsItem[]>([])
// 规格列表
const specList = ref<SpecItem[]>([])
// 盟友列表
const allyList = ref<AllyItem[]>([])
// 最小购买数量
const minBuyNum = ref(0)

// 获取商品列表
const getGoodsList = async () => {
  try {
    const res = await request.get<{
      code: number
      msg: string
      data: GoodsItem[]
    }>('/index/goods/getlist.html')

    if (res.code === 0) {
      goodsList.value = res.data || []
    }
  } catch (error) {
    console.error('获取商品列表失败:', error)
  }
}

// 商品变化时获取规格
const handleGoodsChange = async (goodsId: number) => {
  form.active_id = null
  specList.value = []
  minBuyNum.value = 0

  if (!goodsId) return

  specLoading.value = true
  try {
    const formData = new URLSearchParams()
    formData.append('product_id', String(goodsId))

    const res = await request.post<{
      code: number
      msg: string
      data: SpecItem[]
    }>('/index/order/getactivelist.html', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    console.log('规格列表响应:', res)
    if (res.code === 0 || res.code === 1) {
      specList.value = res.data || []
      console.log('规格列表数据:', specList.value)
      // 如果有规格数据，提取最小购买数量
      if (specList.value.length > 0 && specList.value[0].min_buy_num) {
        minBuyNum.value = specList.value[0].min_buy_num
      }
    }
  } catch (error) {
    console.error('获取规格列表失败:', error)
  } finally {
    specLoading.value = false
  }
}

// 获取规格显示标签
const getSpecLabel = (item: SpecItem) => {
  const activeName = item.active_name || ''
  const yajinMoney = item.yajin_money || ''

  if (activeName && yajinMoney) {
    return `${activeName}----${yajinMoney}`
  } else if (activeName) {
    return activeName
  }

  return `规格${item.id}`
}

// 获取盟友显示名称（去除HTML标签）
const getDisplayName = (item: AllyItem) => {
  const name = item.name || item.nickname || ''
  const mobile = item.mobile || ''

  // 去除HTML标签
  const cleanName = name.replace(/<[^>]*>/g, '').trim()

  if (cleanName && mobile) {
    return `${cleanName} (${mobile})`
  } else if (cleanName) {
    return cleanName
  } else if (mobile) {
    return mobile
  }
  return `用户${item.id}`
}

// 搜索盟友
const searchAlly = async (query: string) => {
  allyLoading.value = true
  try {
    const res = await request.get<{
      code: number
      msg: string
      data: AllyItem[]
    }>('/index/user/getlisty.html', {
      params: {
        page: 0,
        limit: 100000,
        mobile: query || '',
        name: query || '',
        is_auth: '',
        user_type: ''
      }
    })

    console.log('盟友列表响应:', res)
    if (res.code === 0) {
      allyList.value = res.data || []
      console.log('盟友列表数据:', allyList.value)
    }
  } catch (error) {
    console.error('获取盟友列表失败:', error)
  } finally {
    allyLoading.value = false
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch (error) {
    return
  }

  // 验证购买数量
  if (minBuyNum.value > 0 && form.goods_num < minBuyNum.value) {
    ElMessage.warning(`起买数量是${minBuyNum.value}！`)
    return
  }

  submitLoading.value = true
  try {
    const formData = new URLSearchParams()
    formData.append('goods_id', String(form.goods_id))
    formData.append('active_id', String(form.active_id))
    formData.append('goods_num', String(form.goods_num))
    formData.append('user_id', String(form.user_id))
    formData.append('pay_type', String(form.pay_type))
    formData.append('expire_time', form.expire_time)
    formData.append('address_id', String(form.address_id))

    const res = await request.post<{
      code: number
      msg: string
      data?: unknown
    }>('/index/order/add.html', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    if (res.code === 1) {
      ElMessage.success(res.msg || '订单创建成功')
      handleReset()
    } else {
      ElMessage.error(res.msg || '订单创建失败')
    }
  } catch (error) {
    console.error('提交订单失败:', error)
    ElMessage.error('提交订单失败，请稍后重试')
  } finally {
    submitLoading.value = false
  }
}

// 重置表单
const handleReset = () => {
  formRef.value?.resetFields()
  specList.value = []
  minBuyNum.value = 0
}

// 页面加载时获取数据
onMounted(() => {
  getGoodsList()
  searchAlly('') // 初始加载盟友列表
})
</script>

<style scoped lang="scss">
.page-container {
  padding: 20px;
}
</style>
