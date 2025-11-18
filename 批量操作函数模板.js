// ========================================
// 通用批量操作函数模板
// 使用说明：复制到对应页面，替换接口地址即可
// ========================================

// 切换启用/禁用状态
const handleToggleStatus = async (row) => {
  const isEnabled = row.status === 1
  const action = isEnabled ? '禁用' : '启用'

  try {
    await ElMessageBox.confirm(`确定要${action}吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 【需要替换】根据页面修改接口地址
    const url = isEnabled
      ? '/index/XXX/setdisable.html' // 禁用接口
      : '/index/XXX/setenable.html' // 启用接口

    const formData = new URLSearchParams()
    formData.append('ids', String(row.id))

    const res = await request.post(url, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    if (res.code === 1) {
      ElMessage.success(res.msg || `${action}成功`)
      await getList()
    } else {
      ElMessage.error(res.msg || `${action}失败`)
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error(`${action}失败:`, error)
      ElMessage.error(`${action}失败，请稍后重试`)
    }
  }
}

// 批量启用
const handleBatchEnable = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请先选择要启用的数据')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要启用选中的 ${selectedIds.value.length} 项吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const formData = new URLSearchParams()
    formData.append('ids', selectedIds.value.join(','))

    // 【需要替换】根据页面修改接口地址
    const res = await request.post('/index/XXX/setenable.html', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    if (res.code === 1) {
      ElMessage.success(res.msg || '批量启用成功')
      selectedIds.value = []
      await getList()
    } else {
      ElMessage.error(res.msg || '批量启用失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量启用失败:', error)
      ElMessage.error('批量启用失败，请稍后重试')
    }
  }
}

// 批量禁用
const handleBatchDisable = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请先选择要禁用的数据')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要禁用选中的 ${selectedIds.value.length} 项吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const formData = new URLSearchParams()
    formData.append('ids', selectedIds.value.join(','))

    // 【需要替换】根据页面修改接口地址
    const res = await request.post('/index/XXX/setdisable.html', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    if (res.code === 1) {
      ElMessage.success(res.msg || '批量禁用成功')
      selectedIds.value = []
      await getList()
    } else {
      ElMessage.error(res.msg || '批量禁用失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量禁用失败:', error)
      ElMessage.error('批量禁用失败，请稍后重试')
    }
  }
}

// ========================================
// 各页面接口地址参考
// ========================================

/*
平台管理 (PlatformManage.vue):
  - 启用: /index/platform/setenable.html
  - 禁用: /index/platform/setdisable.html

产品列表 (ProductList.vue):
  - 启用: /index/product/setenable.html
  - 禁用: /index/product/setdisable.html

押金政策 (DepositPolicy.vue):
  - 启用: /index/product_active/setenable.html
  - 禁用: /index/product_active/setdisable.html

流量费政策 (TrafficPolicy.vue):
  - 启用: /index/product_sim/setenable.html
  - 禁用: /index/product_sim/setdisable.html

上涨结算价 (SettleRisePrice.vue):
  - 启用: /index/product_rise/setenable.html
  - 禁用: /index/product_rise/setdisable.html

涨价分成 (ProductRisePrice.vue):
  - 启用: /index/product_rise_price/setenable.html
  - 禁用: /index/product_rise_price/setdisable.html
*/
