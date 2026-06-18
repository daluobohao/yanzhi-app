<template>
  <view class="page-self-assess">
    <view class="header">
      <text class="step-indicator">步骤 2/4</text>
      <text class="title">自评当前口才水平</text>
      <text class="subtitle">选择最符合你当前状态的星级</text>
    </view>
    
    <view class="stars-container">
      <view class="star-row">
        <text 
          v-for="i in 5" 
          :key="i"
          class="star"
          :class="{ active: i <= score }"
          @click="score = i"
        >
          {{ i <= score ? '⭐' : '☆' }}
        </text>
      </view>
      <text class="level-text">{{ levelText }}</text>
    </view>
    
    <view class="time-section">
      <text class="section-title">每日可投入时间</text>
      <view class="time-options">
        <view 
          v-for="opt in timeOptions" 
          :key="opt.value"
          class="time-btn"
          :class="{ active: dailyTime === opt.value }"
          @click="dailyTime = opt.value"
        >
          <text>{{ opt.label }}</text>
        </view>
      </view>
    </view>
    
    <view class="actions">
      <button class="btn-prev" @click="goBack">上一步</button>
      <button class="btn-next" @click="nextStep">进入测评</button>
    </view>
  </view>
</template>

<script>
import { updateUser, getUser } from '@/utils/userStore'

export default {
  data() {
    return {
      score: 3,
      dailyTime: '10分钟',
      timeOptions: [
        { label: '5分钟', value: '5分钟' },
        { label: '10分钟', value: '10分钟' },
        { label: '15分钟+', value: '15分钟+' }
      ]
    }
  },
  computed: {
    levelText() {
      const texts = ['', '入门', '初级', '中级', '高级', '专家']
      return texts[this.score]
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    nextStep() {
      const user = getUser()
      updateUser({ 
        selfScore: this.score,
        dailyTime: this.dailyTime
      })
      uni.navigateTo({ url: '/pages/onboarding/test' })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-self-assess {
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
    margin-bottom: 12rpx;
  }
  
  .subtitle {
    display: block;
    font-size: 26rpx;
    color: #999;
  }
}

.stars-container {
  text-align: center;
  margin-bottom: 60rpx;
  
  .star-row {
    display: flex;
    justify-content: center;
    gap: 16rpx;
    
    .star {
      font-size: 64rpx;
      transition: transform 0.2s;
      
      &:active { transform: scale(1.2); }
    }
  }
  
  .level-text {
    display: block;
    margin-top: 20rpx;
    font-size: 30rpx;
    font-weight: 500;
    color: #FF8C42;
  }
}

.time-section {
  margin-bottom: 60rpx;
  
  .section-title {
    display: block;
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 24rpx;
  }
  
  .time-options {
    display: flex;
    gap: 20rpx;
    
    .time-btn {
      flex: 1;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      background: #fff;
      border-radius: 40rpx;
      border: 3rpx solid #F0E0D0;
      font-size: 28rpx;
      color: #666;
      transition: all 0.2s;
      
      &.active {
        border-color: #FF8C42;
        background: #FFF5EC;
        color: #FF8C42;
        font-weight: 600;
      }
    }
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
  }
}
</style>
