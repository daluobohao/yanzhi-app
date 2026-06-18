<template>
  <view class="page-tips-detail">
    <view class="detail-header">
      <text class="detail-title">{{ title }}</text>
    </view>
    
    <view class="detail-content">
      <text class="detail-text">{{ tip.content }}</text>
    </view>
    
    <view class="practice-section">
      <text class="practice-title">🎯 实践练习</text>
      <button class="btn-practice" @click="startPractice">开始练习</button>
    </view>
  </view>
</template>

<script>
import { DAILY_TIPS } from '@/data/training'

export default {
  data() {
    return {
      tip: {},
      title: ''
    }
  },
  onLoad(options) {
    const id = parseInt(options.id)
    this.title = decodeURIComponent(options.title || '')
    this.tip = DAILY_TIPS.find(t => t.id === id) || {}
  }
}
</script>

<style lang="scss" scoped>
.page-tips-detail {
  min-height: 100vh;
  background: #FFF8F0;
  padding: 40rpx 30rpx;
}

.detail-header {
  .detail-title {
    display: block;
    font-size: 40rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
}

.detail-content {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 40rpx;
  
  .detail-text {
    font-size: 28rpx;
    color: #333;
    line-height: 2;
    white-space: pre-wrap;
  }
}

.practice-section {
  .practice-title {
    display: block;
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
  
  .btn-practice {
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background: linear-gradient(135deg, #FF8C42, #FFB07A);
    color: #fff;
    border: none;
    border-radius: 40rpx;
    font-size: 30rpx;
    
    &::after { border: none; }
  }
}
</style>
