<template>
  <view class="page-plan">
    <view class="header">
      <text class="title">📋 训练计划</text>
      <text class="subtitle">个性化自适应训练方案</text>
    </view>
    
    <!-- 计划概览 -->
    <view class="plan-overview">
      <view class="overview-item">
        <text class="overview-num">{{ plan.days }}</text>
        <text class="overview-label">训练天数</text>
      </view>
      <view class="overview-item">
        <text class="overview-num">{{ plan.completed }}</text>
        <text class="overview-label">已完成</text>
      </view>
      <view class="overview-item">
        <text class="overview-num">{{ plan.remaining }}</text>
        <text class="overview-label">剩余任务</text>
      </view>
    </view>
    
    <!-- 计划进度条 -->
    <view class="plan-progress">
      <view class="progress-bar">
        <view class="progress-fill" :style="{ width: planPercent + '%' }"></view>
      </view>
      <text class="progress-text">完成度：{{ planPercent }}%</text>
    </view>
    
    <!-- 每日任务 -->
    <view class="tasks-list">
      <view 
        class="task-item" 
        v-for="(task, i) in tasks" 
        :key="i"
        :class="{ done: task.done }"
      >
        <view class="task-left">
          <text class="task-day">Day {{ i + 1 }}</text>
          <text class="task-scene">{{ task.scene }}</text>
          <text class="task-topic">{{ task.topic }}</text>
          <text class="task-duration">⏱ {{ task.duration }} 分钟</text>
        </view>
        <text class="task-status">{{ task.done ? '✅' : '○' }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getUser } from '@/utils/userStore'
import { generateTrainingPlan } from '@/api/mock'

export default {
  data() {
    return {
      plan: { days: 7, completed: 0, remaining: 7 },
      tasks: []
    }
  },
  computed: {
    planPercent() {
      return Math.round((this.plan.completed / this.plan.days) * 100)
    }
  },
  onLoad() {
    const user = getUser()
    const plan = generateTrainingPlan(user)
    
    this.plan.completed = user.totalTrainings ? Math.min(user.totalTrainings, 7) : 0
    this.plan.remaining = this.plan.days - this.plan.completed
    
    // 生成7天计划
    this.tasks = [
      { scene: '场景训练', topic: '自我介绍优化', duration: 8, done: true },
      { scene: '技能训练', topic: '填充词控制', duration: 10, done: true },
      { scene: '场景训练', topic: '工作汇报模板', duration: 10, done: true },
      { scene: '技能训练', topic: '逻辑框架PREP', duration: 10, done: false },
      { scene: '场景训练', topic: '面试问答练习', duration: 10, done: false },
      { scene: '技能训练', topic: '语音语调', duration: 10, done: false },
      { scene: '挑战模式', topic: '综合场景模拟', duration: 12, done: false }
    ]
  }
}
</script>

<style lang="scss" scoped>
.page-plan {
  min-height: 100vh;
  background: #FFF8F0;
  padding: 40rpx 30rpx;
}

.header {
  text-align: center;
  margin-bottom: 40rpx;
  
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

.plan-overview {
  display: flex;
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.overview-item {
  flex: 1;
  text-align: center;
  
  .overview-num {
    display: block;
    font-size: 40rpx;
    font-weight: bold;
    color: #FF8C42;
  }
  
  .overview-label {
    display: block;
    font-size: 24rpx;
    color: #999;
    margin-top: 8rpx;
  }
}

.plan-progress {
  margin-bottom: 30rpx;
  
  .progress-bar {
    height: 16rpx;
    background: #F0E0D0;
    border-radius: 8rpx;
    overflow: hidden;
    margin-bottom: 12rpx;
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #FF8C42, #FFB07A);
      border-radius: 8rpx;
      transition: width 0.5s ease;
    }
  }
  
  .progress-text {
    font-size: 24rpx;
    color: #999;
  }
}

.tasks-list {
  .task-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 16rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
    
    &.done {
      opacity: 0.7;
    }
    
    .task-left {
      .task-day {
        display: block;
        font-size: 24rpx;
        color: #FF8C42;
        margin-bottom: 8rpx;
      }
      
      .task-scene {
        display: block;
        font-size: 26rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 4rpx;
      }
      
      .task-topic {
        display: block;
        font-size: 24rpx;
        color: #666;
        margin-bottom: 8rpx;
      }
      
      .task-duration {
        font-size: 22rpx;
        color: #999;
      }
    }
    
    .task-status {
      font-size: 36rpx;
    }
  }
}
</style>
