<template>
  <view class="page-badges">
    <view class="header">
      <text class="title">🏅 成就徽章</text>
      <text class="subtitle">已获得 {{ unlocked.length }} / {{ badges.length }} 枚</text>
    </view>
    
    <view class="badges-grid">
      <view 
        v-for="badge in badges" 
        :key="badge.id"
        class="badge-card"
        :class="{ unlocked: isUnlocked(badge) }"
      >
        <text class="badge-icon">{{ isUnlocked(badge) ? badge.icon : '🔒' }}</text>
        <text class="badge-name">{{ badge.name }}</text>
        <text class="badge-desc">{{ badge.desc }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getUser } from '@/utils/userStore'
import { BADGES, getUnlockedBadges } from '@/utils/userStore'

export default {
  data() {
    return {
      badges: BADGES,
      unlocked: []
    }
  },
  onShow() {
    this.unlocked = getUnlockedBadges()
  },
  methods: {
    isUnlocked(badge) {
      return this.unlocked.some(b => b.id === badge.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.page-badges {
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

.badges-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 24rpx;
}

.badge-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx 16rpx;
  text-align: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  
  &.unlocked {
    box-shadow: 0 4rpx 20rpx rgba(255, 140, 66, 0.2);
  }
  
  .badge-icon {
    font-size: 56rpx;
    display: block;
    margin-bottom: 12rpx;
  }
  
  .badge-name {
    display: block;
    font-size: 24rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 6rpx;
  }
  
  .badge-desc {
    display: block;
    font-size: 20rpx;
    color: #999;
    line-height: 1.4;
  }
}
</style>
