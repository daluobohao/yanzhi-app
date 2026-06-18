<template>
  <view class="page-onboarding-intro">
    <view class="intro-container">
      <view class="logo-area">
        <text class="logo">🎙️</text>
        <text class="app-name">言值</text>
        <text class="app-slogan">让每一次开口，都有价值</text>
      </view>
      
      <view class="features">
        <view class="feature-item">
          <text class="feature-icon">🤖</text>
          <text class="feature-text">AI 多维度口才分析</text>
        </view>
        <view class="feature-item">
          <text class="feature-icon">📊</text>
          <text class="feature-text">个性化训练计划</text>
        </view>
        <view class="feature-item">
          <text class="feature-icon">🏆</text>
          <text class="feature-text">游戏化成长体系</text>
        </view>
        <view class="feature-item">
          <text class="feature-icon">🎯</text>
          <text class="feature-text">场景化实战训练</text>
        </view>
      </view>
      
      <button class="btn-begin" @click="startOnboarding">
        开始口才训练之旅
      </button>
      
      <text class="skip-link" @click="skipOnboarding">跳过，直接进入</text>
    </view>
  </view>
</template>

<script>
import { updateUser, getUser } from '@/utils/userStore'

export default {
  data() {
    return {}
  },
  methods: {
    startOnboarding() {
      updateUser({ isFirstLogin: false })
      uni.navigateTo({ url: '/pages/onboarding/scene-select' })
    },
    skipOnboarding() {
      updateUser({ isFirstLogin: false })
      uni.switchTab({ url: '/pages/index/index' })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-onboarding-intro {
  min-height: 100vh;
  background: linear-gradient(180deg, #FF8C42 0%, #FFB07A 50%, #FFF8F0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.intro-container {
  width: 100%;
  padding: 80rpx 40rpx;
  text-align: center;
}

.logo-area {
  margin-bottom: 80rpx;
  
  .logo {
    font-size: 120rpx;
    display: block;
    margin-bottom: 20rpx;
  }
  
  .app-name {
    display: block;
    font-size: 64rpx;
    font-weight: bold;
    color: #fff;
    margin-bottom: 16rpx;
  }
  
  .app-slogan {
    display: block;
    font-size: 30rpx;
    color: rgba(255, 255, 255, 0.9);
  }
}

.features {
  margin-bottom: 80rpx;
  
  .feature-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16rpx;
    padding: 24rpx 0;
    
    .feature-icon { font-size: 36rpx; }
    .feature-text { font-size: 30rpx; color: #fff; }
  }
}

.btn-begin {
  width: 80%;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  background: #fff;
  color: #FF8C42;
  border: none;
  border-radius: 44rpx;
  font-size: 32rpx;
  font-weight: bold;
  
  &::after { border: none; }
}

.skip-link {
  display: block;
  margin-top: 40rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.7);
}
</style>
