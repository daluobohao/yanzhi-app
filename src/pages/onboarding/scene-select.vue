<template>
  <view class="page-scene-select">
    <view class="header">
      <text class="step-indicator">步骤 1/4</text>
      <text class="title">选择你的主要训练场景</text>
      <text class="subtitle">可以多选，我们会根据你的选择定制训练内容</text>
    </view>
    
    <view class="scene-grid">
      <view 
        v-for="scene in scenes" 
        :key="scene.id"
        class="scene-card"
        :class="{ selected: selected.includes(scene.id) }"
        @click="toggleScene(scene.id)"
      >
        <text class="scene-icon">{{ scene.icon }}</text>
        <text class="scene-name">{{ scene.name }}</text>
        <text class="scene-desc">{{ scene.desc }}</text>
        <view class="check-icon" v-if="selected.includes(scene.id)">✓</view>
      </view>
    </view>
    
    <view class="actions">
      <button class="btn-prev" @click="goBack">上一步</button>
      <button class="btn-next" @click="nextStep" :disabled="selected.length === 0">下一步</button>
    </view>
  </view>
</template>

<script>
import { updateUser } from '@/utils/userStore'
import { SCENES } from '@/data/training'

export default {
  data() {
    return {
      scenes: SCENES,
      selected: []
    }
  },
  methods: {
    toggleScene(id) {
      const idx = this.selected.indexOf(id)
      if (idx >= 0) {
        this.selected.splice(idx, 1)
      } else {
        this.selected.push(id)
      }
    },
    nextStep() {
      updateUser({ scenarios: this.selected })
      uni.navigateTo({ url: '/pages/onboarding/self-assess' })
    },
    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss" scoped>
.page-scene-select {
  min-height: 100vh;
  background: #FFF8F0;
  padding: 40rpx 30rpx;
}

.header {
  text-align: center;
  margin-bottom: 40rpx;
  
  .step-indicator {
    display: block;
    font-size: 24rpx;
    color: #FF8C42;
    margin-bottom: 16rpx;
  }
  
  .title {
    display: block;
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 12rpx;
  }
  
  .subtitle {
    display: block;
    font-size: 26rpx;
    color: #999;
  }
}

.scene-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
  margin-bottom: 60rpx;
}

.scene-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx 20rpx;
  text-align: center;
  border: 3rpx solid transparent;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  position: relative;
  transition: all 0.2s;
  
  &.selected {
    border-color: #FF8C42;
    background: #FFF5EC;
  }
  
  .scene-icon {
    font-size: 48rpx;
    display: block;
    margin-bottom: 12rpx;
  }
  
  .scene-name {
    display: block;
    font-size: 28rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 8rpx;
  }
  
  .scene-desc {
    display: block;
    font-size: 22rpx;
    color: #999;
    line-height: 1.4;
  }
  
  .check-icon {
    position: absolute;
    top: 10rpx;
    right: 10rpx;
    width: 36rpx;
    height: 36rpx;
    background: #FF8C42;
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
  }
}

.actions {
  display: flex;
  gap: 20rpx;
  padding-bottom: 40rpx;
  
  .btn-prev, .btn-next {
    flex: 1;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    border-radius: 44rpx;
    font-size: 30rpx;
    border: none;
  }
  
  .btn-prev {
    background: #f0f0f0;
    color: #666;
    
    &::after { border: none; }
  }
  
  .btn-next {
    background: linear-gradient(135deg, #FF8C42, #FFB07A);
    color: #fff;
    font-weight: 500;
    
    &::after { border: none; }
    
    &[disabled] {
      opacity: 0.5;
    }
  }
}
</style>
