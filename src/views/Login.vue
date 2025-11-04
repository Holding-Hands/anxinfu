<template>
  <div class="login-container">
    <canvas ref="canvasRef" class="three-canvas"></canvas>

    <div class="login-card">
      <div class="login-header">
        <h1 class="login-title">安心付</h1>
        <p class="login-subtitle">后台管理系统</p>
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
          />
        </el-form-item>

        <el-form-item prop="code">
          <el-input
            v-model="loginForm.code"
            placeholder="请输入验证码"
            size="large"
            :prefix-icon="Key"
            clearable
            maxlength="6"
          />
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="login-button"
            @click="handleLogin"
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
        <p>默认账号: anxinfuapp / anxinfu@321..</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { User, Lock, Key } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import * as THREE from 'three'
import type { LoginForm } from '@/types'

const router = useRouter()
const userStore = useUserStore()

const canvasRef = ref<HTMLCanvasElement>()
const formRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = ref<LoginForm>({
  username: 'anxinfuapp',
  password: 'anxinfu@321..',
  code: '321',
  remember: true
})

const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
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
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
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

  particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(posArray, 3)
  )
  particlesGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colorsArray, 3)
  )

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
    const z = positions[i + 2]

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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.three-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.login-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 420px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  animation: fadeIn 0.6s ease-out;
  z-index: 10;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -40%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 30px;

  .login-title {
    font-size: 36px;
    font-weight: bold;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 10px;
    letter-spacing: 2px;
  }

  .login-subtitle {
    font-size: 14px;
    color: #666;
    letter-spacing: 1px;
  }
}

.login-form {
  .login-button {
    width: 100%;
    margin-top: 10px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 2px;

    &:hover {
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    }
  }
}

.login-footer {
  margin-top: 20px;
  text-align: center;

  p {
    font-size: 12px;
    color: #999;
  }
}

// 响应式
@media (max-width: 768px) {
  .login-card {
    width: 90%;
    padding: 30px 20px;
  }
}
</style>

