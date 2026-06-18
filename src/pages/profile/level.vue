<template>
  <view class="page-level">
    <view class="level-header">
      <text class="header-title">口才等级</text>
      <text class="header-desc">从"不敢说"到"说得精彩"，记录你的每一步成长</text>
    </view>
    
    <!-- 当前等级展示 -->
    <view class="current-level-card">
      <view class="level-display">
        <text class="level-emoji">{{ currentLevelConfig.badge }}</text>
        <text class="level-number">Lv.{{ user.level }}</text>
        <text class="level-name">{{ currentLevelConfig.name }}</text>
        <text class="level-desc">{{ currentLevelConfig.description }}</text>
      </view>
      
      <view class="experience-section">
        <view class="exp-bar">
          <view class="exp-fill" :style="{ width: progress + '%' }"></view>
        </view>
        <text class="exp-text">经验值：{{ user.experience }} / {{ nextLevelConfig?.minExp || 'MAX' }}</text>
        <text class="exp-tip" v-if="nextLevelConfig">再积累 {{ expToNext }} 经验可升级到 {{ nextLevelConfig.name }}</text>
        <text class="exp-tip max-level" v-else>🎉 已达到最高等级！</text>
      </view>
    </view>
    
    <!-- 经验值获取规则 -->
    <view class="rules-card">
      <text class="rules-title">💡 经验值获取规则</text>
      
      <view class="rule-item" v-for="rule in rules" :key="rule.action">
        <text class="rule-action">{{ rule.action }}</text>
        <text class="rule-exp">+{{ rule.exp }}</text>
      </view>
    </view>
    
    <!-- 等级总览 -->
    <view class="levels-list">
      <text class="list-title">📊 等级总览</text>
      
      <view 
        class="level-item" 
        v-for="level in levels" 
        :key="level.level"
        :class="{ 
          current: level.level === user.level,
          unlocked: level.level <= user.level,
          locked: level.level > user.level
        }"
      >
        <view class="level-left">
          <text class="level-badge">{{ level.badge }}</text>
          <view class="level-info">
            <text class="level-name">{{ level.name }}</text>
            <text class="level-range">Lv.{{ level.level }} ({{ level.minExp }}-{{ level.maxExp >= 999999 ? '∞' : level.maxExp }})</text>
          </view>
        </view>
        <text class="level-status" v-if="level.level === user.level">🏠 当前</text>
        <text class="level-status unlocked" v-else-if="level.level < user.level">✓ 已解锁</text>
        <text class="level-status locked" v-else>🔒 {{ level.unlocks[0] }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getUser } from '@/utils/userStore'
import { getCurrentLevelConfig, getLevelProgress, getExpToNextLevel, LEVEL_CONFIGS } from '@/utils/levels'

export default {
  data() {
    return {
      user: {},
      rules: [
        { action: '完成一次训练', exp: '5-15 XP', desc: '评分越高经验越多' },
        { action: '评分≥80分', exp: '+5 XP', desc: '优秀表现奖励' },
        { action: '连续打卡7天', exp: '+20 XP', desc: '坚持奖励' },
        { action: '尝试新场景', exp: '+5 XP', desc: '鼓励多样化训练' },
        { action: '填充词<3个', exp: '+3 XP', desc: '精准表达奖励' },
        { action: '升级', exp: '+30 XP', desc: '等级跃迁奖励' },
        { action: '首次完成某框架', exp: '+10 XP', desc: '如首次使用PREP' }
      ]
    }
  },
  computed: {
    levels() { return LEVEL_CONFIGS },
    currentLevelConfig() {
      return getCurrentLevelConfig(this.user.experience || 0)
    },
    nextLevelConfig() {
      if (this.user.level >= 10) return null
      return LEVEL_CONFIGS.find(l => l.level === this.user.level + 1)
    },
    progress() {
      return getLevelProgress(this.user.experience || 0)
    },
    expToNext() {
      return getExpToNextLevel(this.user.experience || 0)
    }
  },
  onShow() {
    this.user = getUser()
  }
}
</script>

<style lang="scss" scoped>
.page-level {
  min-height: 100vh;
  background: #FFF8F0;
  padding: 40rpx 30rpx;
}

.level-header {
  text-align: center;
  margin-bottom: 40rpx;
  
  .header-title {
    display: block;
    font-size: 40rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 12rpx;
  }
  
  .header-desc {
    display: block;
    font-size: 26rpx;
    color: #999;
    line-height: 1.5;
  }
}

.current-level-card {
  background: linear-gradient(135deg, #FF8C42, #FFB07A);
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;
  text-align: center;
  
  .level-display {
    margin-bottom: 30rpx;
    
    .level-emoji {
      font-size: 80rpx;
      display: block;
      margin-bottom: 10rpx;
    }
    
    .level-number {
      display: block;
      font-size: 48rpx;
      font-weight: bold;
      color: #fff;
      margin-bottom: 8rpx;
    }
    
    .level-name {
      display: block;
      font-size: 32rpx;
      color: #fff;
      margin-bottom: 8rpx;
    }
    
    .level-desc {
      display: block;
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.8);
    }
  }
  
  .experience-section {
    .exp-bar {
      height: 20rpx;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 10rpx;
      overflow: hidden;
      margin-bottom: 16rpx;
      
      .exp-fill {
        height: 100%;
        background: #fff;
        border-radius: 10rpx;
        transition: width 0.5s ease;
      }
    }
    
    .exp-text {
      display: block;
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 8rpx;
    }
    
    .exp-tip {
      display: block;
      font-size: 22rpx;
      color: rgba(255, 255, 255, 0.7);
      
      &.max-level {
        font-size: 26rpx;
        color: #fff;
        font-weight: 500;
      }
    }
  }
}

.rules-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  
  .rules-title {
    display: block;
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
  
  .rule-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
    
    &:last-child { border-bottom: none; }
    
    .rule-action {
      font-size: 26rpx;
      color: #666;
    }
    
    .rule-exp {
      font-size: 26rpx;
      font-weight: 600;
      color: #FF8C42;
    }
  }
}

.levels-list {
  .list-title {
    display: block;
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
  
  .level-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx;
    background: #fff;
    border-radius: 16rpx;
    margin-bottom: 12rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
    
    &.current {
      border: 2rpx solid #FF8C42;
      background: #FFF5EC;
    }
    
    &.locked {
      opacity: 0.5;
    }
    
    .level-left {
      display: flex;
      align-items: center;
      gap: 16rpx;
      
      .level-badge { font-size: 36rpx; }
      
      .level-info {
        .level-name {
          display: block;
          font-size: 28rpx;
          font-weight: 600;
          color: #333;
        }
        
        .level-range {
          display: block;
          font-size: 22rpx;
          color: #999;
          margin-top: 4rpx;
        }
      }
    }
    
    .level-status {
      font-size: 24rpx;
      color: #999;
      
      &.unlocked { color: #52C41A; }
      &.locked { color: #ccc; }
    }
  }
}
</style>
