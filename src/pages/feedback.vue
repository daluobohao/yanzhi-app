<template>
  <view class="page-feedback">
    <!-- 庆祝动画 -->
    <view class="celebration" v-if="showCelebration">
      <text class="celebration-emoji">🎉</text>
      <text class="celebration-text">太棒了！</text>
    </view>
    
    <!-- 总分 -->
    <view class="total-score">
      <text class="score-number">{{ result.totalScore }}</text>
      <text class="score-label">综合评分</text>
    </view>
    
    <!-- 维度评分 -->
    <view class="scores-section">
      <text class="section-title">详细分析</text>
      
      <view class="score-item" v-for="(score, key) in result.scores" :key="key">
        <view class="score-info">
          <text class="score-name">{{ scoreLabels[key] }}</text>
          <text class="score-tip">{{ scoreTips[key] }}</text>
        </view>
        <view class="score-bar">
          <view class="bar-track">
            <view class="bar-fill" :style="{ width: score + '%', background: scoreColor(score) }"></view>
          </view>
          <text class="bar-value">{{ score }}</text>
        </view>
      </view>
    </view>
    
    <!-- AI评语 -->
    <view class="comments-section">
      <text class="section-title">AI 评语</text>
      <view class="comment-card encourage">
        <text class="comment-text">{{ result.encouragement }}</text>
      </view>
      <view class="comment-card improve">
        <text class="comment-text">{{ result.improvement }}</text>
      </view>
    </view>
    
    <!-- 逐句分析 -->
    <view class="text-analysis">
      <text class="section-title">逐句标注</text>
      <view class="transcript">
        <text class="transcript-text">{{ result.transcribedText }}</text>
      </view>
    </view>
    
    <!-- 与上次对比 -->
    <view class="comparison" v-if="lastScore">
      <text class="section-title">与上次对比</text>
      <view class="compare-card" :class="{ up: result.totalScore >= lastScore }">
        <text class="compare-emoji">{{ result.totalScore >= lastScore ? '📈' : '📉' }}</text>
        <text class="compare-text">
          {{ result.totalScore >= lastScore ? '比上次进步了' : '比上次退了 ' }}
          <text class="compare-num">{{ Math.abs(result.totalScore - lastScore) }}</text> 分
        </text>
      </view>
    </view>
    
    <!-- 下次建议 -->
    <view class="next-tip">
      <text class="section-title">🎯 下次训练建议</text>
      <text class="tip-text">针对你的薄弱环节，建议加强{{ nextAdvice }}训练</text>
    </view>
    
    <!-- 操作按钮 -->
    <view class="actions">
      <button class="btn-share" @click="shareResult">📤 分享结果</button>
      <button class="btn-next" @click="goNext">下一题 →</button>
    </view>
  </view>
</template>

<script>
import { getUser } from '@/utils/userStore'
import { getRecentRecords } from '@/utils/userStore'

const SCORE_LABELS = {
  logic: '逻辑结构',
  fluency: '流畅度',
  filler: '填充词',
  tone: '语音语调',
  appeal: '感染力',
  duration: '时长控制'
}

const SCORE_TIPS = {
  logic: '是否有明确的结构框架',
  fluency: '语速稳定性和停顿',
  filler: '"嗯""啊"等出现频率',
  tone: '音量适中和音调变化',
  appeal: '情感丰富度和关键词强调',
  duration: '是否在合理范围内'
}

const NEXT_ADVICE_MAP = {
  logic: '逻辑框架(PREP/SCQA)',
  fluency: '语速控制',
  filler: '填充词控制',
  tone: '语音语调变化',
  appeal: '感染力表达',
  duration: '时长管理'
}

export default {
  data() {
    return {
      result: {},
      lastScore: 0,
      showCelebration: true
    }
  },
  computed: {
    scoreLabels() { return SCORE_LABELS },
    scoreTips() { return SCORE_TIPS },
    nextAdvice() {
      // 找出最低分的维度
      let minKey = 'logic'
      let minScore = 100
      for (const [key, val] of Object.entries(this.result.scores || {})) {
        if (val < minScore) {
          minScore = val
          minKey = key
        }
      }
      return NEXT_ADVICE_MAP[minKey] || '逻辑框架'
    }
  },
  onLoad(options) {
    this.result = JSON.parse(decodeURIComponent(options.result || '{}'))
    const records = getRecentRecords(2)
    if (records.length > 1) {
      this.lastScore = records[1].totalScore || 0
    }
    
    setTimeout(() => {
      this.showCelebration = false
    }, 2000)
  },
  methods: {
    scoreColor(score) {
      if (score >= 80) return '#52C41A'
      if (score >= 60) return '#FAAD14'
      return '#FF4D4F'
    },
    
    shareResult() {
      uni.showToast({ title: '分享功能开发中', icon: 'none' })
    },
    
    goNext() {
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss" scoped>
.page-feedback {
  min-height: 100vh;
  background: #FFF8F0;
  padding: 40rpx 30rpx;
  padding-bottom: 160rpx;
}

.celebration {
  text-align: center;
  padding: 40rpx 0;
  animation: fadeIn 0.5s ease;
  
  .celebration-emoji {
    font-size: 80rpx;
    display: block;
  }
  
  .celebration-text {
    font-size: 40rpx;
    font-weight: bold;
    color: #FF8C42;
  }
}

.total-score {
  text-align: center;
  padding: 40rpx 0;
  
  .score-number {
    display: block;
    font-size: 100rpx;
    font-weight: bold;
    color: #FF8C42;
  }
  
  .score-label {
    display: block;
    font-size: 26rpx;
    color: #999;
  }
}

.section-title {
  display: block;
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.scores-section {
  .score-item {
    margin-bottom: 24rpx;
    
    .score-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8rpx;
      
      .score-name {
        font-size: 26rpx;
        font-weight: 500;
        color: #333;
      }
      
      .score-tip {
        font-size: 22rpx;
        color: #999;
      }
    }
    
    .score-bar {
      display: flex;
      align-items: center;
      gap: 16rpx;
      
      .bar-track {
        flex: 1;
        height: 12rpx;
        background: #F0E0D0;
        border-radius: 6rpx;
        overflow: hidden;
        
        .bar-fill {
          height: 100%;
          border-radius: 6rpx;
          transition: width 0.8s ease;
        }
      }
      
      .bar-value {
        width: 50rpx;
        font-size: 24rpx;
        font-weight: 600;
        text-align: right;
      }
    }
  }
}

.comments-section {
  margin-top: 40rpx;
  
  .comment-card {
    padding: 24rpx;
    border-radius: 16rpx;
    margin-bottom: 16rpx;
    
    &.encourage {
      background: #F0FFF0;
      border-left: 4rpx solid #52C41A;
    }
    
    &.improve {
      background: #FFF7E8;
      border-left: 4rpx solid #FF8C42;
    }
    
    .comment-text {
      font-size: 26rpx;
      color: #333;
      line-height: 1.6;
    }
  }
}

.text-analysis {
  margin-top: 40rpx;
  
  .transcript {
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
    
    .transcript-text {
      font-size: 26rpx;
      color: #666;
      line-height: 1.8;
    }
  }
}

.comparison {
  margin-top: 40rpx;
  
  .compare-card {
    display: flex;
    align-items: center;
    gap: 16rpx;
    padding: 24rpx;
    border-radius: 16rpx;
    background: #fff;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
    
    &.up {
      border-left: 4rpx solid #52C41A;
    }
    
    .compare-emoji { font-size: 40rpx; }
    
    .compare-text {
      font-size: 26rpx;
      color: #666;
      
      .compare-num {
        font-weight: bold;
        color: #FF8C42;
        font-size: 30rpx;
      }
    }
  }
}

.next-tip {
  margin-top: 40rpx;
  padding: 24rpx;
  background: #FFF5EC;
  border-radius: 16rpx;
  
  .tip-text {
    display: block;
    font-size: 26rpx;
    color: #666;
    margin-top: 12rpx;
  }
}

.actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 20rpx;
  padding: 20rpx 30rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.95);
  
  .btn-share, .btn-next {
    flex: 1;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    border-radius: 40rpx;
    font-size: 28rpx;
    border: none;
  }
  
  .btn-share {
    background: #f0f0f0;
    color: #666;
    &::after { border: none; }
  }
  
  .btn-next {
    background: linear-gradient(135deg, #FF8C42, #FFB07A);
    color: #fff;
    font-weight: 500;
    &::after { border: none; }
  }
}
</style>
