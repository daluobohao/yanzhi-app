<template>
  <view class="page-skills">
    <view class="header">
      <text class="title">🎯 技能训练</text>
      <text class="subtitle">专项提升你的表达能力</text>
    </view>
    
    <view class="skills-list">
      <view 
        v-for="skill in skills" 
        :key="skill.id"
        class="skill-card"
        @click="startSkill(skill)"
      >
        <view class="skill-icon-wrap" :style="{ background: skill.color + '20' }">
          <text class="skill-icon">{{ skill.icon }}</text>
        </view>
        <view class="skill-info">
          <text class="skill-name">{{ skill.name }}</text>
          <text class="skill-desc">{{ skill.desc }}</text>
        </view>
        <text class="skill-arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script>
import { SKILLS } from '@/data/training'

export default {
  data() {
    return {
      skills: SKILLS
    }
  },
  methods: {
    startSkill(skill) {
      uni.navigateTo({ url: `/pages/record/index?skill=${skill.id}` })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-skills {
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

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.skill-card {
  display: flex;
  align-items: center;
  gap: 24rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  
  .skill-icon-wrap {
    width: 80rpx;
    height: 80rpx;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .skill-icon { font-size: 40rpx; }
  }
  
  .skill-info {
    flex: 1;
    
    .skill-name {
      display: block;
      font-size: 28rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 6rpx;
    }
    
    .skill-desc {
      display: block;
      font-size: 24rpx;
      color: #999;
    }
  }
  
  .skill-arrow {
    font-size: 40rpx;
    color: #ccc;
  }
}
</style>
