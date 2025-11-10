<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="900px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="140px"
      class="product-form"
    >
      <el-form-item label="所属分类" prop="pid" required>
        <el-select v-model="formData.pid" placeholder="请选择所属分类" filterable>
          <el-option
            v-for="item in PRODUCT_OPTIONS.filter((p) => p.value !== 0)"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="产品名称" prop="name" required>
        <el-input v-model="formData.name" placeholder="请输入产品名称" />
      </el-form-item>

      <el-form-item label="应用模式" prop="sys_type" required>
        <el-radio-group v-model="formData.sys_type">
          <el-radio :label="1">1.0模式</el-radio>
          <el-radio :label="2">2.0模式</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="封面图片" prop="cover">
        <el-upload
          class="cover-uploader"
          :action="uploadUrl"
          :show-file-list="false"
          :on-success="handleCoverSuccess"
          :before-upload="beforeCoverUpload"
        >
          <img v-if="coverImageUrl" :src="coverImageUrl" class="cover-image" alt="" />
          <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="押金返还类型">
        <el-radio-group v-model="formData.yajin_type">
          <el-radio :label="1">多次每月返还</el-radio>
          <el-radio :label="2">累计达标单次返还</el-radio>
          <el-radio :label="3">多月一次性还</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="押金考核月数" prop="yajin_month">
        <el-input
          v-model="formData.yajin_month"
          placeholder="客户，类型为 多月多次返还时对应月数eg:5个月，类型为 累计达标单次返还时对应天数eg：180天"
        />
      </el-form-item>

      <el-form-item label="押金考核业绩" prop="yajin_yeji">
        <el-input
          v-model="formData.yajin_yeji"
          placeholder="客户，类型为 多月多次返还时对应每月应达到的交易额eg:5000，类型为 累计达标单次返还时为累计应达到交易额eg:880000"
        />
      </el-form-item>

      <el-form-item label="客户收益比例" prop="profit_ratio">
        <el-input
          v-model="formData.profit_ratio"
          placeholder="客户，客户每刷卡发放万分的刷卡奖励，万*，没有填0"
        >
          <template #append>万*</template>
        </el-input>
      </el-form-item>

      <el-form-item label="客户抽奖积分" prop="point_ratio">
        <el-input
          v-model="formData.point_ratio"
          placeholder="客户，客户用来抽奖的抽奖积分，万*，没有填0"
        >
          <template #append>万*</template>
        </el-input>
      </el-form-item>

      <el-form-item label="首码刷卡结算价">
        <el-input v-model="formData.card_price" placeholder="eg：‰0.52，填0.52" />
      </el-form-item>

      <el-form-item label="首码扫码结算价">
        <el-input v-model="formData.code_price" placeholder="eg：‰0.29，填0.29" />
      </el-form-item>

      <el-form-item label="首码一次达标">
        <el-input v-model="formData.first_money" placeholder="单位：元" />
      </el-form-item>

      <el-form-item label="首码二次达标">
        <el-input v-model="formData.second_money" placeholder="单位：元" />
      </el-form-item>

      <el-form-item label="首码三次达标">
        <el-input v-model="formData.third_money" placeholder="单位：元" />
      </el-form-item>

      <el-form-item label="伪激活天数" prop="wjh_days" required>
        <el-input v-model="formData.wjh_days" placeholder="伪激活天数，开通后天数没有填0" />
      </el-form-item>

      <el-form-item label="伪激活交易量" prop="wjh_yeji" required>
        <el-input
          v-model="formData.wjh_yeji"
          placeholder="伪激活要求交易量，开通后天刷卡=m元,没有填0"
        />
      </el-form-item>

      <el-form-item label="伪激活扣款" prop="wjh_kk_money" required>
        <el-input v-model="formData.wjh_kk_money" placeholder="伪激活扣款金额,没有填0" />
      </el-form-item>

      <el-form-item label="未激活天数" prop="hb_days">
        <el-input v-model="formData.hb_days" placeholder="划拨n天未激活,没有填0" />
      </el-form-item>

      <el-form-item label="未激活扣款" prop="hb_kk_money">
        <el-input v-model="formData.hb_kk_money" placeholder="划拨n未激活扣款金额,没有填0" />
      </el-form-item>

      <el-form-item label="激活方式">
        <el-radio-group v-model="formData.active_type">
          <el-radio :label="1">冻结激活</el-radio>
          <el-radio :label="2">条件激活</el-radio>
        </el-radio-group>
        <div style="color: #999; font-size: 12px; margin-top: 5px">
          冻结激活：押金版机器只要机器流结押金即为激活，非押机器首笔交易就会激活；条件激活：押金、非押机器都要下面周期天数内交易达标定交易额才算激活
        </div>
      </el-form-item>

      <el-form-item label="激活周期">
        <el-input v-model="formData.active_cycle" placeholder="例如：30天就填30" />
      </el-form-item>

      <el-form-item label="激活标准">
        <el-input v-model="formData.active_yeji" placeholder="交易量要求，元" />
      </el-form-item>

      <el-divider content-position="left">达标设置(一)</el-divider>

      <el-form-item label="达标类型(一)" prop="dabiao_check_type1" required>
        <el-radio-group v-model="formData.dabiao_check_type1">
          <el-radio :label="0">天数/天</el-radio>
          <el-radio :label="1">月数/个</el-radio>
          <el-radio :label="2">自然月/个</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="达标周期(一)" prop="dabiao_check_starday1" required>
        <el-input
          v-model="formData.dabiao_check_starday1"
          placeholder="开始天数"
          style="width: 150px"
        />
        <span style="margin: 0 10px">-</span>
        <el-input
          v-model="formData.dabiao_check_endday1"
          placeholder="结束天数"
          style="width: 150px"
        />
      </el-form-item>

      <el-form-item label="达标标准(一)" prop="dabiao_check_money1" required>
        <el-input v-model="formData.dabiao_check_money1" placeholder="达标额度" />
      </el-form-item>

      <el-divider content-position="left">达标设置(二)</el-divider>

      <el-form-item label="达标类型(二)" prop="dabiao_check_type2">
        <el-radio-group v-model="formData.dabiao_check_type2">
          <el-radio :label="0">天数/天</el-radio>
          <el-radio :label="1">月数/个</el-radio>
          <el-radio :label="2">自然月/个</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="达标周期(二)" prop="dabiao_check_starday2">
        <el-input
          v-model="formData.dabiao_check_starday2"
          placeholder="开始天数"
          style="width: 150px"
        />
        <span style="margin: 0 10px">-</span>
        <el-input
          v-model="formData.dabiao_check_endday2"
          placeholder="结束天数"
          style="width: 150px"
        />
      </el-form-item>

      <el-form-item label="达标标准(二)" prop="dabiao_check_money2">
        <el-input v-model="formData.dabiao_check_money2" placeholder="达标额度" />
      </el-form-item>

      <el-divider content-position="left">达标设置(三)</el-divider>

      <el-form-item label="达标类型(三)" prop="dabiao_check_type3">
        <el-radio-group v-model="formData.dabiao_check_type3">
          <el-radio :label="0">天数/天</el-radio>
          <el-radio :label="1">月数/个</el-radio>
          <el-radio :label="2">自然月/个</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="达标周期(三)" prop="dabiao_check_starday3">
        <el-input
          v-model="formData.dabiao_check_starday3"
          placeholder="开始天数"
          style="width: 150px"
        />
        <span style="margin: 0 10px">-</span>
        <el-input
          v-model="formData.dabiao_check_endday3"
          placeholder="结束天数"
          style="width: 150px"
        />
      </el-form-item>

      <el-form-item label="达标标准(三)" prop="dabiao_check_money3">
        <el-input v-model="formData.dabiao_check_money3" placeholder="达标额度" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">提交</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { PRODUCT_OPTIONS } from '@/constants'
import { request } from '@/utils/request'

// 定义props
interface Props {
  visible: boolean
  editData?: ProductListItem
}

// 产品列表项接口（与 ProductList.vue 保持一致）
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
  card_price?: string
  code_price?: string
  first_money?: string
  second_money?: string
  third_money?: string
  limit_dui?: number
  sort?: number
  create_time?: string
  update_time?: string
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

// 表单数据
interface FormData {
  id?: number | string
  pid: number | string
  name: string
  sys_type: number
  cover: string
  yajin_type: number
  yajin_month: string
  yajin_yeji: string
  profit_ratio: string
  point_ratio: string
  card_price: string
  code_price: string
  first_money: string
  second_money: string
  third_money: string
  wjh_days: string
  wjh_yeji: string
  wjh_kk_money: string
  hb_days: string
  hb_kk_money: string
  active_type: number
  active_cycle: string
  active_yeji: string
  dabiao_check_type1: number
  dabiao_check_starday1: string
  dabiao_check_endday1: string
  dabiao_check_time1: string
  dabiao_check_times1: string
  dabiao_check_money1: string
  dabiao_check_type2: number
  dabiao_check_starday2: string
  dabiao_check_endday2: string
  dabiao_check_time2: string
  dabiao_check_times2: string
  dabiao_check_money2: string
  dabiao_check_type3: number
  dabiao_check_starday3: string
  dabiao_check_endday3: string
  dabiao_check_time3: string
  dabiao_check_times3: string
  dabiao_check_money3: string
}

const formRef = ref<FormInstance>()
const submitLoading = ref(false)
const coverImageUrl = ref('')
const uploadUrl = '/index/product/qiniu_upload.html'

// 表单数据
const formData = reactive<FormData>({
  id: undefined,
  pid: '',
  name: '',
  sys_type: 1,
  cover: '',
  yajin_type: 1,
  yajin_month: '',
  yajin_yeji: '',
  profit_ratio: '',
  point_ratio: '',
  card_price: '',
  code_price: '',
  first_money: '',
  second_money: '',
  third_money: '',
  wjh_days: '',
  wjh_yeji: '',
  wjh_kk_money: '',
  hb_days: '',
  hb_kk_money: '',
  active_type: 1,
  active_cycle: '',
  active_yeji: '',
  dabiao_check_type1: 0,
  dabiao_check_starday1: '',
  dabiao_check_endday1: '',
  dabiao_check_time1: '',
  dabiao_check_times1: '',
  dabiao_check_money1: '',
  dabiao_check_type2: 0,
  dabiao_check_starday2: '',
  dabiao_check_endday2: '',
  dabiao_check_time2: '',
  dabiao_check_times2: '',
  dabiao_check_money2: '',
  dabiao_check_type3: 0,
  dabiao_check_starday3: '',
  dabiao_check_endday3: '',
  dabiao_check_time3: '',
  dabiao_check_times3: '',
  dabiao_check_money3: ''
})

// 表单验证规则
const formRules: FormRules = {
  pid: [{ required: true, message: '请选择所属分类', trigger: 'change' }],
  name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
  sys_type: [{ required: true, message: '请选择应用模式', trigger: 'change' }],
  wjh_days: [{ required: true, message: '请输入伪激活天数', trigger: 'blur' }],
  wjh_yeji: [{ required: true, message: '请输入伪激活交易量', trigger: 'blur' }],
  wjh_kk_money: [{ required: true, message: '请输入伪激活扣款', trigger: 'blur' }],
  dabiao_check_type1: [{ required: true, message: '请选择达标类型(一)', trigger: 'change' }],
  dabiao_check_starday1: [{ required: true, message: '请输入达标周期(一)', trigger: 'blur' }],
  dabiao_check_money1: [{ required: true, message: '请输入达标标准(一)', trigger: 'blur' }]
}

// 控制弹窗显示
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

// 弹窗标题
const dialogTitle = computed(() => {
  return props.editData ? '编辑产品' : '新增产品'
})

// 重置表单数据到初始值
const resetFormData = () => {
  Object.assign(formData, {
    id: undefined,
    pid: '',
    name: '',
    sys_type: 1,
    cover: '',
    yajin_type: 1,
    yajin_month: '',
    yajin_yeji: '',
    profit_ratio: '',
    point_ratio: '',
    card_price: '',
    code_price: '',
    first_money: '',
    second_money: '',
    third_money: '',
    wjh_days: '',
    wjh_yeji: '',
    wjh_kk_money: '',
    hb_days: '',
    hb_kk_money: '',
    active_type: 1,
    active_cycle: '',
    active_yeji: '',
    dabiao_check_type1: 0,
    dabiao_check_starday1: '',
    dabiao_check_endday1: '',
    dabiao_check_time1: '',
    dabiao_check_times1: '',
    dabiao_check_money1: '',
    dabiao_check_type2: 0,
    dabiao_check_starday2: '',
    dabiao_check_endday2: '',
    dabiao_check_time2: '',
    dabiao_check_times2: '',
    dabiao_check_money2: '',
    dabiao_check_type3: 0,
    dabiao_check_starday3: '',
    dabiao_check_endday3: '',
    dabiao_check_time3: '',
    dabiao_check_times3: '',
    dabiao_check_money3: ''
  })
  coverImageUrl.value = ''
}

// 监听编辑数据变化
watch(
  () => props.editData,
  (newVal) => {
    if (newVal) {
      // 编辑：填充表单数据
      Object.assign(formData, newVal)
      // 设置封面图片
      if (newVal.cover) {
        const match = newVal.cover.match(/src="([^"]+)"/)
        coverImageUrl.value = match ? match[1] : ''
      }
    } else {
      // 新增：重置表单为初始值
      resetFormData()
    }
  },
  { immediate: true }
)

// 图片上传响应接口
interface UploadResponse {
  code: number
  msg: string
  data: {
    src: string
    id: number
  }
}

// API响应接口
interface ApiResponse<T = any> {
  code: number
  msg: string
  data?: T
}

// 图片上传成功
const handleCoverSuccess = (response: UploadResponse) => {
  console.log('图片上传响应:', response)
  if (response.code === 1) {
    // 注意：接口返回的是src字段，不是url
    coverImageUrl.value = response.data.src
    formData.cover = response.data.src
    ElMessage.success(response.msg || '上传成功')
  } else {
    ElMessage.error(response.msg || '上传失败')
  }
}

// 图片上传前验证
const beforeCoverUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid, fields) => {
    if (!valid) {
      console.log('表单验证失败:', fields)
      ElMessage.warning('请填写完整的必填项')
      return
    }

    submitLoading.value = true
    try {
      // 构建表单数据
      const formDataToSubmit = new URLSearchParams()
      Object.keys(formData).forEach((key) => {
        const value = formData[key as keyof FormData]
        // 编辑时必须包含id，新增时不包含id
        if (key === 'id') {
          if (props.editData && value) {
            formDataToSubmit.append(key, String(value))
          }
        } else {
          formDataToSubmit.append(key, String(value || ''))
        }
      })

      const url = props.editData ? '/index/product/edit.html' : '/index/product/add.html'

      const res = await request.post<ApiResponse>(url, formDataToSubmit, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

      console.log('产品保存成功:', res)
      ElMessage.success(res.msg || '操作成功')
      emit('success')
      handleClose()
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
.product-form {
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

.cover-uploader {
  :deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);

    &:hover {
      border-color: var(--el-color-primary);
    }
  }
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}

.cover-image {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}
</style>
