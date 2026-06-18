<template>
  <view class="page-time-select">
    <view class="header">
      <text class="step-indicator">步骤 3/4</text>
      <text class="title">选择每日训练时间</text>
    </view>
    
    <view class="options">
      <view 
        v-for="opt in options" 
        :key="opt.value"
        class="option-card"
        :class="{ active: selected === opt.value }"
        @click="selected = opt.value"
      >
        <text class="option-icon">{{ opt.icon }}</text>
        <text class="option-title">{{ opt.title }}</text>
        <text class="option-desc">{{ opt.desc }}</text>
      </view>
    </view>
    
    <button class="btn-continue" @click="nextStep">继续</button>
  </view>
</template>

<script>
import { updateUser } from '@/utils/userStore'

export default {
  data() {
    return {
      selected: '10分钟',
      options: [
        { value: '5分钟', icon: '⚡', title: '快速训练', desc: '适合忙碌的工作日' },
        { value: '10分钟', icon: '🎯', title: '标准训练', desc: '推荐的日常训练时长' },
        { value: '15分钟', icon: '🏋️', title: '深度训练', desc: '适合有充裕时间的周末' }
      ]
    }
  },
  methods: {
    nextStep() {
      updateUser({ dailyTime: this.selected })
      uni.navigateTo({ url: '/pages/onboarding/test' })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-time-select {
  min-height: 100vh;
  background: #FFF8F0;
  padding: 40rpx 30rpx;
}

.header {
  text-align: center;
  margin-bottom: 60rpx;
  
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
  }
}

.options {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  margin-bottom: 60rpx;
}

.option-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
  border: 3rpx solid transparent;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  
  &.active {
    border-color: #FF8C42;
    background: #FFF5EC;
  }
  
  .option-icon { font-size: 48rpx; }
  .option-title {
    display: block;
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
  }
  .option-desc {
    display: block;
    font-size: 24rpx;
    color: #999;
    margin-top: 4rpx;
  }
}

.btn-continue {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  background: linear-gradient(135deg, #FF8C42, #FFB07A);
  color: #fff;
  border: none;
  border-radius: 44rpx;
  font-size: 32rpx;
  font-weight: 500;
  
  &::after { border: none; }
}
</style>
