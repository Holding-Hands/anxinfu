<template>
  <el-popover
    placement="bottom"
    :width="200"
    trigger="click"
    popper-class="theme-popover"
  >
    <template #reference>
      <div class="theme-switcher-button" title="一键换肤">
        <el-icon class="theme-icon">
          <Sunny />
        </el-icon>
      </div>
    </template>

    <div class="theme-menu">
      <div class="theme-menu-title">选择主题</div>
      <div class="theme-list">
        <div
          v-for="item in themes"
          :key="item.value"
          class="theme-item"
          :class="{ 'is-active': currentTheme === item.value }"
          @click="handleThemeChange(item.value)"
        >
          <div class="theme-color-dot" :style="{ backgroundColor: item.color }"></div>
          <span class="theme-label">{{ item.label }}</span>
          <el-icon v-if="currentTheme === item.value" class="check-icon">
            <Check />
          </el-icon>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore, type ThemeType } from '@/stores/app'
import { ElMessage } from 'element-plus'
import {
  Sunny,
  Check
} from '@element-plus/icons-vue'

const appStore = useAppStore()

// 主题配置
const themes = [
  {
    value: 'default' as ThemeType,
    label: '默认蓝',
    color: '#409eff'
  },
  {
    value: 'dark' as ThemeType,
    label: '暗黑夜',
    color: '#909399'
  },
  {
    value: 'purple' as ThemeType,
    label: '优雅紫',
    color: '#9c27b0'
  },
  {
    value: 'green' as ThemeType,
    label: '清新绿',
    color: '#52c41a'
  },
  {
    value: 'orange' as ThemeType,
    label: '活力橙',
    color: '#ff9800'
  },
  {
    value: 'pink' as ThemeType,
    label: '浪漫粉',
    color: '#e91e63'
  },
  {
    value: 'blue' as ThemeType,
    label: '商务蓝',
    color: '#1890ff'
  },
  {
    value: 'red' as ThemeType,
    label: '热情红',
    color: '#f44336'
  }
]

// 当前主题
const currentTheme = computed(() => appStore.theme)

// 切换主题
const handleThemeChange = (theme: ThemeType) => {
  if (theme === currentTheme.value) return

  appStore.setTheme(theme)

  const themeLabel = themes.find(t => t.value === theme)?.label || '主题'
  ElMessage.success(`已切换到${themeLabel}`)
}
</script>

<style scoped lang="scss">
.theme-switcher-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 12px rgba(102, 126, 234, 0.4);

  &:hover {
    transform: scale(1.15) rotate(20deg);
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.6);
  }

  .theme-icon {
    font-size: 20px;
    color: #fff;
  }
}

.theme-item {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 140px;
  padding: 4px 0;

  .theme-color-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .theme-label {
    flex: 1;
    font-size: 14px;
  }

  .check-icon {
    color: var(--primary-color);
    font-size: 16px;
  }
}

.theme-menu {
  padding: 8px 0;

  .theme-menu-title {
    padding: 8px 12px;
    font-size: 13px;
    color: var(--text-secondary);
    font-weight: 500;
    border-bottom: 1px solid var(--border-lighter);
    margin-bottom: 4px;
  }

  .theme-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
}
</style>

<style lang="scss">
.theme-popover.el-popper {
  padding: 0 !important;

  .theme-item {
    padding: 8px 12px;
    cursor: pointer;
    transition: all 0.3s;
    border-radius: 4px;
    margin: 0 4px;

    &:hover {
      background-color: var(--primary-light);
    }

    &.is-active {
      background-color: var(--primary-light);
      color: var(--primary-color);
      font-weight: 500;
    }
  }
}
</style>
