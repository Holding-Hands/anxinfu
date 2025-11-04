<template>
  <div class="dashboard-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
              <el-icon :size="32"><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">订单总数</div>
              <div class="stat-value">{{ statistics.订单总数 }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
              <el-icon :size="32"><Clock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">待付款订单</div>
              <div class="stat-value">{{ statistics.待付款订单 }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
              <el-icon :size="32"><UserFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">盟友总数</div>
              <div class="stat-value">{{ statistics.盟友总数 }}</div>
              <div class="stat-extra">本月增加 {{ statistics.本月增加 }}人</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
              <el-icon :size="32"><Avatar /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">后台管理员</div>
              <div class="stat-value">{{ statistics.后台管理员 }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :lg="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">激活量和交易量图表</span>
            </div>
          </template>
          <div ref="mainChartRef" class="chart" style="height: 400px"></div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :lg="8">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">数据统计</span>
            </div>
          </template>
          <div ref="pieChartRef" class="chart" style="height: 400px"></div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 快捷入口 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="quick-entry-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">快捷入口</span>
            </div>
          </template>
          
          <div class="quick-entry-grid">
            <div 
              v-for="item in quickEntries" 
              :key="item.path" 
              class="quick-entry-item"
              @click="handleQuickEntry(item.path)"
            >
              <div class="entry-icon" :style="{ background: item.color }">
                <el-icon :size="28">
                  <component :is="item.icon" />
                </el-icon>
              </div>
              <div class="entry-title">{{ item.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import {
  Document,
  Clock,
  UserFilled,
  Avatar,
  User,
  Goods,
  ShoppingCart,
  Printer,
  Wallet,
  Management,
  TrendCharts,
  Setting
} from '@element-plus/icons-vue'

const router = useRouter()

// 统计数据
const statistics = ref({
  订单总数: 18,
  待付款订单: 0,
  盟友总数: 63,
  后台管理员: 1,
  本月增加: 0
})

// 图表实例
const mainChartRef = ref<HTMLDivElement>()
const pieChartRef = ref<HTMLDivElement>()
let mainChart: echarts.ECharts | null = null
let pieChart: echarts.ECharts | null = null

// 快捷入口
const quickEntries = [
  { title: '代理商管理', path: '/agent/list-v2', icon: User, color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { title: '产品管理', path: '/product', icon: Goods, color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { title: '商城系统', path: '/mall', icon: ShoppingCart, color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { title: '机具管理', path: '/machine', icon: Printer, color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { title: '财务管理', path: '/finance', icon: Wallet, color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { title: '业务管理', path: '/business', icon: Management, color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
  { title: '运营管理', path: '/operation', icon: TrendCharts, color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  { title: '系统设置', path: '/system', icon: Setting, color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' }
]

// 初始化主图表
const initMainChart = () => {
  if (!mainChartRef.value) return
  
  mainChart = echarts.init(mainChartRef.value)
  
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
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08', '2025-09', '2025-10', '2025-11']
    },
    yAxis: [
      {
        type: 'value',
        name: '激活量'
      },
      {
        type: 'value',
        name: '交易量',
        axisLabel: {
          formatter: '{value}万元'
        }
      }
    ],
    series: [
      {
        name: '激活量',
        type: 'bar',
        data: [26, 47, 45, 29, 35, 32, 45, 39, 6],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        }
      },
      {
        name: '交易量',
        type: 'line',
        yAxisIndex: 1,
        data: [320, 532, 601, 734, 890, 1030, 1200, 1247, 1750],
        smooth: true,
        itemStyle: {
          color: '#ff6b6b'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 107, 107, 0.3)' },
            { offset: 1, color: 'rgba(255, 107, 107, 0.05)' }
          ])
        }
      }
    ]
  }
  
  mainChart.setOption(option)
}

// 初始化饼图
const initPieChart = () => {
  if (!pieChartRef.value) return
  
  pieChart = echarts.init(pieChartRef.value)
  
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 10,
      top: 20
    },
    series: [
      {
        name: '数据统计',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { 
            value: 1048, 
            name: '已激活',
            itemStyle: { color: '#5470c6' }
          },
          { 
            value: 735, 
            name: '已绑定',
            itemStyle: { color: '#91cc75' }
          },
          { 
            value: 580, 
            name: '使用中',
            itemStyle: { color: '#fac858' }
          },
          { 
            value: 484, 
            name: '待审核',
            itemStyle: { color: '#ee6666' }
          }
        ]
      }
    ]
  }
  
  pieChart.setOption(option)
}

// 处理快捷入口点击
const handleQuickEntry = (path: string) => {
  router.push(path)
}

// 窗口大小变化处理
const handleResize = () => {
  mainChart?.resize()
  pieChart?.resize()
}

onMounted(() => {
  initMainChart()
  initPieChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  mainChart?.dispose()
  pieChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.dashboard-container {
  width: 100%;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  transition: all 0.3s;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  
  :deep(.el-card__body) {
    padding: 20px;
  }
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
  
  .stat-label {
    font-size: 14px;
    color: #999;
    margin-bottom: 8px;
  }
  
  .stat-value {
    font-size: 28px;
    font-weight: bold;
    color: #333;
  }
  
  .stat-extra {
    font-size: 12px;
    color: #52c41a;
    margin-top: 4px;
  }
}

.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .card-title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }
  }
  
  .chart {
    width: 100%;
  }
}

.quick-entry-card {
  .card-header {
    .card-title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }
  }
}

.quick-entry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 15px;
  }
}

.quick-entry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  border-radius: 8px;
  transition: all 0.3s;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
    transform: translateY(-5px);
    
    .entry-icon {
      transform: scale(1.1);
    }
  }
  
  .entry-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    transition: all 0.3s;
  }
  
  .entry-title {
    font-size: 14px;
    color: #666;
    text-align: center;
  }
}
</style>

