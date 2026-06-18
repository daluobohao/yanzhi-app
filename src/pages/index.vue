<template>
  <view class="page-home">
    <!-- 顶部问候 -->
    <view class="header animate-fade-in">
      <view class="greeting">
        <text class="time-greet">{{ greeting }}</text>
        <text class="user-name">{{ userName }} 👋</text>
      </view>
      <view class="level-badge" @click="goToLevel">
        <text class="level-icon">{{ userBadge }}</text>
        <text class="level-text">Lv.{{ userLevel }}</text>
      </view>
    </view>
    
    <!-- 连续打卡 -->
    <view class="streak-card card animate-slide-up" style="animation-delay: 0.1s">
      <view class="streak-header">
        <text class="streak-fire">🔥</text>
        <text class="streak-text">连续打卡</text>
      </view>
      <text class="streak-number">{{ streakDays }} 天</text>
      <view class="streak-progress">
        <view class="streak-bar">
          <view class="streak-fill" :style="{ width: streakProgress + '%' }"></view>
        </view>
        <text class="streak-tip">再坚持 {{ 7 - (streakDays % 7) }} 天解锁奖励</text>
      </view>
    </view>
    
    <!-- 今日训练卡片 -->
    <view class="today-card card animate-slide-up" style="animation-delay: 0.2s">
      <view class="today-header">
        <text class="today-icon">🎤</text>
        <text class="today-title">今日训练</text>
      </view>
      
      <view class="today-content" v-if="todayTask">
        <text class="today-scene">{{ todayTask.scene }}</text>
        <text class="today-topic">{{ todayTask.topic }}</text>
        <view class="today-meta">
          <text class="meta-tag">{{ todayTask.difficulty }}</text>
          <text class="meta-time">约 {{ todayTask.duration }} 分钟</text>
        </view>
      </view>
      <view class="today-empty" v-else>
        <text>正在为你生成训练计划...</text>
      </view>
      
      <button class="btn-start" @click="startTraining">
        <text>开始训练</text>
      </button>
    </view>
    
    <!-- 训练进度 -->
    <view class="progress-card card animate-slide-up" style="animation-delay: 0.3s">
      <text class="progress-title">本周进度</text>
      <view class="progress-grid">
        <view class="progress-day" v-for="(day, index) in weekData" :key="index"
              :class="{ done: day.done }">
          <text class="day-num">{{ day.num }}</text>
          <text class="day-icon">{{ day.done ? '✅' : '○' }}</text>
        </view>
      </view>
      <text class="progress-summary">已完成 {{ completedDays }}/{{ weekData.length }} 次</text>
    </view>
    
    <!-- 每日技巧 -->
    <view class="tip-card card animate-slide-up" style="animation-delay: 0.4s">
      <view class="tip-header">
        <text class="tip-icon">💡</text>
        <text class="tip-title">每日技巧</text>
      </view>
      <text class="tip-name">{{ dailyTip.title }}</text>
      <text class="tip-content">{{ dailyTip.content.split('\n')[0] }}</text>
      <button class="btn-tip" @click="goToTips">查看更多</button>
    </view>
    
    <!-- 底部导航 -->
    <view class="tab-bar">
      <view class="tab-item tab-active" @click="goHome">
        <text class="tab-icon">🏠</text>
        <text class="tab-label">首页</text>
      </view>
      <view class="tab-item" @click="goTraining">
        <text class="tab-icon">📚</text>
        <text class="tab-label">训练</text>
      </view>
      <view class="tab-item" @click="goProfile">
        <text class="tab-icon">👤</text>
        <text class="tab-label">我的</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getUser } from '@/utils/userStore'
import { getLevelByExp, getCurrentLevelConfig } from '@/utils/levels'
import { getDailyTip } from '@/api/mock'

export default {
  data() {
    return {
      user: {},
      userLevel: 1,
      userBadge: '🌱',
      streakDays: 0,
      streakProgress: 0,
      todayTask: null,
      weekData: [],
      completedDays: 0,
      dailyTip: {}
    }
  },
  computed: {
    greeting() {
      const hour = new Date().getHours()
      if (hour < 6) return '夜深了'
      if (hour < 12) return '早上好'
      if (hour < 14) return '中午好'
      if (hour < 18) return '下午好'
      return '晚上好'
    },
    userName() {
      return this.user.nickname || '同学'
    }
  },
  onLoad() {
    this.loadData()
  },
  onShow() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.user = getUser()
      this.userLevel = this.user.level || 1
      this.streakDays = this.user.streakDays || 0
      
      const levelConfig = getCurrentLevelConfig(this.user.experience || 0)
      if (levelConfig) {
        this.userBadge = levelConfig.badge
        this.streakProgress = ((this.streakDays % 7) / 7) * 100
      }
      
      // 生成周数据
      this.weekData = Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (6 - i))
        return {
          num: d.getDate(),
          done: i < this.completedDays
        }
      })
      
      // 加载每日技巧
      this.dailyTip = getDailyTip()
      
      // 生成今日训练任务
      this.todayTask = this.generateTodayTask()
    },
    
    generateTodayTask() {
      const scenes = ['工作汇报', '面试应答', '即兴发言', '商务谈判', '社交破冰', '公开演讲']
      const scene = this.user.scenarios?.[0] || scenes[Math.floor(Math.random() * scenes.length)]
      const topicMap = {
        '工作汇报': '用PREP框架汇报你的项目进度',
        '面试应答': '请做一个1分钟的自我介绍',
        '即兴发言': '谈谈你对"终身学习"的理解',
        '商务谈判': '向客户推销你的产品',
        '社交破冰': '在聚会上向新朋友做自我介绍',
        '公开演讲': '做一个3分钟的TED风格演讲'
      }
      
      return {
        scene,
        topic: topicMap[scene] || '选择一个你擅长的场景进行训练',
        difficulty: this.userLevel <= 3 ? '⭐ 基础' : this.userLevel <= 6 ? '⭐⭐ 进阶' : '⭐⭐⭐ 高级',
        duration: this.user.dailyTime?.replace('分钟', '') || 10
      }
    },
    
    startTraining() {
      uni.navigateTo({ url: '/pages/record/index' })
    },
    
    goToLevel() {
      uni.navigateTo({ url: '/pages/profile/level' })
    },
    
    goToTips() {
      uni.switchTab({ url: '/pages/tips/index' })
    },
    
    goHome() {
      // 已在首页
    },
    
    goTraining() {
      uni.navigateTo({ url: '/pages/training/scenes' })
    },
    
    goProfile() {
      uni.switchTab({ url: '/pages/profile/index' })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-home {
  min-height: 100vh;
  background: #FFF8F0;
  padding-bottom: 120rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40rpx 30rpx 20rpx;
  
  .greeting {
    .time-greet {
      font-size: 28rpx;
      color: #999;
    }
    .user-name {
      display: block;
      font-size: 40rpx;
      font-weight: bold;
      color: #333;
    }
  }
  
  .level-badge {
    display: flex;
    align-items: center;
    gap: 8rpx;
    padding: 12rpx 24rpx;
    background: linear-gradient(135deg, #FF8C42, #FFB07A);
    border-radius: 40rpx;
    
    .level-icon {
      font-size: 28rpx;
    }
    .level-text {
      font-size: 26rpx;
      color: #fff;
      font-weight: 600;
    }
  }
}

.card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin: 20rpx 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.streak-card {
  text-align: center;
  
  .streak-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
    
    .streak-fire { font-size: 36rpx; }
    .streak-text { font-size: 30rpx; font-weight: 600; color: #333; }
  }
  
  .streak-number {
    display: block;
    font-size: 64rpx;
    font-weight: bold;
    color: #FF8C42;
    margin: 10rpx 0;
  }
  
  .streak-progress {
    margin-top: 20rpx;
    
    .streak-bar {
      height: 12rpx;
      background: #FFE0CC;
      border-radius: 6rpx;
      overflow: hidden;
      
      .streak-fill {
        height: 100%;
        background: linear-gradient(90deg, #FF8C42, #FFB07A);
        border-radius: 6rpx;
      }
    }
    
    .streak-tip {
      display: block;
      font-size: 24rpx;
      color: #999;
      margin-top: 10rpx;
    }
  }
}

.today-card {
  .today-header {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin-bottom: 24rpx;
    
    .today-icon { font-size: 36rpx; }
    .today-title { font-size: 32rpx; font-weight: bold; color: #333; }
  }
  
  .today-content {
    .today-scene {
      display: inline-block;
      padding: 8rpx 20rpx;
      background: #FFF0E0;
      color: #FF8C42;
      border-radius: 20rpx;
      font-size: 24rpx;
      margin-bottom: 16rpx;
    }
    
    .today-topic {
      display: block;
      font-size: 30rpx;
      font-weight: 500;
      color: #333;
      margin-bottom: 20rpx;
      line-height: 1.5;
    }
    
    .today-meta {
      display: flex;
      gap: 16rpx;
      margin-bottom: 30rpx;
      
      .meta-tag {
        padding: 6rpx 16rpx;
        background: #E8F5E9;
        color: #4CAF50;
        border-radius: 16rpx;
        font-size: 22rpx;
      }
      
      .meta-time {
        padding: 6rpx 16rpx;
        background: #F3E5F5;
        color: #9C27B0;
        border-radius: 16rpx;
        font-size: 22rpx;
      }
    }
  }
  
  .today-empty {
    padding: 40rpx 0;
    text-align: center;
    color: #999;
  }
  
  .btn-start {
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
    
    &:active { opacity: 0.85; }
  }
}

.progress-card {
  .progress-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
  
  .progress-grid {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20rpx;
    
    .progress-day {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8rpx;
      padding: 16rpx;
      border-radius: 16rpx;
      
      &.done {
        background: #FFF0E0;
      }
      
      .day-num {
        font-size: 24rpx;
        color: #666;
      }
      
      .day-icon {
        font-size: 32rpx;
      }
    }
  }
  
  .progress-summary {
    text-align: center;
    font-size: 26rpx;
    color: #999;
  }
}

.tip-card {
  .tip-header {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin-bottom: 16rpx;
    
    .tip-icon { font-size: 32rpx; }
    .tip-title { font-size: 30rpx; font-weight: bold; color: #333; }
  }
  
  .tip-name {
    display: block;
    font-size: 28rpx;
    font-weight: 500;
    color: #FF8C42;
    margin-bottom: 8rpx;
  }
  
  .tip-content {
    display: block;
    font-size: 26rpx;
    color: #666;
    line-height: 1.6;
    margin-bottom: 20rpx;
  }
  
  .btn-tip {
    width: 200rpx;
    height: 64rpx;
    line-height: 64rpx;
    text-align: center;
    background: #FFF0E0;
    color: #FF8C42;
    border: none;
    border-radius: 32rpx;
    font-size: 26rpx;
    
    &::after { border: none; }
  }
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100rpx;
  background: #fff;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
  padding-bottom: env(safe-area-inset-bottom);
  
  .tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4rpx;
    
    &.tab-active {
      .tab-icon { transform: scale(1.2); }
      .tab-label { color: #FF8C42; font-weight: 600; }
    }
    
    .tab-icon { font-size: 40rpx; transition: transform 0.2s; }
    .tab-label { font-size: 22rpx; color: #999; }
  }
}
</style>
