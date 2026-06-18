<template>
  <view class="page-scenes">
    <view class="header">
      <text class="title">场景训练</text>
      <text class="subtitle">选择你想练习的真实场景</text>
    </view>
    
    <view class="scene-grid">
      <view 
        v-for="scene in scenes" 
        :key="scene.id"
        class="scene-card"
        @click="startScene(scene)"
      >
        <view class="scene-icon-wrap" :style="{ background: scene.color + '20' }">
          <text class="scene-icon">{{ scene.icon }}</text>
        </view>
        <text class="scene-name">{{ scene.name }}</text>
        <text class="scene-desc">{{ scene.desc }}</text>
        <view class="scene-questions">
          <text class="q-count">{{ scene.questions.length }} 道题目</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { SCENES } from '@/data/training'

export default {
  data() {
    return {
      scenes: SCENES
    }
  },
  methods: {
    startScene(scene) {
      uni.navigateTo({ url: `/pages/record/index?scene=${scene.id}` })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-scenes {
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

.scene-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;
}

.scene-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx 20rpx;
  text-align: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
  
  &:active { transform: scale(0.97); }
  
  .scene-icon-wrap {
    width: 80rpx;
    height: 80rpx;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16rpx;
    
    .scene-icon { font-size: 40rpx; }
  }
  
  .scene-name {
    display: block;
    font-size: 28rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 8rpx;
  }
  
  .scene-desc {
    display: block;
    font-size: 22rpx;
    color: #999;
    line-height: 1.4;
    margin-bottom: 16rpx;
  }
  
  .scene-questions {
    .q-count {
      font-size: 20rpx;
      color: #FF8C42;
      padding: 4rpx 12rpx;
      background: #FFF0E0;
      border-radius: 12rpx;
    }
  }
}
</style>
