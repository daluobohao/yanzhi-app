<template>
  <view class="page-trends">
    <view class="header">
      <text class="title">📈 训练趋势</text>
      <view class="tab-group">
        <text class="tab" :class="{ active: period === 'week' }" @click="period = 'week'">近7天</text>
        <text class="tab" :class="{ active: period === 'month' }" @click="period = 'month'">近30天</text>
      </view>
    </view>
    
    <!-- 统计卡片 -->
    <view class="stats-row">
      <view class="stat-mini">
        <text class="stat-mini-num">{{ stats.total }}</text>
        <text class="stat-mini-label">总训练</text>
      </view>
      <view class="stat-mini">
        <text class="stat-mini-num">{{ stats.avgScore }}</text>
        <text class="stat-mini-label">平均分</text>
      </view>
      <view class="stat-mini">
        <text class="stat-mini-num">{{ stats.bestScore }}</text>
        <text class="stat-mini-label">最高分</text>
      </view>
      <view class="stat-mini">
        <text class="stat-mini-num">{{ stats.streak }}</text>
        <text class="stat-mini-label">连续打卡</text>
      </view>
    </view>
    
    <!-- 分数趋势图 -->
    <view class="chart-card">
      <text class="chart-title">综合评分趋势</text>
      <view class="chart-container">
        <canvas canvas-id="trendChart" id="trendChart" class="trend-canvas"></canvas>
      </view>
    </view>
    
    <!-- 各维度趋势 -->
    <view class="dimensions-card">
      <text class="chart-title">各维度平均分</text>
      <view class="dim-bars">
        <view class="dim-row" v-for="(score, key) in dimScores" :key="key">
          <text class="dim-name">{{ dimLabels[key] }}</text>
          <view class="dim-track">
            <view class="dim-fill" :style="{ width: score + '%', background: dimColors[key] }"></view>
          </view>
          <text class="dim-value">{{ score }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getRecentRecords, getAverageScores } from '@/utils/userStore'

const DIM_LABELS = {
  logic: '逻辑结构',
  fluency: '流畅度',
  filler: '填充词',
  tone: '语音语调',
  appeal: '感染力',
  duration: '时长控制'
}

const DIM_COLORS = {
  logic: '#FF8C42',
  fluency: '#4A90E2',
  filler: '#E24A4A',
  tone: '#9B59B6',
  appeal: '#2ECC71',
  duration: '#F39C12'
}

export default {
  data() {
    return {
      period: 'week',
      records: [],
      dimScores: {},
      dimLabels: DIM_LABELS,
      dimColors: DIM_COLORS
    }
  },
  computed: {
    stats() {
      if (this.records.length === 0) return { total: 0, avgScore: 0, bestScore: 0, streak: 0 }
      const scores = this.records.map(r => r.totalScore || 0)
      return {
        total: scores.length,
        avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
        bestScore: Math.max(...scores),
        streak: this.records[0]?.streak || 0
      }
    }
  },
  onReady() {
    this.records = getRecentRecords(30)
    this.dimScores = getAverageScores()
    this.drawTrendChart()
  },
  methods: {
    drawTrendChart() {
      if (this.records.length < 2) return
      
      const ctx = uni.createCanvasContext('trendChart', this)
      const w = 600
      const h = 300
      const padding = 40
      const chartW = w - padding * 2
      const chartH = h - padding * 2
      
      // 背景
      ctx.setFillStyle('#FFFFFF')
      ctx.fillRect(0, 0, w, h)
      
      // 获取最近7天分数
      const data = this.records.slice(0, 7).reverse().map(r => r.totalScore || 0)
      if (data.length < 2) return
      
      const maxVal = Math.max(...data, 100)
      const minVal = Math.min(...data, 0)
      const range = maxVal - minVal || 1
      
      // 画网格线
      for (let i = 0; i <= 4; i++) {
        const y = padding + (chartH / 4) * i
        ctx.beginPath()
        ctx.moveTo(padding, y)
        ctx.lineTo(w - padding, y)
        ctx.setStrokeStyle('#F0F0F0')
        ctx.setLineWidth(1)
        ctx.stroke()
      }
      
      // 画折线
      ctx.beginPath()
      for (let i = 0; i < data.length; i++) {
        const x = padding + (chartW / (data.length - 1)) * i
        const y = padding + chartH - ((data[i] - minVal) / range) * chartH
        
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.setStrokeStyle('#FF8C42')
      ctx.setLineWidth(3)
      ctx.stroke()
      
      // 画数据点
      for (let i = 0; i < data.length; i++) {
        const x = padding + (chartW / (data.length - 1)) * i
        const y = padding + chartH - ((data[i] - minVal) / range) * chartH
        
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, 2 * Math.PI)
        ctx.setFillStyle('#FF8C42')
        ctx.fill()
        
        // 数值标签
        ctx.setFillStyle('#333')
        ctx.setFontSize(20)
        ctx.setTextAlign('center')
        ctx.fillText(data[i], x, y - 12)
      }
      
      ctx.draw()
    }
  }
}
</script>

<style lang="scss" scoped>
.page-trends {
  min-height: 100vh;
  background: #FFF8F0;
  padding: 40rpx 30rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
  
  .title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }
  
  .tab-group {
    display: flex;
    gap: 20rpx;
    
    .tab {
      font-size: 26rpx;
      color: #999;
      padding: 8rpx 20rpx;
      border-radius: 20rpx;
      
      &.active {
        background: #FF8C42;
        color: #fff;
      }
    }
  }
}

.stats-row {
  display: flex;
  gap: 16rpx;
  margin-bottom: 30rpx;
}

.stat-mini {
  flex: 1;
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  text-align: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  
  .stat-mini-num {
    display: block;
    font-size: 32rpx;
    font-weight: bold;
    color: #FF8C42;
  }
  
  .stat-mini-label {
    display: block;
    font-size: 22rpx;
    color: #999;
    margin-top: 4rpx;
  }
}

.chart-card, .dimensions-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  
  .chart-title {
    display: block;
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
}

.chart-container {
  .trend-canvas {
    width: 600rpx;
    height: 300rpx;
  }
}

.dim-bars {
  .dim-row {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;
    
    .dim-name {
      width: 120rpx;
      font-size: 24rpx;
      color: #666;
    }
    
    .dim-track {
      flex: 1;
      height: 12rpx;
      background: #F0E0D0;
      border-radius: 6rpx;
      margin: 0 16rpx;
      
      .dim-fill {
        height: 100%;
        border-radius: 6rpx;
      }
    }
    
    .dim-value {
      width: 50rpx;
      font-size: 24rpx;
      font-weight: 600;
      text-align: right;
    }
  }
}
</style>
