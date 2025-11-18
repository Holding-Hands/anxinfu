<template>
  <div class="system-config-container">
    <el-card>
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="技术" name="1">
          <div v-loading="loading" class="content-container">
            <div v-if="htmlContent['1']" class="html-content" v-html="htmlContent['1']"></div>
            <el-empty v-else-if="!loading" description="暂无数据"></el-empty>
          </div>
        </el-tab-pane>

        <el-tab-pane label="系统" name="2">
          <div v-loading="loading" class="content-container">
            <div v-if="htmlContent['2']" class="html-content" v-html="htmlContent['2']"></div>
            <el-empty v-else-if="!loading" description="暂无数据"></el-empty>
          </div>
        </el-tab-pane>

        <el-tab-pane label="开发" name="3">
          <div v-loading="loading" class="content-container">
            <div v-if="htmlContent['3']" class="html-content" v-html="htmlContent['3']"></div>
            <el-empty v-else-if="!loading" description="暂无数据"></el-empty>
          </div>
        </el-tab-pane>

        <el-tab-pane label="模板" name="4">
          <div v-loading="loading" class="content-container">
            <div v-if="htmlContent['4']" class="html-content" v-html="htmlContent['4']"></div>
            <el-empty v-else-if="!loading" description="暂无数据"></el-empty>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { getConfigGroupApi } from '@/api/config'
import { ElMessage } from 'element-plus'

// 当前激活的tab
const activeTab = ref('1')

// 加载状态
const loading = ref(false)

// HTML内容缓存
const htmlContent = ref<Record<string, string>>({
  '1': '',
  '2': '',
  '3': '',
  '4': ''
})

// 获取配置页面内容
const fetchConfigContent = async (groupId: string) => {
  // 如果已经加载过，直接返回
  if (htmlContent.value[groupId]) {
    return
  }

  loading.value = true
  try {
    const response = await getConfigGroupApi(Number(groupId))
    console.log('API响应:', response)
    console.log('response.data类型:', typeof response.data)
    console.log('response.data内容:', response.data)

    // 直接使用response.data作为HTML内容
    if (response.data) {
      htmlContent.value[groupId] = response.data
    } else {
      console.warn('未找到HTML内容')
    }

    // 等待DOM更新后处理表单
    await nextTick()
    processFormsInContent()
  } catch (error) {
    console.error('获取配置失败:', error)
    ElMessage.error('获取配置失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 处理HTML内容中的表单，修改其target和添加拦截
const processFormsInContent = () => {
  const forms = document.querySelectorAll('.html-content form')
  forms.forEach((form) => {
    const formElement = form as HTMLFormElement

    // 移除target属性，防止在新窗口打开
    formElement.removeAttribute('target')

    // 修改form的action，确保是相对路径
    if (formElement.action) {
      try {
        const url = new URL(formElement.action)
        formElement.action = url.pathname + url.search
      } catch (e) {
        // 已经是相对路径
      }
    }
  })

  // 处理复选框，在后面添加title文字
  const checkboxes = document.querySelectorAll('.html-content input[type="checkbox"][title]')
  checkboxes.forEach((checkbox) => {
    const input = checkbox as HTMLInputElement
    const title = input.getAttribute('title')

    if (title && !input.nextElementSibling?.classList.contains('checkbox-label')) {
      // 创建label元素
      const label = document.createElement('span')
      label.className = 'checkbox-label'
      label.textContent = title
      label.style.marginRight = '15px'
      label.style.cursor = 'pointer'

      // 点击label也能切换复选框
      label.addEventListener('click', () => {
        input.checked = !input.checked
      })

      // 在复选框后面插入label
      input.parentNode?.insertBefore(label, input.nextSibling)
    }
  })

  // 处理单选框，在后面添加title文字
  const radios = document.querySelectorAll('.html-content input[type="radio"][title]')
  radios.forEach((radio) => {
    const input = radio as HTMLInputElement
    const title = input.getAttribute('title')

    if (title && !input.nextElementSibling?.classList.contains('radio-label')) {
      // 创建label元素
      const label = document.createElement('span')
      label.className = 'radio-label'
      label.textContent = title
      label.style.marginRight = '15px'
      label.style.cursor = 'pointer'

      // 点击label也能切换单选框
      label.addEventListener('click', () => {
        input.checked = true
      })

      // 在单选框后面插入label
      input.parentNode?.insertBefore(label, input.nextSibling)
    }
  })
}

// 处理tab切换
const handleTabChange = (tabName: string | number) => {
  fetchConfigContent(String(tabName))
}

// 监听activeTab变化
watch(
  activeTab,
  (newTab) => {
    fetchConfigContent(newTab)
  },
  { immediate: true }
)

// 表单提交处理函数
const handleFormSubmit = (e: Event) => {
  const target = e.target as HTMLFormElement
  // 检查是否是html-content内的表单
  if (target.closest('.html-content')) {
    e.preventDefault()
    e.stopPropagation()

    console.log('拦截表单提交')

    // 获取表单数据
    const formData = new FormData(target)
    let action = target.action

    // 处理action URL，提取路径部分
    if (action) {
      try {
        const url = new URL(action)
        // 只保留路径和查询参数
        action = url.pathname + url.search
      } catch (e) {
        // 如果不是完整URL，直接使用
        console.log('使用相对路径:', action)
      }
    }

    console.log('提交到:', action)

    // 转换FormData为URLSearchParams
    const urlSearchParams = new URLSearchParams()
    formData.forEach((value, key) => {
      urlSearchParams.append(key, value.toString())
    })

    loading.value = true
    import('@/utils/request').then(({ request }) => {
      request
        .post(action, urlSearchParams, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then((response: any) => {
          console.log('提交响应:', response)
          if (response.code === 1) {
            ElMessage.success(response.msg || '操作成功')
            // 重新加载当前tab内容
            htmlContent.value[activeTab.value] = ''
            fetchConfigContent(activeTab.value)
          } else {
            ElMessage.error(response.msg || '操作失败')
          }
        })
        .catch((error: any) => {
          console.error('提交失败:', error)
          ElMessage.error('提交失败，请稍后重试')
        })
        .finally(() => {
          loading.value = false
        })
    })

    return false
  }
}

onMounted(() => {
  // 初始加载第一个tab的内容
  fetchConfigContent('1')
  // 拦截表单提交
  document.addEventListener('submit', handleFormSubmit, true)
})

onUnmounted(() => {
  // 移除事件监听器
  document.removeEventListener('submit', handleFormSubmit, true)
})
</script>

<style scoped lang="scss">
.system-config-container {
  padding: 20px;
  height: calc(100vh - 120px);
  overflow: hidden;

  :deep(.el-card) {
    height: 100%;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
  }

  :deep(.el-card__body) {
    height: 100%;
    padding: 0;
  }

  :deep(.el-tabs) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  :deep(.el-tabs__content) {
    flex: 1;
    overflow-y: auto;
  }

  .content-container {
    min-height: 400px;
    padding: 30px;
    background-color: #fff;
  }

  .html-content {
    width: 100%;
    line-height: 1.8;
    font-size: 14px;
    color: #303133;
    font-family:
      -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
      'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;

    // 隐藏layui-tab标签页
    :deep(.layui-tab) {
      display: none !important;
    }

    // 链接样式
    :deep(a) {
      color: #409eff;
      text-decoration: none;
      transition: color 0.3s;

      &:hover {
        color: #66b1ff;
        text-decoration: underline;
      }
    }

    // 列表样式
    :deep(ul),
    :deep(ol) {
      padding-left: 20px;
      margin: 15px 0;

      li {
        margin: 8px 0;
        line-height: 1.8;
      }
    }

    // 表单样式优化
    :deep(form) {
      max-width: 100%;

      .form-group,
      .layui-form-item {
        margin-bottom: 18px;
        display: flex;
        align-items: center;

        &::after {
          content: '';
          display: table;
          clear: both;
        }
      }

      label,
      .layui-form-label {
        display: inline-block;
        width: 100px;
        margin-bottom: 0;
        font-weight: 400;
        text-align: right;
        padding-right: 12px;
        color: #606266;
        flex-shrink: 0;
        font-size: 14px;
        line-height: 36px;
      }

      .layui-input-block {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        // 提交按钮居中
        &:has(button[type='submit']),
        &:has(.layui-btn[lay-submit]) {
          justify-content: center;
          margin-left: -100px; // 抵消label宽度，实现真正居中
        }
      }

      .layui-input-inline {
        display: inline-block;
        width: auto;
        min-width: 260px;
        margin-right: 10px;
      }

      input[type='text'],
      input[type='number'],
      input[type='password'],
      textarea,
      select,
      .layui-input,
      .layui-textarea,
      .layui-select {
        width: 100%;
        height: 36px;
        line-height: 36px;
        padding: 0 12px;
        border: 1px solid #e6e6e6;
        border-radius: 2px;
        font-size: 14px;
        transition: all 0.3s;
        background-color: #fff;
        color: #333;

        &:hover {
          border-color: #c0c4cc;
        }

        &:focus {
          outline: none;
          border-color: #409eff;
        }

        &::placeholder {
          color: #c0c4cc;
        }
      }

      textarea,
      .layui-textarea {
        height: auto;
        min-height: 80px;
        line-height: 1.6;
        padding: 8px 12px;
        resize: vertical;
      }

      // 辅助文字
      .layui-form-mid {
        padding: 0 0 0 10px;
        color: #999;
        font-size: 12px;
        line-height: 36px;
      }

      .layui-word-aux {
        padding-left: 10px;
        color: #999;
        font-size: 12px;
      }

      // 复选框样式
      input[type='checkbox'] {
        width: 16px;
        height: 16px;
        margin-right: 8px;
        margin-top: 2px;
        cursor: pointer;
        vertical-align: middle;
        appearance: auto;
        -webkit-appearance: checkbox;
      }

      input[type='radio'] {
        width: 16px;
        height: 16px;
        margin-right: 8px;
        cursor: pointer;
        vertical-align: middle;
        appearance: auto;
        -webkit-appearance: radio;
      }

      // 复选框组容器
      .checkbox-group,
      .layui-form-checkbox {
        display: inline-flex;
        align-items: center;
        margin-right: 20px;
        margin-bottom: 10px;

        input[type='checkbox'] {
          margin: 0 6px 0 0;
        }

        span {
          cursor: pointer;
          user-select: none;
        }
      }

      // 按钮样式
      button,
      .layui-btn {
        height: 36px;
        line-height: 36px;
        padding: 0 20px;
        background-color: #409eff;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 400;
        transition: all 0.3s;
        margin-right: 10px;
        display: inline-block;
        text-align: center;

        &:hover {
          background-color: #66b1ff;
        }

        &:active {
          background-color: #3a8ee6;
        }

        &.layui-btn-primary {
          background-color: #fff;
          color: #606266;
          border: 1px solid #dcdfe6;

          &:hover {
            color: #409eff;
            border-color: #c6e2ff;
            background-color: #ecf5ff;
          }
        }

        &.layui-btn-normal {
          background-color: #409eff;
        }

        &.layui-btn-warm {
          background-color: #e6a23c;

          &:hover {
            background-color: #ebb563;
          }
        }

        &.layui-btn-danger {
          background-color: #f56c6c;

          &:hover {
            background-color: #f78989;
          }
        }

        // 带图标的按钮
        i {
          margin-right: 4px;
        }
      }

      // 图片上传区域
      .layui-upload {
        display: inline-block;
      }

      .show-img {
        margin-top: 12px;
        position: relative;
        width: 150px;
        height: 150px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        overflow: hidden;
        transition: all 0.3s;

        &:hover {
          border-color: #409eff;

          p {
            opacity: 1;
          }
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        p {
          position: absolute;
          width: 100%;
          height: 40px;
          line-height: 40px;
          text-align: center;
          background: rgba(0, 0, 0, 0.5);
          bottom: 0;
          margin: 0;
          opacity: 0;
          transition: opacity 0.3s;

          a {
            display: block;
            color: #fff;
            font-size: 14px;
            text-decoration: none;

            &:hover {
              color: #409eff;
            }
          }
        }
      }

      // 隐藏的图片容器
      .show-img[style*='display: none'],
      .show-img[style*='display:none'] {
        display: none !important;
      }

      // 提示文字
      .layui-form-mid {
        padding: 0 10px;
        color: #999;
        font-size: 12px;
      }
    }

    // 表格样式优化
    :deep(table) {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;

      th,
      td {
        padding: 12px;
        border: 1px solid #ebeef5;
        text-align: left;
      }

      th {
        background-color: #f5f7fa;
        font-weight: 500;
        color: #606266;
      }

      tr:hover {
        background-color: #f5f7fa;
      }
    }

    // 标题样式
    :deep(h1),
    :deep(h2),
    :deep(h3),
    :deep(h4) {
      margin: 15px 0 10px;
      font-weight: 500;
      color: #303133;
    }

    // 段落样式
    :deep(p) {
      margin: 10px 0;
      color: #606266;
    }
  }

  :deep(.el-tabs__header) {
    margin: 0;
    padding: 0 20px;
    background-color: #fafafa;
    border-bottom: 1px solid #e4e7ed;
  }

  :deep(.el-tabs__nav-wrap) {
    &::after {
      display: none;
    }
  }

  :deep(.el-tabs__item) {
    font-size: 15px;
    padding: 0 30px;
    height: 50px;
    line-height: 50px;
    color: #606266;
    font-weight: 500;
    transition: all 0.3s;

    &:hover {
      color: #409eff;
    }

    &.is-active {
      color: #409eff;
      font-weight: 600;
    }
  }

  :deep(.el-tabs__active-bar) {
    height: 3px;
    background: linear-gradient(90deg, #409eff 0%, #66b1ff 100%);
  }

  // 滚动条样式
  :deep(.el-tabs__content) {
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #dcdfe6;
      border-radius: 4px;
      transition: background-color 0.3s;

      &:hover {
        background-color: #c0c4cc;
      }
    }

    &::-webkit-scrollbar-track {
      background-color: #f5f7fa;
    }
  }
}
</style>
