# 全局常量使用指南

## 📋 常量列表

### 1. 用户等级 (USER_LEVEL_OPTIONS)

**选项数组：**
```typescript
[
  { label: '全部', value: '' },
  { label: 'V1', value: '1' },
  { label: 'V2', value: '2' },
  // ... V3-V7
]
```

**使用示例：**
```vue
<template>
  <el-select v-model="level">
    <el-option
      v-for="item in USER_LEVEL_OPTIONS"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script setup lang="ts">
import { USER_LEVEL_OPTIONS, USER_LEVEL_MAP } from '@/constants'

const level = ref('1')

// 获取等级显示名称
const levelName = USER_LEVEL_MAP[level.value] // 'V1'
</script>
```

### 2. 用户类别 (USER_TYPE_OPTIONS)

**选项数组：**
```typescript
[
  { label: '全部', value: 0 },
  { label: '代理', value: 1 },
  { label: '商户', value: 2 }
]
```

**使用示例：**
```vue
<template>
  <el-select v-model="userType">
    <el-option
      v-for="item in USER_TYPE_OPTIONS"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script setup lang="ts">
import { USER_TYPE_OPTIONS, USER_TYPE_MAP } from '@/constants'

const userType = ref(1)

// 获取类别名称
const typeName = USER_TYPE_MAP[userType.value] // '代理'
</script>
```

### 3. 实名状态 (AUTH_STATUS_OPTIONS)

**选项数组：**
```typescript
[
  { label: '全部', value: 'all' },
  { label: '未认证', value: '0' },
  { label: '已实名', value: '1' }
]
```

**使用示例：**
```vue
<template>
  <el-select v-model="authStatus">
    <el-option
      v-for="item in AUTH_STATUS_OPTIONS"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>

  <!-- 显示状态标签 -->
  <el-tag :type="authStatus === '1' ? 'success' : 'info'">
    {{ AUTH_STATUS_MAP[authStatus] }}
  </el-tag>
</template>

<script setup lang="ts">
import { AUTH_STATUS_OPTIONS, AUTH_STATUS_MAP } from '@/constants'

const authStatus = ref('1')
</script>
```

### 4. 所属团队 (TEAM_OPTIONS)

**选项数组：**
```typescript
[
  { label: '全部', value: 0 },
  { label: '安鑫付', value: 1 }
]
```

**使用示例：**
```vue
<template>
  <el-select v-model="teamId">
    <el-option
      v-for="item in TEAM_OPTIONS"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script setup lang="ts">
import { TEAM_OPTIONS, TEAM_MAP } from '@/constants'

const teamId = ref(1)
</script>
```

### 5. 等级标签类型 (LEVEL_TAG_TYPE_MAP)

**用于 Element Plus Tag 组件的 type 属性：**
```typescript
{
  V1: 'info',
  V2: '',
  V3: 'success',
  V4: 'warning',
  V5: 'danger',
  V6: 'info',
  V7: 'success'
}
```

**使用示例：**
```vue
<template>
  <el-tag :type="LEVEL_TAG_TYPE_MAP[level]">
    {{ level }}
  </el-tag>
</template>

<script setup lang="ts">
import { LEVEL_TAG_TYPE_MAP } from '@/constants'

const level = ref('V1')
</script>
```

## 🎯 完整示例

### 代理列表筛选表单

```vue
<template>
  <el-form :model="queryParams">
    <!-- 等级 -->
    <el-form-item label="等级">
      <el-select v-model="queryParams.level" clearable filterable>
        <el-option
          v-for="item in USER_LEVEL_OPTIONS"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <!-- 用户类别 -->
    <el-form-item label="用户类别">
      <el-select v-model="queryParams.user_type" clearable filterable>
        <el-option
          v-for="item in USER_TYPE_OPTIONS"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <!-- 实名状态 -->
    <el-form-item label="实名状态">
      <el-select v-model="queryParams.is_auth" clearable filterable>
        <el-option
          v-for="item in AUTH_STATUS_OPTIONS"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <!-- 所属团队 -->
    <el-form-item label="所属团队">
      <el-select v-model="queryParams.m_id" clearable filterable>
        <el-option
          v-for="item in TEAM_OPTIONS"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import {
  USER_LEVEL_OPTIONS,
  USER_TYPE_OPTIONS,
  AUTH_STATUS_OPTIONS,
  TEAM_OPTIONS
} from '@/constants'

const queryParams = reactive({
  level: '',
  user_type: 0,
  is_auth: 'all',
  m_id: 0
})
</script>
```

### 表格列显示

```vue
<template>
  <el-table :data="tableData">
    <!-- 等级列 -->
    <el-table-column label="等级">
      <template #default="{ row }">
        <el-tag :type="LEVEL_TAG_TYPE_MAP[row.level]">
          {{ row.level }}
        </el-tag>
      </template>
    </el-table-column>

    <!-- 用户类别列 -->
    <el-table-column label="类别">
      <template #default="{ row }">
        {{ USER_TYPE_MAP[row.user_type] }}
      </template>
    </el-table-column>

    <!-- 实名状态列 -->
    <el-table-column label="实名状态">
      <template #default="{ row }">
        <el-tag :type="row.is_auth === '1' ? 'success' : 'info'">
          {{ AUTH_STATUS_MAP[row.is_auth] }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  USER_TYPE_MAP,
  AUTH_STATUS_MAP,
  LEVEL_TAG_TYPE_MAP
} from '@/constants'

const tableData = ref([])
</script>
```

## 📌 注意事项

1. **统一使用全局常量** - 避免在各个页面重复定义相同的选项
2. **保持数据一致性** - 所有页面使用相同的值映射
3. **易于维护** - 只需修改 `src/constants/index.ts` 一处即可全局生效
4. **类型安全** - TypeScript 提供完整的类型检查

## 🔧 扩展常量

如需添加新的选项，在 `src/constants/index.ts` 中添加：

```typescript
// 新增状态选项
export const STATUS_OPTIONS = [
  { label: '全部', value: 0 },
  { label: '启用', value: 1 },
  { label: '禁用', value: 2 }
]

export const STATUS_MAP: Record<number, string> = {
  0: '全部',
  1: '启用',
  2: '禁用'
}
```


