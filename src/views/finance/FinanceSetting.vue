<template>
  <div class="page-container">
    <el-card v-loading="loading" shadow="never">
      <div class="finance-setting-content" v-html="htmlContent"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getFinanceSettingHtmlApi, saveFinanceSettingApi } from '@/api/financeSetting'

const loading = ref(false)
const htmlContent = ref('')

// 获取财务设置页面内容
const getSettingHtml = async () => {
  loading.value = true
  try {
    const res = await getFinanceSettingHtmlApi()
    htmlContent.value = res as unknown as string

    // 等待 DOM 更新后绑定事件
    await nextTick()
    bindFormEvents()
  } catch (error) {
    console.error('获取财务设置页面失败:', error)
    ElMessage.error('获取页面内容失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 绑定表单事件
const bindFormEvents = () => {
  const form = document.querySelector('.finance-setting-content form')
  if (form) {
    // 处理单选按钮，添加文字标签
    const radioInputs = form.querySelectorAll('input[type="radio"]')
    radioInputs.forEach((radio) => {
      const title = radio.getAttribute('title')
      if (title && !radio.nextSibling?.textContent?.includes(title)) {
        const label = document.createElement('span')
        label.textContent = title
        label.style.marginLeft = '5px'
        label.style.marginRight = '20px'
        label.style.cursor = 'pointer'
        label.style.fontSize = '14px'
        label.style.color = '#606266'
        label.onclick = () => {
          ;(radio as HTMLInputElement).click()
        }
        radio.parentNode?.insertBefore(label, radio.nextSibling)
      }
    })

    // 阻止表单默认提交行为
    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      e.stopPropagation()

      // 获取表单数据
      const formData = new FormData(form as HTMLFormElement)
      const data: Record<string, string | number> = {}
      formData.forEach((value, key) => {
        data[key] = value as string
      })

      // 显示确认对话框
      try {
        await ElMessageBox.confirm('确认修改无误？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        // 调用 API 保存数据
        loading.value = true
        try {
          const res = await saveFinanceSettingApi(data)
          if (res.code === 1) {
            ElMessage.success(res.msg || '修改成功')
          } else {
            ElMessage.error(res.msg || '修改失败')
          }
        } catch (error) {
          console.error('保存财务设置失败:', error)
          ElMessage.error('保存失败，请稍后重试')
        } finally {
          loading.value = false
        }
      } catch {
        // 用户取消操作
      }

      return false
    })

    // 阻止按钮的默认行为
    const submitBtn = form.querySelector('button[type="submit"]')
    if (submitBtn) {
      submitBtn.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()

        // 触发表单提交事件
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
        form.dispatchEvent(submitEvent)
      })
    }
  }
}

// 初始化
onMounted(() => {
  getSettingHtml()
})
</script>

<style scoped lang="scss">
.page-container {
  width: 100%;

  .finance-setting-content {
    width: 100%;
    padding: 20px;

    // 隐藏原有的 layui 样式引用和脚本
    :deep(head),
    :deep(script) {
      display: none;
    }

    // 卡片样式
    :deep(.layui-card) {
      border: none;
      box-shadow: none;
      margin-bottom: 0;
    }

    :deep(.layui-card-header) {
      font-size: 16px;
      font-weight: bold;
      color: #303133;
      border-bottom: 1px solid #ebeef5;
      padding: 18px 20px;
      background-color: #fff;
    }

    :deep(.layui-card-body) {
      padding: 20px;
    }

    // 表单样式
    :deep(.layui-form) {
      max-width: 800px;
    }

    :deep(.layui-form-item) {
      margin-bottom: 22px;
      clear: both;
    }

    :deep(.layui-form-label) {
      float: left;
      display: block;
      padding: 9px 15px 9px 0;
      width: 150px;
      font-weight: 400;
      line-height: 20px;
      text-align: right;
      color: #606266;
      font-size: 14px;

      .form_required {
        color: #f56c6c;
        margin-right: 4px;
      }
    }

    :deep(.layui-input-block) {
      margin-left: 150px;
      min-height: 36px;
    }

    // 输入框样式
    :deep(.layui-input) {
      height: 32px;
      line-height: 32px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      padding: 0 15px;
      font-size: 14px;
      color: #606266;
      transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

      &:focus {
        border-color: #409eff;
        outline: none;
      }

      &::placeholder {
        color: #c0c4cc;
      }
    }

    // 单选按钮样式
    :deep(input[type='radio']) {
      width: 14px;
      height: 14px;
      margin: 0;
      vertical-align: middle;
      cursor: pointer;
    }

    // 提示文字样式
    :deep(.layui-form-mid) {
      display: block;
      margin-top: 5px;
      font-size: 12px;
      color: #909399;
      line-height: 1.5;
    }

    // 按钮样式
    :deep(.layui-btn) {
      display: inline-block;
      height: 32px;
      line-height: 32px;
      padding: 0 15px;
      background-color: #409eff;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background-color: #66b1ff;
      }

      &:active {
        background-color: #3a8ee6;
      }
    }

    // 隐藏不需要的元素
    :deep(.layui-fluid),
    :deep(.layadmin-cmdlist-fluid) {
      padding: 0;
      margin: 0;
    }

    :deep(.layui-row) {
      margin: 0;
    }

    :deep(.layui-col-md12) {
      padding: 0;
    }
  }
}
</style>
