<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1 class="error-code">404</h1>
      <p class="error-message">抱歉，您访问的页面不存在</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped lang="scss">
.not-found-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.not-found-content {
  text-align: center;
  color: #fff;

  .error-code {
    font-size: 120px;
    font-weight: bold;
    margin: 0;
    line-height: 1;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .error-message {
    font-size: 24px;
    margin: 20px 0 40px;
  }
}
</style>

