# 全局常量快速参考

## 📦 导入方式

```typescript
// 导入选项数组（用于下拉框）
import {
  USER_LEVEL_OPTIONS,    // 用户等级选项
  USER_TYPE_OPTIONS,     // 用户类别选项
  AUTH_STATUS_OPTIONS,   // 实名状态选项
  TEAM_OPTIONS          // 所属团队选项
} from '@/constants'

// 导入映射对象（用于显示文本）
import {
  USER_LEVEL_MAP,       // 等级映射 { '1': 'V1', '2': 'V2', ... }
  USER_TYPE_MAP,        // 类别映射 { 0: '全部', 1: '代理', 2: '商户' }
  AUTH_STATUS_MAP,      // 状态映射 { 'all': '全部', '0': '未认证', '1': '已实名' }
  TEAM_MAP             // 团队映射 { 0: '全部', 1: '安鑫付' }
} from '@/constants'

// 导入样式映射（用于 Tag 组件）
import { LEVEL_TAG_TYPE_MAP } from '@/constants'
```

## 🎯 常用场景

### 场景1：下拉选择框

```vue
<el-select v-model="level" clearable filterable>
  <el-option
    v-for="item in USER_LEVEL_OPTIONS"
    :key="item.value"
    :label="item.label"
    :value="item.value"
  />
</el-select>
```

### 场景2：表格列显示文本

```vue
<el-table-column label="用户类别">
  <template #default="{ row }">
    {{ USER_TYPE_MAP[row.user_type] }}
  </template>
</el-table-column>
```

### 场景3：标签显示

```vue
<el-tag :type="LEVEL_TAG_TYPE_MAP[level]">
  {{ level }}
</el-tag>
```

## 📊 数据值对照表

### 用户等级 (level)
| 值 | 显示 | Tag类型 |
|---|-----|---------|
| '' | 全部 | - |
| '1' | V1 | info |
| '2' | V2 | - |
| '3' | V3 | success |
| '4' | V4 | warning |
| '5' | V5 | danger |
| '6' | V6 | info |
| '7' | V7 | success |

### 用户类别 (user_type)
| 值 | 显示 |
|---|-----|
| 0 | 全部 |
| 1 | 代理 |
| 2 | 商户 |

### 实名状态 (is_auth)
| 值 | 显示 |
|---|-----|
| 'all' | 全部 |
| '0' | 未认证 |
| '1' | 已实名 |

### 所属团队 (m_id)
| 值 | 显示 |
|---|-----|
| 0 | 全部 |
| 1 | 安鑫付 |

## 💡 最佳实践

✅ **推荐做法：**
```typescript
// 使用全局常量
import { USER_LEVEL_OPTIONS } from '@/constants'
```

❌ **避免做法：**
```typescript
// 不要在组件中重复定义
const levelOptions = [
  { label: 'V1', value: '1' },
  // ...
]
```

## 🔄 更新流程

如需修改或新增选项：

1. 编辑 `src/constants/index.ts`
2. 更新对应的 OPTIONS 和 MAP
3. 所有引用该常量的页面自动生效

## 📝 示例页面

- ✅ `src/views/agent/ListV2.vue` - 完整使用示例
- ✅ `src/views/agent/ListV1.vue` - 简单使用示例


