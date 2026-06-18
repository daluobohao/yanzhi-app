<template>
  <view class="page-profile">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="avatar-section">
        <image class="avatar" src="/static/default-avatar.png" mode="aspectFill"></image>
        <text class="nickname">{{ user.nickname || '同学' }}</text>
        <view class="level-badge" @click="goToLevel">
          <text class="level-icon">{{ userBadge }}</text>
          <text class="level-text">Lv.{{ user.level }}</text>
        </view>
      </view>
      
      <view class="stats-row">
        <view class="stat-item">
          <text class="stat-num">{{ user.totalTrainings || 0 }}</text>
          <text class="stat-label">训练次数</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">{{ user.streakDays || 0 }}</text>
          <text class="stat-label">连续打卡</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">{{ badges.length }}</text>
          <text class="stat-label">获得徽章</text>
        </view>
      </view>
    </view>
    
    <!-- 能力雷达图 -->
    <view class="radar-card card" @click="goToRadar">
      <view class="card-header">
        <text class="card-title">📊 能力雷达图</text>
        <text class="card-arrow">›</text>
      </view>
      <canvas canvas-id="radarChart" id="radarChart" class="radar-canvas"></canvas>
    </view>
    
    <!-- 快捷入口 -->
    <view class="quick-actions">
      <view class="action-item" @click="goToTrends">
        <text class="action-icon">📈</text>
        <text class="action-name">训练趋势</text>
      </view>
      <view class="action-item" @click="goToBadges">
        <text class="action-icon">🏅</text>
        <text class="action-name">成就徽章</text>
      </view>
      <view class="action-item" @click="goToPlan">
        <text class="action-icon">📋</text>
        <text class="action-name">训练计划</text>
      </view>
      <view class="action-item" @click="goToMember">
        <text class="action-icon">👑</text>
        <text class="action-name">会员中心</text>
      </view>
    </view>
    
    <!-- 底部导航 -->
    <view class="tab-bar">
      <view class="tab-item" @click="goHome">
        <text class="tab-icon">🏠</text>
        <text class="tab-label">首页</text>
      </view>
      <view class="tab-item" @click="goTraining">
        <text class="tab-icon">📚</text>
        <text class="tab-label">训练</text>
      </view>
      <view class="tab-item tab-active">
        <text class="tab-icon">👤</text>
        <text class="tab-label">我的</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getUser } from '@/utils/userStore'
import { getUnlockedBadges } from '@/utils/userStore'
import { getCurrentLevelConfig } from '@/utils/levels'

export default {
  data() {
    return {
      user: {},
      userBadge: '🌱',
      badges: []
    }
  },
  onShow() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.user = getUser()
      this.badges = getUnlockedBadges()
      
      const levelConfig = getCurrentLevelConfig(this.user.experience || 0)
      if (levelConfig) {
        this.userBadge = levelConfig.badge
      }
    },
    
    goToLevel() {
      uni.navigateTo({ url: '/pages/profile/level' })
    },
    
    goToRadar() {
      uni.navigateTo({ url: '/pages/profile/radar' })
    },
    
    goToTrends() {
      uni.navigateTo({ url: '/pages/profile/trends' })
    },
    
    goToBadges() {
      uni.navigateTo({ url: '/pages/profile/badges' })
    },
    
    goToPlan() {
      uni.navigateTo({ url: '/pages/profile/plan' })
    },
    
    goToMember() {
      uni.navigateTo({ url: '/pages/member/index' })
    },
    
    goHome() {
      uni.switchTab({ url: '/pages/index/index' })
    },
    
    goTraining() {
      uni.navigateTo({ url: '/pages/training/scenes' })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-profile {
  min-height: 100vh;
  background: #FFF8F0;
  padding-bottom: 120rpx;
}

.user-card {
  background: linear-gradient(135deg, #FF8C42, #FFB07A);
  padding: 60rpx 30rpx 40rpx;
  margin-bottom: 20rpx;
  
  .avatar-section {
    text-align: center;
    margin-bottom: 30rpx;
    
    .avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      border: 4rpx solid rgba(255, 255, 255, 0.5);
      margin-bottom: 16rpx;
    }
    
    .nickname {
      display: block;
      font-size: 36rpx;
      font-weight: bold;
      color: #fff;
      margin-bottom: 16rpx;
    }
    
    .level-badge {
      display: inline-flex;
      align-items: center;
      gap: 8rpx;
      padding: 10rpx 24rpx;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 30rpx;
      
      .level-icon { font-size: 24rpx; }
      .level-text { font-size: 24rpx; color: #fff; font-weight: 600; }
    }
  }
  
  .stats-row {
    display: flex;
    justify-content: space-around;
    
    .stat-item {
      text-align: center;
      
      .stat-num {
        display: block;
        font-size: 40rpx;
        font-weight: bold;
        color: #fff;
      }
      
      .stat-label {
        display: block;
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.8);
        margin-top: 4rpx;
      }
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  
  .card-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
  }
  
  .card-arrow {
    font-size: 36rpx;
    color: #ccc;
  }
}

.radar-canvas {
  width: 100%;
  height: 400rpx;
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
  padding: 0 30rpx;
  margin-top: 20rpx;
}

.action-item {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  text-align: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  
  .action-icon {
    font-size: 48rpx;
    display: block;
    margin-bottom: 12rpx;
  }
  
  .action-name {
    font-size: 26rpx;
    color: #666;
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
