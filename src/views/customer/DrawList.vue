<template>
  <div class="page-container">
    <!-- 操作按钮区域 -->
    <el-card shadow="never" class="toolbar-card">
      <div class="toolbar">
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
        <el-button
          type="success"
          :icon="Check"
          :disabled="selectedRows.length === 0"
          @click="handleBatchEnable"
        >
          启用
        </el-button>
        <el-button
          type="warning"
          :icon="RemoveFilled"
          :disabled="selectedRows.length === 0"
          @click="handleBatchDisable"
        >
          禁用
        </el-button>
        <el-button
          type="danger"
          :icon="Delete"
          :disabled="selectedRows.length === 0"
          @click="handleBatchDelete"
        >
          删除
        </el-button>
      </div>
    </el-card>

    <el-card shadow="never" style="margin-top: 10px">
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
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column label="奖品图片" width="100" align="center">
          <template #default="{ row }">
            <el-image
              v-if="getImgSrc(row.img)"
              :src="getImgSrc(row.img)"
              style="width: 50px; height: 50px"
              fit="contain"
              :preview-src-list="[getImgSrc(row.img)]"
              preview-teleported
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="奖项名称" align="center" />
        <el-table-column prop="award" label="奖品名称" align="center" />
        <el-table-column prop="money" label="金额" align="center" />
        <el-table-column prop="prob" label="中奖概率" align="center" />
        <el-table-column prop="sort" label="排序" align="center" />
        <el-table-column prop="status" label="状态" align="center">
          <template #default="{ row }">
            <el-icon v-if="row.status === 1" color="#67c23a" size="20"><Select /></el-icon>
            <el-icon v-else color="#f56c6c" size="20"><CloseBold /></el-icon>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" align="center" fixed="right">
          <template #default="{ row }">
            <div class="table-actions">
              <el-link type="primary" :underline="false" @click="handleEdit(row)">编辑</el-link>
              <el-link
                v-if="row.status === 0"
                type="success"
                :underline="false"
                @click="handleEnable(row)"
              >
                启用
              </el-link>
              <el-link v-else type="warning" :underline="false" @click="handleDisable(row)">
                禁用
              </el-link>
              <el-link type="danger" :underline="false" @click="handleDelete(row)">删除</el-link>
            </div>
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
    <!-- 弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="80%"
      top="5vh"
      destroy-on-close
      @close="handleDialogClose"
    >
      <iframe :srcdoc="iframeHtml" class="iframe-container"></iframe>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Select, CloseBold, Plus, Delete, RemoveFilled, Check } from '@element-plus/icons-vue'
import axios from 'axios'
import {
  getDrawListApi,
  deleteDrawApi,
  enableDrawApi,
  disableDrawApi,
  type DrawListParams,
  type DrawItem
} from '@/api/draw'

// 弹窗控制
const dialogVisible = ref(false)
const iframeHtml = ref('')
const dialogTitle = ref('')

// 监听 iframe 消息
const handleMessage = (event: MessageEvent) => {
  if (event.data && event.data.type === 'draw-operate-success') {
    ElMessage.success('操作成功')
    dialogVisible.value = false
    iframeHtml.value = '' // 清理内容
    getList() // 刷新列表
  }
}

// 查询参数
const queryParams = reactive<DrawListParams>({
  page: 1,
  limit: 15
})

// 表格数据
const tableData = ref<DrawItem[]>([])
const total = ref(0)
const loading = ref(false)

// 选中的行
const selectedRows = ref<DrawItem[]>([])

// 提取图片链接
const getImgSrc = (imgHtml: string) => {
  if (!imgHtml) return ''
  const match = imgHtml.match(/src="([^"]*)"/)
  return match ? match[1] : ''
}

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const res = await getDrawListApi(queryParams)
    tableData.value = res.data || []
    total.value = res.count || 0
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败，请稍后重试')
  } finally {
    loading.value = false
  }
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

// 处理选择变化
const handleSelectionChange = (selection: DrawItem[]) => {
  selectedRows.value = selection
}

// 新增
const handleAdd = async () => {
  try {
    // 获取HTML内容，替换静态资源路径
    // 不添加 X-Requested-With 头，避免触发后端返回JSON
    const res = await axios.get('/index/draw/add.html', {
      headers: { 'X-Requested-With': undefined }
    })
    let html = res.data
    // 替换 /public 路径为绝对路径
    html = html.replace(/href="\/public/g, 'href="https://axf.anxinfupp.com/public')
    html = html.replace(/src="\/public/g, 'src="https://axf.anxinfupp.com/public')
    // 替换按钮文字
    html = html.replace('立即提交', '确定')

    // 注入自定义样式优化
    const customStyle = `
      <style>
        /* 全局背景白色，去除灰色 */
        html, body { background-color: #fff !important; height: auto !important; min-height: 100%; }
        /* 覆盖 Layui 按钮颜色为 Element Plus 主题色 */
        .layui-btn { background-color: #409eff !important; border-color: #409eff !important; }
        .layui-btn:hover { opacity: 0.8; }

        .layui-fluid { padding: 20px !important; background-color: #fff !important; }
        /* 隐藏原页面的卡片标题 */
        .layui-card-header { display: none !important; }
        /* 表单居中美化 */
        .layui-form {
          margin: 0 auto;
          max-width: 600px;
          padding-top: 20px;
        }
        /* 调整输入框宽度 */
        .layui-input-inline { width: 300px !important; }
        /* 隐藏"返回上级"按钮 */
        .layui-btn-primary { display: none !important; }
        /* 调整底部按钮区域 */
        .layui-form-item:last-child { text-align: center; margin-top: 30px; margin-bottom: 20px; }
        .layui-input-block { margin-left: 0 !important; }
      </style>
    `
    // 注入脚本拦截表单提交
    const customScript = `
    <script>
      // 等待 DOM 加载完成
      document.addEventListener('DOMContentLoaded', function() {
        var form = document.querySelector('form');
        if (form) {
          form.addEventListener('submit', function(e) {
            e.preventDefault(); // 阻止默认提交

            // 获取表单数据
            var formData = new FormData(form);
            var action = form.getAttribute('action');

            // 手动提交表单
            fetch(action, {
              method: 'POST',
              body: formData,
              credentials: 'include' // 携带 Cookie
            })
            .then(function(response) {
              return response.json();
            })
            .then(function(data) {
              if (data.code === 1) {
                // 成功，立即通知父页面关闭
                window.parent.postMessage({ type: 'draw-operate-success' }, '*');
              } else {
                // 失败，也直接关闭弹窗
                window.parent.postMessage({ type: 'draw-operate-success' }, '*');
              }
            })
            .catch(function(error) {
              console.error('提交失败:', error);
              // 出错也直接关闭弹窗
              window.parent.postMessage({ type: 'draw-operate-success' }, '*');
            });
          });
        }
      });
    <\/script>
    `
    html = html.replace('</head>', customStyle + customScript + '</head>')

    iframeHtml.value = html
    dialogTitle.value = '新增奖品'
    dialogVisible.value = true
  } catch (error) {
    console.error('加载页面失败:', error)
    ElMessage.error('加载页面失败')
  }
}

// 编辑
const handleEdit = async (row: DrawItem) => {
  try {
    const res = await axios.get(`/index/draw/edit.html?id=${row.id}`, {
      headers: { 'X-Requested-With': undefined }
    })
    let html = res.data
    // 替换 /public 路径为绝对路径
    html = html.replace(/href="\/public/g, 'href="https://axf.anxinfupp.com/public')
    html = html.replace(/src="\/public/g, 'src="https://axf.anxinfupp.com/public')
    // 替换按钮文字
    html = html.replace('立即提交', '确定')

    // 注入自定义样式优化
    const customStyle = `
      <style>
        /* 全局背景白色，去除灰色 */
        html, body { background-color: #fff !important; height: auto !important; min-height: 100%; }
        /* 覆盖 Layui 按钮颜色为 Element Plus 主题色 */
        .layui-btn { background-color: #409eff !important; border-color: #409eff !important; }
        .layui-btn:hover { opacity: 0.8; }

        .layui-fluid { padding: 20px !important; background-color: #fff !important; }
        /* 隐藏原页面的卡片标题 */
        .layui-card-header { display: none !important; }
        /* 表单居中美化 */
        .layui-form {
          margin: 0 auto;
          max-width: 600px;
          padding-top: 20px;
        }
        /* 调整输入框宽度 */
        .layui-input-inline { width: 300px !important; }
        /* 隐藏"返回上级"按钮 */
        .layui-btn-primary { display: none !important; }
        /* 调整底部按钮区域 */
        .layui-form-item:last-child { text-align: center; margin-top: 30px; margin-bottom: 20px; }
        .layui-input-block { margin-left: 0 !important; }
      </style>
    `
    // 注入脚本拦截表单提交
    const customScript = `
    <script>
      // 等待 DOM 加载完成
      document.addEventListener('DOMContentLoaded', function() {
        var form = document.querySelector('form');
        if (form) {
          form.addEventListener('submit', function(e) {
            e.preventDefault(); // 阻止默认提交

            // 获取表单数据
            var formData = new FormData(form);
            var action = form.getAttribute('action');

            // 手动提交表单
            fetch(action, {
              method: 'POST',
              body: formData,
              credentials: 'include' // 携带 Cookie
            })
            .then(function(response) {
              return response.json();
            })
            .then(function(data) {
              if (data.code === 1) {
                // 成功，立即通知父页面关闭
                window.parent.postMessage({ type: 'draw-operate-success' }, '*');
              } else {
                // 失败，也直接关闭弹窗
                window.parent.postMessage({ type: 'draw-operate-success' }, '*');
              }
            })
            .catch(function(error) {
              console.error('提交失败:', error);
              // 出错也直接关闭弹窗
              window.parent.postMessage({ type: 'draw-operate-success' }, '*');
            });
          });
        }
      });
    <\/script>
    `
    html = html.replace('</head>', customStyle + customScript + '</head>')

    iframeHtml.value = html
    dialogTitle.value = '编辑奖品'
    dialogVisible.value = true
  } catch (error) {
    console.error('加载页面失败:', error)
    ElMessage.error('加载页面失败')
  }
}

// 弹窗关闭
const handleDialogClose = () => {
  dialogVisible.value = false
  iframeHtml.value = ''
  getList() // 关闭弹窗时刷新列表
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的奖品')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 个奖品吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const jsonData = JSON.stringify(selectedRows.value)
    const res = await deleteDrawApi({ jsonData })

    if (res.code === 1) {
      ElMessage.success(res.msg || '删除成功')
      selectedRows.value = [] // 清空选择
      await getList() // 刷新列表
    } else {
      ElMessage.error(res.msg || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败，请稍后重试')
    }
  }
}

// 删除单个奖品
const handleDelete = async (row: DrawItem) => {
  try {
    await ElMessageBox.confirm(`确定要删除奖品 ${row.name} 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const jsonData = JSON.stringify([row])
    const res = await deleteDrawApi({ jsonData })

    if (res.code === 1) {
      ElMessage.success(res.msg || '删除成功')
      await getList() // 刷新列表
    } else {
      ElMessage.error(res.msg || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败，请稍后重试')
    }
  }
}

// 启用单个
const handleEnable = async (row: DrawItem) => {
  try {
    await ElMessageBox.confirm(`确定要启用奖品 ${row.name} 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await enableDrawApi({ ids: row.id })
    if (res.code === 1) {
      ElMessage.success(res.msg || '启用成功')
      await getList()
    } else {
      ElMessage.error(res.msg || '启用失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('启用失败:', error)
      ElMessage.error('启用失败')
    }
  }
}

// 禁用单个
const handleDisable = async (row: DrawItem) => {
  try {
    await ElMessageBox.confirm(`确定要禁用奖品 ${row.name} 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await disableDrawApi({ ids: row.id })
    if (res.code === 1) {
      ElMessage.success(res.msg || '禁用成功')
      await getList()
    } else {
      ElMessage.error(res.msg || '禁用失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('禁用失败:', error)
      ElMessage.error('禁用失败')
    }
  }
}

// 批量启用
const handleBatchEnable = async () => {
  if (selectedRows.value.length === 0) return
  try {
    await ElMessageBox.confirm(`确定要启用选中的 ${selectedRows.value.length} 个奖品吗？`, '提示', {
      type: 'warning'
    })
    const ids = selectedRows.value.map((item) => item.id).join(',')
    const res = await enableDrawApi({ ids })
    if (res.code === 1) {
      ElMessage.success(res.msg || '批量启用成功')
      selectedRows.value = []
      await getList()
    } else {
      ElMessage.error(res.msg || '批量启用失败')
    }
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('批量启用失败')
  }
}

// 批量禁用
const handleBatchDisable = async () => {
  if (selectedRows.value.length === 0) return
  try {
    await ElMessageBox.confirm(`确定要禁用选中的 ${selectedRows.value.length} 个奖品吗？`, '提示', {
      type: 'warning'
    })
    const ids = selectedRows.value.map((item) => item.id).join(',')
    const res = await disableDrawApi({ ids })
    if (res.code === 1) {
      ElMessage.success(res.msg || '批量禁用成功')
      selectedRows.value = []
      await getList()
    } else {
      ElMessage.error(res.msg || '批量禁用失败')
    }
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('批量禁用失败')
  }
}

// 页面加载时获取数据
onMounted(() => {
  getList()
  window.addEventListener('message', handleMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
})
</script>

<style scoped lang="scss">
.page-container {
  padding: 20px;

  .toolbar-card {
    margin-bottom: 10px;
    :deep(.el-card__body) {
      padding: 15px;
    }
  }

  .toolbar {
    display: flex;
    gap: 10px;
  }

  .table-actions {
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}

.iframe-container {
  width: 100%;
  height: 600px;
  border: none;
}
</style>
