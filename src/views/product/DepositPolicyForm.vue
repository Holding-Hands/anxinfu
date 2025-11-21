<template>
  <el-dialog draggable
    v-model="dialogVisible"
    :title="dialogTitle"
    width="800px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="130px"
      class="deposit-form"
    >
      <el-form-item label="平台名称" prop="pid" required>
        <el-select
          v-model="formData.pid"
          placeholder="请选择平台"
          filterable
          @change="handlePlatformChange"
        >
          <el-option
            v-for="item in PRODUCT_OPTIONS.filter((p) => p.value !== 0)"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="产品名称" prop="product_id" required>
        <el-select v-model="formData.product_id" placeholder="请选择产品" filterable>
          <el-option
            v-for="item in productList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="奖励名称" prop="active_name" required>
        <el-input
          v-model="formData.active_name"
          placeholder="请输入奖励名称，例如：陆POSV1（冻结）118"
        />
      </el-form-item>

      <el-form-item label="押金金额" prop="yajin_money">
        <el-input v-model="formData.yajin_money" placeholder="押金金额，元">
          <template #append>元</template>
        </el-input>
      </el-form-item>

      <el-form-item label="激活奖/押金" prop="active_money">
        <el-input v-model="formData.active_money" placeholder="返代理，押金或者激活奖">
          <template #append>元</template>
        </el-input>
        <div style="color: #999; font-size: 12px; margin-top: 5px">返代理，押金或者激活奖</div>
      </el-form-item>

      <el-form-item label="返客户押金" prop="yajin_fh_money">
        <el-input v-model="formData.yajin_fh_money" placeholder="返客户押金，元">
          <template #append>元</template>
        </el-input>
        <div style="color: #999; font-size: 12px; margin-top: 5px">
          客户，产品中返还类型类型为 多月多次返还时对应每月返还金额eg60，类型为
          累计达标单次返还时对应总应返还金额eg 299，没有填0
        </div>
      </el-form-item>

      <!-- 只有选择了产品后才显示以下字段 -->
      <template v-if="formData.product_id">
        <el-form-item label="激活推荐人奖" prop="active_parent_money">
          <el-input v-model="formData.active_parent_money" placeholder="激活推荐人奖励">
            <template #append>元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="激活上上级奖" prop="active_grand_money">
          <el-input v-model="formData.active_grand_money" placeholder="激活上级奖励">
            <template #append>元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="一次达标奖" prop="first_money">
          <el-input v-model="formData.first_money" placeholder="一次达标奖励">
            <template #append>元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="一次达标积分" prop="first_coin">
          <el-input v-model="formData.first_coin" placeholder="一次达标积分">
            <template #append>积分</template>
          </el-input>
        </el-form-item>

        <el-form-item label="二次达标奖" prop="second_money">
          <el-input v-model="formData.second_money" placeholder="二次达标奖励">
            <template #append>元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="三次达标奖" prop="third_money">
          <el-input v-model="formData.third_money" placeholder="三次达标奖励">
            <template #append>元</template>
          </el-input>
        </el-form-item>
      </template>

      <el-form-item label="状态">
        <el-radio-group v-model="formData.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">启用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">立即提交</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { PRODUCT_OPTIONS } from '@/constants'
import { request } from '@/utils/request'

// 定义props
interface Props {
  visible: boolean
  editData?: DepositPolicyItem
}

// 押金政策列表项接口
interface DepositPolicyItem {
  id: number
  m_id: number
  product_id: number
  sys_type: number
  active_name: string
  pname: string
  plname: string
  yajin_money: string
  yajin_fh_money: string
  active_money: string
  active_parent_money: string
  active_grand_money: string
  first_money: string
  second_money: string
  third_money: string
  sim_money: string
  first_coin: string
  status: string
  activity_code: string
  create_time: string
  update_time: number
}

// 产品项接口
interface ProductItem {
  id: number
  name: string
  pid: number
  sys_type: number
  m_id?: number
  active_cycle?: number
  active_type?: number
  active_yeji?: string
  coin_price?: string
  cover?: string
  create_time?: string
  first_cycle?: string
  first_type?: number
  first_yeji?: string
  has_day?: number
  hb_days?: number
  hb_kk_money?: string
  is_level?: number
  limit_dui?: number
  point_ratio?: string
  profit_ratio?: string
  second_cycle?: string
  second_type?: number
  second_yeji?: string
  sort?: number
  status?: number
  third_cycle?: string
  third_type?: number
  third_yeji?: string
  update_time?: string
  wjh_days?: number
  wjh_kk_money?: string
  wjh_yeji?: string
  yajin_fh_money?: string
  yajin_money?: string
  yajin_month?: number
  yajin_type?: number
  yajin_yeji?: string
}

// API响应接口
interface ApiResponse<T = any> {
  code: number
  msg: string
  data?: T
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  editData: undefined
})

// 定义emits
const emit = defineEmits<{
  'update:visible': [value: boolean]
  success: []
}>()

// 表单数据接口
interface FormData {
  id?: number
  pid: number | string
  product_id: number | string
  active_name: string
  yajin_money: string
  active_money: string
  yajin_fh_money: string
  active_parent_money: string
  active_grand_money: string
  first_money: string
  first_coin: string
  second_money: string
  third_money: string
  status: number
}

const formRef = ref<FormInstance>()
const submitLoading = ref(false)
const productList = ref<ProductItem[]>([])

// 表单数据
const formData = reactive<FormData>({
  id: undefined,
  pid: '',
  product_id: '',
  active_name: '',
  yajin_money: '0.00',
  active_money: '0.00',
  yajin_fh_money: '0.00',
  active_parent_money: '0.00',
  active_grand_money: '0.00',
  first_money: '0.00',
  first_coin: '0.00',
  second_money: '0.00',
  third_money: '0.00',
  status: 1
})

// 表单验证规则
const formRules: FormRules = {
  pid: [{ required: true, message: '请选择平台', trigger: 'change' }],
  product_id: [{ required: true, message: '请选择产品', trigger: 'change' }],
  active_name: [{ required: true, message: '请输入奖励名称', trigger: 'blur' }]
}

// 控制弹窗显示
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

// 弹窗标题
const dialogTitle = computed(() => {
  return props.editData ? '编辑产品激活标准' : '新增产品激活标准'
})

// 获取产品列表
const getProductList = async (pid?: number) => {
  try {
    if (!pid) {
      productList.value = []
      return
    }

    const formData = new URLSearchParams()
    formData.append('pid', String(pid))

    const res = await request.post<ApiResponse<ProductItem[]>>(
      '/index/product/getproductlist.html',
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    console.log('产品列表响应:', res)

    // 列表查询接口：code: 0 表示成功
    if (res.code === 0) {
      productList.value = res.data || []
    } else {
      ElMessage.error(res.msg || '获取产品列表失败')
      productList.value = []
    }
  } catch (error) {
    console.error('获取产品列表失败:', error)
    productList.value = []
  }
}

// 平台变化时，加载该平台下的产品
const handlePlatformChange = (pid: number) => {
  formData.product_id = ''
  if (pid) {
    getProductList(pid)
  } else {
    productList.value = []
  }
}

// 重置表单数据到初始值
const resetFormData = () => {
  Object.assign(formData, {
    id: undefined,
    pid: '',
    product_id: '',
    active_name: '',
    yajin_money: '0.00',
    active_money: '0.00',
    yajin_fh_money: '0.00',
    active_parent_money: '0.00',
    active_grand_money: '0.00',
    first_money: '0.00',
    first_coin: '0.00',
    second_money: '0.00',
    third_money: '0.00',
    status: 1
  })
  productList.value = []
}

// 监听编辑数据变化
watch(
  () => props.editData,
  async (newVal) => {
    if (newVal) {
      // 填充表单数据
      const pid = newVal.m_id || ''
      Object.assign(formData, {
        id: newVal.id,
        pid: pid,
        product_id: newVal.product_id || '',
        active_name: newVal.active_name || '',
        yajin_money: newVal.yajin_money || '0.00',
        active_money: newVal.active_money || '0.00',
        yajin_fh_money: newVal.yajin_fh_money || '0.00',
        active_parent_money: newVal.active_parent_money || '0.00',
        active_grand_money: newVal.active_grand_money || '0.00',
        first_money: newVal.first_money || '0.00',
        first_coin: newVal.first_coin || '0.00',
        second_money: newVal.second_money || '0.00',
        third_money: newVal.third_money || '0.00',
        status: newVal.status === '启用' ? 1 : 0
      })

      // 编辑：加载该平台下的产品列表
      if (pid) {
        await getProductList(Number(pid))
      }
    } else {
      // 新增：重置表单为初始值
      resetFormData()
    }
  },
  { immediate: true }
)

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.warning('请填写完整的必填项')
      return
    }

    submitLoading.value = true
    try {
      // 构建表单数据
      const formDataToSubmit = new URLSearchParams()

      // 如果是编辑，添加id
      if (formData.id) {
        formDataToSubmit.append('id', String(formData.id))
      }

      formDataToSubmit.append('pid', String(formData.pid))
      formDataToSubmit.append('product_id', String(formData.product_id))
      formDataToSubmit.append('active_name', formData.active_name)
      formDataToSubmit.append('yajin_money', formData.yajin_money)
      formDataToSubmit.append('active_money', formData.active_money)
      formDataToSubmit.append('yajin_fh_money', formData.yajin_fh_money)
      formDataToSubmit.append('active_parent_money', formData.active_parent_money)
      formDataToSubmit.append('active_grand_money', formData.active_grand_money)
      formDataToSubmit.append('first_money', formData.first_money)
      formDataToSubmit.append('first_coin', formData.first_coin)
      formDataToSubmit.append('second_money', formData.second_money)
      formDataToSubmit.append('third_money', formData.third_money)
      formDataToSubmit.append('status', String(formData.status))

      // 根据是否有id判断是新增还是编辑
      const url = formData.id ? '/index/product_active/edit.html' : '/index/product_active/add.html'

      const res = await request.post<ApiResponse>(url, formDataToSubmit, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

      console.log('押金政策保存响应:', res)
      // 操作接口：code: 1 表示成功
      if (res.code === 1) {
        ElMessage.success(res.msg || '保存成功')
        emit('success')
        handleClose()
      } else {
        ElMessage.error(res.msg || '保存失败')
      }
    } catch (error) {
      console.error('提交失败:', error)
      ElMessage.error('提交失败，请稍后重试')
    } finally {
      submitLoading.value = false
    }
  })
}

// 关闭弹窗
const handleClose = () => {
  // 重置表单字段验证状态
  formRef.value?.resetFields()

  // 清空所有表单数据
  resetFormData()

  // 关闭弹窗
  emit('update:visible', false)
}
</script>

<style scoped lang="scss">
.deposit-form {
  max-height: 600px;
  overflow-y: auto;
  padding-right: 20px;

  :deep(.el-form-item__label) {
    font-weight: 500;
  }

  :deep(.el-input) {
    width: 100%;
  }

  :deep(.el-select) {
    width: 100%;
  }
}
</style>
