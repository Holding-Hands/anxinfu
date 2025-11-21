<template>
  <el-popover placement="bottom" :width="240" trigger="click" popper-class="theme-popover">
    <template #reference>
      <div class="theme-switcher-button" title="一键换肤">
        <el-icon class="theme-icon">
          <component :is="isDark ? Moon : Sunny" />
        </el-icon>
      </div>
    </template>

    <div class="theme-menu">
      <div class="theme-menu-title">主题颜色</div>
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
import { ref, computed, onMounted } from 'vue'
import { useAppStore, type ThemeType } from '@/stores/app'
import { ElMessage } from 'element-plus'
import { Sunny, Moon, Check } from '@element-plus/icons-vue'

const appStore = useAppStore()

// 暗黑模式状态
const isDark = ref(false)

// 主题配置
const themes = [
  {
    value: 'default' as ThemeType,
    label: '默认主题',
    color: '#409eff'
  },
  {
    value: 'dark' as ThemeType,
    label: '暗黑夜',
    color: '#2c2c2c'
  },
  {
    value: 'sky-blue' as ThemeType,
    label: '天空蓝',
    color: '#3a8dff'
  },
  {
    value: 'cyan' as ThemeType,
    label: '青色调',
    color: '#00bcd4'
  },
  {
    value: 'deep-blue' as ThemeType,
    label: '海蓝调',
    color: '#2f54eb'
  },
  {
    value: 'teal' as ThemeType,
    label: '青绿调',
    color: '#0aa679'
  },
  {
    value: 'purple' as ThemeType,
    label: '现代紫',
    color: '#7c4dff'
  },
  {
    value: 'orange' as ThemeType,
    label: '活力橙',
    color: '#fa8c16'
  },
  {
    value: 'red' as ThemeType,
    label: '深红调',
    color: '#cf1322'
  },
  {
    value: 'emerald' as ThemeType,
    label: '祖母绿',
    color: '#13a67b'
  },
  {
    value: 'pink' as ThemeType,
    label: '浪漫粉',
    color: '#eb2f96'
  },
  {
    value: 'light-green' as ThemeType,
    label: '浅绿调',
    color: '#52c41a'
  },
  {
    value: 'light-blue' as ThemeType,
    label: '淡蓝调',
    color: '#1890ff'
  },
  {
    value: 'ink-blue' as ThemeType,
    label: '墨蓝调',
    color: '#1d39c4'
  },
  {
    value: 'tech-silver' as ThemeType,
    label: '科技银',
    color: '#8c8c8c'
  }
]

// 当前主题
const currentTheme = computed(() => appStore.theme)

// 初始化暗黑模式状态
onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
})

// 切换主题
const handleThemeChange = (theme: ThemeType) => {
  if (theme === currentTheme.value) return

  // 如果选择暗黑模式
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme-mode', 'dark')
    isDark.value = true
  } else {
    // 其他主题（包括默认主题）都移除 dark 类
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme-mode', 'light')
    isDark.value = false
  }

  // 通过 store 设置主题（会自动调用 loadTheme）
  appStore.setTheme(theme)

  const themeLabel = themes.find((t) => t.value === theme)?.label || '主题'
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
  background: linear-gradient(
    135deg,
    var(--el-color-primary) 0%,
    var(--el-color-primary-dark-2) 100%
  );
  box-shadow: 0 2px 12px var(--el-color-primary-light-3);

  &:hover {
    transform: scale(1.15) rotate(20deg);
    box-shadow: 0 4px 16px var(--el-color-primary);
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
