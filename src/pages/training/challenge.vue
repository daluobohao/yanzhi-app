<template>
  <view class="page-challenge">
    <view class="header">
      <text class="title">⚡ 挑战模式</text>
      <text class="subtitle">随机抽题，检验你的临场发挥</text>
    </view>
    
    <view class="challenge-list">
      <view 
        v-for="q in questions" 
        :key="q.id"
        class="challenge-card"
        @click="startChallenge(q)"
      >
        <view class="challenge-top">
          <text class="challenge-topic">{{ q.topic }}</text>
          <text class="challenge-difficulty" :class="'diff-' + q.difficulty">
            {{ '⭐'.repeat(q.difficulty) }}
          </text>
        </view>
        <view class="challenge-meta">
          <text class="meta-item">⏱ {{ q.timeLimit }}秒</text>
          <text class="meta-item">📝 即兴演讲</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { CHALLENGE_QUESTIONS } from '@/data/training'

export default {
  data() {
    return {
      questions: CHALLENGE_QUESTIONS
    }
  },
  methods: {
    startChallenge(question) {
      uni.navigateTo({ 
        url: `/pages/record/index?challenge=${question.id}` 
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-challenge {
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

.challenge-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.challenge-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  
  .challenge-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;
    
    .challenge-topic {
      font-size: 28rpx;
      font-weight: 600;
      color: #333;
      flex: 1;
    }
    
    .challenge-difficulty {
      font-size: 24rpx;
      color: #FF8C42;
    }
  }
  
  .challenge-meta {
    display: flex;
    gap: 24rpx;
    
    .meta-item {
      font-size: 24rpx;
      color: #999;
    }
  }
}
</style>
