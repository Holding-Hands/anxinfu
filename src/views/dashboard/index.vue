<template>
  <div class="dashboard-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="6" :lg="6">
        <el-card shadow="never" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon order-icon">
              <el-icon :size="24"><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">订单总数</div>
              <div class="stat-value">{{ dashboardData.order_count || 0 }}</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6" :lg="6">
        <el-card shadow="never" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon today-icon">
              <el-icon :size="24"><Clock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">待付款订单</div>
              <div class="stat-value">{{ dashboardData.pending_count || 0 }}</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6" :lg="6">
        <el-card shadow="never" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon user-icon">
              <el-icon :size="24"><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">盟友总数</div>
              <div class="stat-value">{{ dashboardData.user_count || 0 }}</div>
              <div class="stat-desc">本月增加{{ dashboardData.user_month_add }}人</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6" :lg="6">
        <el-card shadow="never" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon agent-icon">
              <el-icon :size="24"><UserFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">后台管理员</div>
              <div class="stat-value">{{ dashboardData.admin_count || 0 }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :sm="24" :md="24" :lg="24">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>激活量和交易量图表</span>
            </div>
          </template>
          <div ref="lineChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷入口 -->
    <el-card shadow="never" class="shortcut-card">
      <template #header>
        <div class="card-header">
          <span>快捷入口</span>
        </div>
      </template>
      <el-row :gutter="20" class="shortcut-row">
        <el-col v-for="item in shortcuts" :key="item.path" :xs="12" :sm="8" :md="6" :lg="3">
          <div class="shortcut-item" @click="handleShortcut(item.path)">
            <div class="shortcut-icon" :style="{ backgroundColor: item.color }">
              <el-icon :size="28">
                <component :is="item.icon" />
              </el-icon>
            </div>
            <div class="shortcut-label">{{ item.label }}</div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Document,
  Clock,
  User,
  UserFilled,
  Postcard,
  Management,
  Money
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { getDashboardHtmlApi, parseDashboardData, type DashboardData } from '@/api/dashboard'

const router = useRouter()
const lineChartRef = ref<HTMLElement>()
let lineChart: echarts.ECharts | null = null

// 控制台数据
const dashboardData = reactive<DashboardData>({
  order_count: 0,
  pending_count: 0,
  user_count: 0,
  user_month_add: 0,
  admin_count: 0,
  chart_data: {
    dates: [],
    active_counts: [],
    amounts: []
  }
})

// 快捷入口配置
const shortcuts = [
  { label: '盟友管理', path: '/agent/ally-list', icon: UserFilled, color: '#667eea' },
  { label: '产品管理', path: '/product/platform', icon: Management, color: '#f093fb' },
  { label: '商城系统', path: '/mall/goods-list', icon: Postcard, color: '#4facfe' },
  { label: '机具管理', path: '/machine/stock-query', icon: Management, color: '#43e97b' },
  { label: '财务管理', path: '/finance/tixian-order', icon: Money, color: '#fa709a' },
  { label: '客户管理', path: '/customer/list', icon: User, color: '#fee140' }
]

// 获取控制台数据
const getDashboardData = async () => {
  try {
    const html = await getDashboardHtmlApi()
    const data = parseDashboardData(html as unknown as string)
    Object.assign(dashboardData, data)
    // 渲染图表
    renderCharts()
  } catch (error) {
    console.error('获取控制台数据失败:', error)
    ElMessage.error('获取数据失败')
  }
}

// 渲染图表
const renderCharts = () => {
  renderLineChart()
}

// 渲染折线图
const renderLineChart = () => {
  if (!lineChartRef.value) return

  if (!lineChart) {
    lineChart = echarts.init(lineChartRef.value)
  }

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['激活量', '交易量']
    },
    grid: {
      left: '8%',
      right: '8%',
      bottom: '5%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: dashboardData.chart_data?.dates || [
        '2025-03',
        '2025-04',
        '2025-05',
        '2025-06',
        '2025-07',
        '2025-08',
        '2025-09',
        '2025-10',
        '2025-11'
      ]
    },
    yAxis: [
      {
        type: 'value',
        name: '激活量',
        position: 'left',
        splitLine: {
          show: false
        },
        axisLabel: {
          formatter: '{value}个'
        }
      },
      {
        type: 'value',
        name: '交易量',
        position: 'right',
        axisLabel: {
          formatter: (value: number) => {
            if (value >= 10000) {
              return (value / 10000).toFixed(0) + '万元'
            }
            return value + '元'
          }
        }
      }
    ],
    series: [
      {
        name: '激活量',
        type: 'bar',
        barWidth: 30,
        data: dashboardData.chart_data?.active_counts || [25, 50, 45, 30, 35, 30, 45, 40, 40],
        itemStyle: {
          color: '#009688',
          borderRadius: [4, 4, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          color: '#000',
          fontSize: 12
        }
      },
      {
        name: '交易量',
        type: 'line',
        yAxisIndex: 1,
        data:
          dashboardData.chart_data?.amounts && dashboardData.chart_data.amounts.length > 0
            ? dashboardData.chart_data.amounts.map((a) => parseFloat(a))
            : [
                653509.52, 3477048.83, 5730937.39, 6200544.51, 8158342.52, 10256137.58, 11413636.25,
                12477031.23, 10409280.5
              ],
        itemStyle: {
          color: '#e74c3c'
        },
        lineStyle: {
          width: 3,
          color: '#e74c3c'
        },
        symbol: 'circle',
        symbolSize: 8,
        smooth: true,
        label: {
          show: true,
          position: 'top',
          color: '#e74c3c',
          fontSize: 11,
          fontWeight: 'bold',
          formatter: ((params: { value: number }) => {
            const value = params.value
            if (value >= 10000) {
              return (value / 10000).toFixed(2) + '万'
            }
            return value.toFixed(2)
          }) as never
        }
      }
    ]
  }

  lineChart.setOption(option)
}

// 快捷入口点击
const handleShortcut = (path: string) => {
  router.push(path)
}

// 窗口大小改变时重新渲染图表
const handleResize = () => {
  lineChart?.resize()
}

onMounted(() => {
  getDashboardData()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  lineChart?.dispose()
})
</script>

<style scoped lang="scss">
.dashboard-container {
  padding: 20px;

  .stats-row {
    margin-bottom: 20px;
  }

  .stat-card {
    border: 1px solid #ebeef5;
    height: 100%;

    :deep(.el-card__body) {
      height: 100%;
    }

    .stat-content {
      display: flex;
      align-items: flex-start;
      gap: 15px;
      height: 100%;
      min-height: 70px;

      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        flex-shrink: 0;

        &.order-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        &.today-icon {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        &.user-icon {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        &.agent-icon {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
      }

      .stat-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .stat-label {
          font-size: 12px;
          color: #909399;
          margin-bottom: 6px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #303133;
          line-height: 1;
        }

        .stat-desc {
          font-size: 12px;
          color: #909399;
          margin-top: 6px;
        }
      }
    }
  }

  .chart-row {
    margin-bottom: 20px;
  }

  .chart-container {
    width: 100%;
    height: 350px;
  }

  .shortcut-card {
    .shortcut-row {
      .shortcut-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        cursor: pointer;
        transition: all 0.3s;
        border-radius: 8px;

        &:hover {
          background-color: #f5f7fa;
          transform: translateY(-3px);
        }

        .shortcut-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          margin-bottom: 12px;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        }

        .shortcut-label {
          font-size: 14px;
          color: #606266;
          font-weight: 500;
        }
      }
    }
  }

  .card-header {
    font-size: 16px;
    font-weight: bold;
    color: #303133;
  }
}
</style>
