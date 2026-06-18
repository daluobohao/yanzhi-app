<template>
  <view class="page-tips">
    <view class="header">
      <text class="title">💡 技巧库</text>
      <text class="subtitle">学习表达框架，提升口才水平</text>
    </view>
    
    <view class="tips-grid">
      <view 
        v-for="tip in tips" 
        :key="tip.id"
        class="tip-card"
        @click="goDetail(tip)"
      >
        <text class="tip-icon">📖</text>
        <text class="tip-title">{{ tip.title }}</text>
        <text class="tip-preview">{{ tip.content.split('\n')[0] }}</text>
        <text class="tip-action">查看详情 ›</text>
      </view>
    </view>
  </view>
</template>

<script>
import { DAILY_TIPS } from '@/data/training'

export default {
  data() {
    return {
      tips: DAILY_TIPS
    }
  },
  methods: {
    goDetail(tip) {
      uni.navigateTo({ 
        url: `/pages/tips/detail?id=${tip.id}&title=${encodeURIComponent(tip.title)}` 
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-tips {
  min-height: 100vh;
  background: #FFF8F0;
  padding: 40rpx 30rpx;
}

.header {
  text-align: center;
  margin-bottom: 40rpx;
  
  .title {
    display: block;
    font-size: 40rpx;
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

.tips-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20rpx;
}

.tip-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
  
  &:active { transform: scale(0.98); }
  
  .tip-icon { font-size: 36rpx; margin-right: 16rpx; }
  
  .tip-title {
    display: inline;
    font-size: 28rpx;
    font-weight: 600;
    color: #333;
  }
  
  .tip-preview {
    display: block;
    font-size: 24rpx;
    color: #999;
    margin: 12rpx 0;
    line-height: 1.5;
  }
  
  .tip-action {
    font-size: 24rpx;
    color: #FF8C42;
  }
}
</style>
