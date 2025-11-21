<template>
  <div class="login-container">
    <canvas ref="canvasRef" class="three-canvas"></canvas>

    <!-- 装饰性背景元素 -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <div class="login-card">
      <!-- Logo 和标题 -->
      <div class="login-header">
        <div class="logo-wrapper">
          <div class="logo-ring"></div>
          <div class="logo-center">
            <svg class="logo-icon" viewBox="0 0 24 24">
              <path
                d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
        <h1 class="login-title">安鑫付</h1>
        <p class="login-subtitle">PAYMENT MANAGEMENT SYSTEM</p>
      </div>

      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入账号"
            size="large"
            :prefix-icon="User"
            clearable
            class="custom-input"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            :prefix-icon="Lock"
            show-password
            clearable
            class="custom-input"
          />
        </el-form-item>

        <!-- 验证码隐藏，默认传123 -->

        <el-form-item>
          <el-checkbox v-model="loginForm.remember" class="remember-checkbox">
            <span class="remember-text">记住密码</span>
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="login-button"
            @click="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登录中...</span>
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 底部装饰线 -->
      <div class="card-footer-line"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import * as THREE from 'three'
import type { LoginForm } from '@/types'

const router = useRouter()
const userStore = useUserStore()

const canvasRef = ref<HTMLCanvasElement>()
const formRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = ref<LoginForm>({
  username: '',
  password: '',
  code: '123',
  remember: true
})

const loginRules: FormRules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

// Three.js 场景
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let particles: THREE.Points
let animationId: number

// 初始化 Three.js 场景
const initThree = () => {
  if (!canvasRef.value) return

  // 创建场景
  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x000000, 0.001)

  // 创建相机
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 5

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
    alpha: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)

  // 创建粒子系统
  const particlesGeometry = new THREE.BufferGeometry()
  const particlesCnt = 5000

  const posArray = new Float32Array(particlesCnt * 3)
  const colorsArray = new Float32Array(particlesCnt * 3)

  for (let i = 0; i < particlesCnt * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100
    // 创建渐变色效果 (蓝色到青色)
    colorsArray[i * 3] = 0.2 + Math.random() * 0.3 // R
    colorsArray[i * 3 + 1] = 0.5 + Math.random() * 0.5 // G
    colorsArray[i * 3 + 2] = 0.8 + Math.random() * 0.2 // B
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3))

  // 粒子材质
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  })

  particles = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particles)

  // 添加光效
  const light1 = new THREE.PointLight(0x00ffff, 2, 100)
  light1.position.set(10, 10, 10)
  scene.add(light1)

  const light2 = new THREE.PointLight(0xff00ff, 2, 100)
  light2.position.set(-10, -10, 10)
  scene.add(light2)

  // 添加环境光
  const ambientLight = new THREE.AmbientLight(0x404040)
  scene.add(ambientLight)

  // 动画
  animate()
}

// 动画函数
const animate = () => {
  animationId = requestAnimationFrame(animate)

  // 旋转粒子
  particles.rotation.x += 0.0005
  particles.rotation.y += 0.001

  // 波动效果
  const positions = particles.geometry.attributes.position.array as Float32Array
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i]
    const y = positions[i + 1]

    positions[i + 1] = y + Math.sin(Date.now() * 0.001 + x) * 0.002
  }
  particles.geometry.attributes.position.needsUpdate = true

  renderer.render(scene, camera)
}

// 处理窗口大小变化
const handleResize = () => {
  if (!camera || !renderer) return

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

// 处理登录
const handleLogin = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await userStore.login(
          loginForm.value.username,
          loginForm.value.password,
          loginForm.value.code
        )
        ElMessage.success('登录成功')
        router.push('/')
      } catch (error: any) {
        ElMessage.error(error.message || '登录失败')
      } finally {
        loading.value = false
      }
    }
  })
}

onMounted(() => {
  initThree()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', handleResize)

  // 清理 Three.js 资源
  if (renderer) {
    renderer.dispose()
  }
  if (particles) {
    particles.geometry.dispose()
    ;(particles.material as THREE.Material).dispose()
  }
})
</script>

<style scoped lang="scss">
.login-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%);
}

.three-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.6;
}

// 背景装饰圆圈
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;

  .circle {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%);
    animation: float 20s ease-in-out infinite;

    &.circle-1 {
      width: 300px;
      height: 300px;
      top: -150px;
      left: -150px;
      animation-delay: 0s;
    }

    &.circle-2 {
      width: 400px;
      height: 400px;
      bottom: -200px;
      right: -200px;
      animation-delay: 7s;
    }

    &.circle-3 {
      width: 250px;
      height: 250px;
      top: 50%;
      right: -125px;
      animation-delay: 14s;
    }
  }
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

// 登录卡片
.login-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 440px;
  padding: 50px 40px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 24px;
  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.4),
    0 0 40px rgba(147, 51, 234, 0.3);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  animation: cardSlideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 10;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #667eea, #764ba2, #f093fb, #4facfe);
    border-radius: 24px;
    z-index: -1;
    animation: borderGlow 3s ease-in-out infinite;
    opacity: 0.3;
  }
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translate(-50%, -45%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes borderGlow {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

// Logo 和标题
.login-header {
  text-align: center;
  margin-bottom: 40px;

  .logo-wrapper {
    position: relative;
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
    animation: logoFloat 3s ease-in-out infinite;

    .logo-ring {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 3px solid transparent;
      border-radius: 50%;
      border-top-color: #667eea;
      border-right-color: #764ba2;
      animation: logoRotate 2s linear infinite;
    }

    .logo-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);

      .logo-icon {
        width: 32px;
        height: 32px;
        color: white;
      }
    }
  }

  .login-title {
    font-size: 32px;
    font-weight: 800;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 8px;
    letter-spacing: 3px;
    animation: titleGlow 2s ease-in-out infinite;
  }

  .login-subtitle {
    font-size: 12px;
    color: #999;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 500;
  }
}

@keyframes logoFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes logoRotate {
  to {
    transform: rotate(360deg);
  }
}

@keyframes titleGlow {
  0%,
  100% {
    filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.3));
  }
  50% {
    filter: drop-shadow(0 0 20px rgba(118, 75, 162, 0.5));
  }
}

// 表单样式
.login-form {
  :deep(.el-form-item) {
    margin-bottom: 24px;
  }

  .custom-input {
    :deep(.el-input__wrapper) {
      box-shadow: 0 0 0 1px rgba(102, 126, 234, 0.2) !important;
      border-radius: 12px;
      transition: all 0.3s ease;
      background: rgba(255, 255, 255, 0.8);

      &:hover {
        box-shadow: 0 0 0 1px rgba(102, 126, 234, 0.4) !important;
      }

      &.is-focus {
        box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.6) !important;
      }
    }
  }

  .remember-checkbox {
    :deep(.el-checkbox__label) {
      color: #666;
      font-size: 14px;
    }

    :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-color: #667eea;
    }
  }

  .login-button {
    width: 100%;
    height: 48px;
    margin-top: 10px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 3px;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s ease;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.5);

      &::before {
        left: 100%;
      }
    }

    &:active {
      transform: translateY(0);
    }
  }
}

// 底部装饰线
.card-footer-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  border-radius: 0 0 24px 24px;
}

// 响应式
@media (max-width: 768px) {
  .login-card {
    width: 90%;
    padding: 40px 30px;
  }

  .login-header {
    .login-title {
      font-size: 28px;
    }
  }
}
</style>
