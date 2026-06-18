<template>
  <view class="page-radar">
    <view class="header">
      <text class="title">📊 能力雷达图</text>
      <text class="subtitle">你的口才能力多维分析</text>
    </view>
    
    <view class="radar-container">
      <canvas canvas-id="radarChart" id="radarChart" class="radar-canvas" @touchstart="onRadarTouch"></canvas>
    </view>
    
    <view class="scores-detail">
      <view class="score-row" v-for="(score, key) in scores" :key="key">
        <text class="score-name">{{ labels[key] }}</text>
        <view class="score-track">
          <view class="score-fill" :style="{ width: score + '%', background: scoreColor(score) }"></view>
        </view>
        <text class="score-value">{{ score }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getAverageScores } from '@/utils/userStore'

const LABELS = {
  logic: '逻辑结构',
  fluency: '流畅度',
  filler: '填充词控制',
  tone: '语音语调',
  appeal: '感染力',
  duration: '时长控制'
}

export default {
  data() {
    return {
      scores: {},
      labels: LABELS
    }
  },
  onReady() {
    this.scores = getAverageScores()
    this.drawRadarChart()
  },
  methods: {
    drawRadarChart() {
      const ctx = uni.createCanvasContext('radarChart', this)
      
      const centerX = 200
      const centerY = 200
      const radius = 150
      const levels = 5
      
      // 画网格
      for (let i = 1; i <= levels; i++) {
        const r = (radius / levels) * i
        ctx.beginPath()
        ctx.arc(centerX, centerY, r, 0, 2 * Math.PI)
        ctx.setStrokeStyle('#E0E0E0')
        ctx.setLineWidth(1)
        ctx.stroke()
      }
      
      // 画轴线
      const keys = Object.keys(this.scores)
      const values = Object.values(this.scores)
      
      for (let i = 0; i < keys.length; i++) {
        const angle = (Math.PI * 2 / keys.length) * i - Math.PI / 2
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius
        
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(x, y)
        ctx.setStrokeStyle('#E0E0E0')
        ctx.setLineWidth(1)
        ctx.stroke()
        
        // 标签
        const labelX = centerX + Math.cos(angle) * (radius + 30)
        const labelY = centerY + Math.sin(angle) * (radius + 30)
        ctx.setFillStyle('#666')
        ctx.setFontSize(22)
        ctx.setTextAlign('center')
        ctx.fillText(this.labels[keys[i]], labelX, labelY + 7)
      }
      
      // 画数据
      ctx.beginPath()
      for (let i = 0; i < keys.length; i++) {
        const angle = (Math.PI * 2 / keys.length) * i - Math.PI / 2
        const value = (values[i] || 50) / 100
        const x = centerX + Math.cos(angle) * radius * value
        const y = centerY + Math.sin(angle) * radius * value
        
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.setFillStyle('rgba(255, 140, 66, 0.3)')
      ctx.fill()
      ctx.setStrokeStyle('#FF8C42')
      ctx.setLineWidth(2)
      ctx.stroke()
      
      // 画数据点
      for (let i = 0; i < keys.length; i++) {
        const angle = (Math.PI * 2 / keys.length) * i - Math.PI / 2
        const value = (values[i] || 50) / 100
        const x = centerX + Math.cos(angle) * radius * value
        const y = centerY + Math.sin(angle) * radius * value
        
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, 2 * Math.PI)
        ctx.setFillStyle('#FF8C42')
        ctx.fill()
      }
      
      ctx.draw()
    },
    
    scoreColor(score) {
      if (score >= 80) return '#52C41A'
      if (score >= 60) return '#FAAD14'
      return '#FF4D4F'
    },
    
    onRadarTouch() {}
  }
}
</script>

<style lang="scss" scoped>
.page-radar {
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

.radar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 40rpx;
  
  .radar-canvas {
    width: 400rpx;
    height: 400rpx;
  }
}

.scores-detail {
  .score-row {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    
    .score-name {
      width: 140rpx;
      font-size: 26rpx;
      color: #666;
    }
    
    .score-track {
      flex: 1;
      height: 12rpx;
      background: #F0E0D0;
      border-radius: 6rpx;
      margin: 0 16rpx;
      
      .score-fill {
        height: 100%;
        border-radius: 6rpx;
        transition: width 0.5s ease;
      }
    }
    
    .score-value {
      width: 50rpx;
      font-size: 24rpx;
      font-weight: 600;
      text-align: right;
    }
  }
}
</style>
