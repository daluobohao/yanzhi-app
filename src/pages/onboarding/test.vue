<template>
  <view class="page-test">
    <view class="test-header">
      <text class="step-indicator">入组测评</text>
      <text class="test-title">完成3道模拟训练题</text>
    </view>
    
    <!-- 进度指示器 -->
    <view class="progress-dots">
      <view 
        v-for="i in 3" 
        :key="i"
        class="dot"
        :class="{ current: i === currentQ, done: i < currentQ }"
      ></view>
    </view>
    
    <!-- 题目区域 -->
    <view class="question-area" v-if="currentQuestion">
      <text class="q-label">第 {{ currentQ }} 题</text>
      <text class="q-type">{{ currentQuestion.type }}</text>
      <text class="q-prompt">{{ currentQuestion.prompt }}</text>
      
      <!-- 准备倒计时 -->
      <view class="prep-time" v-if="!started && !finished">
        <text class="prep-label">准备时间</text>
        <text class="prep-countdown">{{ prepTime }}s</text>
        <button class="btn-start-record" @click="startRecording">准备好了，开始！</button>
      </view>
      
      <!-- 录制中 -->
      <view class="recording-area" v-if="started && !finished">
        <view class="wave-animation">
          <view class="wave-bar" v-for="i in 20" :key="i" :style="{ height: waveHeights[i-1] + 'rpx' }"></view>
        </view>
        <text class="timer">{{ formatTime(elapsed) }}</text>
        <text class="recording-tip">正在录音，说完后点击停止</text>
        <button class="btn-stop" @click="stopRecording">停止录音</button>
      </view>
      
      <!-- 分析中 -->
      <view class="analyzing" v-if="finished && !result">
        <text class="loading-icon">🔄</text>
        <text class="loading-text">AI 正在分析你的表现...</text>
      </view>
      
      <!-- 结果 -->
      <view class="result-area" v-if="result">
        <text class="result-score">{{ result.totalScore }}</text>
        <text class="result-label">综合评分</text>
        
        <view class="result-bars">
          <view class="result-bar" v-for="(score, key) in result.scores" :key="key">
            <text class="bar-label">{{ scoreLabels[key] }}</text>
            <view class="bar-track">
              <view class="bar-fill" :style="{ width: score + '%', background: scoreColor(score) }"></view>
            </view>
            <text class="bar-value">{{ score }}</text>
          </view>
        </view>
        
        <view class="result-comments">
          <text class="comment-encourage">🎉 {{ result.encouragement }}</text>
          <text class="comment-improve">💡 {{ result.improvement }}</text>
        </view>
        
        <button class="btn-next-q" @click="nextQuestion" v-if="currentQ < 3">下一题 →</button>
        <button class="btn-finish" @click="finishTest" v-else">完成测评</button>
      </view>
    </view>
  </view>
</template>

<script>
import { updateUser, getUser } from '@/utils/userStore'
import { mockAnalyzeSpeech } from '@/api/mock'

const QUESTIONS = [
  { type: '自我介绍', prompt: '请做一个30秒的自我介绍', time: 30 },
  { type: '观点表达', prompt: '你认为远程办公利大于弊吗？请发表你的观点（1分钟）', time: 60 },
  { type: '即兴演讲', prompt: '随机抽题：谈谈你对"终身学习"的理解（1分钟）', time: 60 }
]

const SCORE_LABELS = {
  logic: '逻辑结构',
  fluency: '流畅度',
  filler: '填充词',
  tone: '语音语调',
  appeal: '感染力',
  duration: '时长控制'
}

export default {
  data() {
    return {
      questions: QUESTIONS,
      currentQ: 1,
      currentQuestion: null,
      prepTime: 15,
      started: false,
      finished: false,
      elapsed: 0,
      timer: null,
      prepTimer: null,
      waveHeights: Array(20).fill(20),
      result: null
    }
  },
  computed: {
    scoreLabels() { return SCORE_LABELS }
  },
  onLoad() {
    this.currentQuestion = this.questions[0]
    this.startPrepTimer()
  },
  onUnload() {
    clearInterval(this.timer)
    clearInterval(this.prepTimer)
  },
  methods: {
    startPrepTimer() {
      this.prepTime = 15
      this.prepTimer = setInterval(() => {
        this.prepTime--
        if (this.prepTime <= 0) {
          clearInterval(this.prepTimer)
        }
      }, 1000)
    },
    
    startRecording() {
      clearInterval(this.prepTimer)
      this.started = true
      this.elapsed = 0
      this.waveHeights = Array(20).fill(0).map(() => 20 + Math.random() * 60)
      
      this.timer = setInterval(() => {
        this.elapsed++
        // 模拟波形动画
        this.waveHeights = this.waveHeights.map(() => 20 + Math.random() * 60)
        
        if (this.elapsed >= this.currentQuestion.time) {
          this.stopRecording()
        }
      }, 1000)
    },
    
    stopRecording() {
      clearInterval(this.timer)
      this.finished = true
      this.analyzeSpeech()
    },
    
    async analyzeSpeech() {
      // 模拟录音文本
      const mockText = '我认为远程办公利大于弊。首先，它可以节省通勤时间。其次，员工可以更灵活地安排工作。最后，公司可以减少办公成本。总之，远程办公是一种高效的办公方式。'
      
      this.result = await mockAnalyzeSpeech(mockText, this.elapsed)
    },
    
    nextQuestion() {
      this.currentQ++
      this.currentQuestion = this.questions[this.currentQ - 1]
      this.result = null
      this.finished = false
      this.started = false
      this.startPrepTimer()
    },
    
    finishTest() {
      // 保存测评结果，标记为已完成
      const user = getUser()
      updateUser({
        ...user,
        isFirstLogin: false,
        testCompleted: true
      })
      uni.showToast({ title: '测评完成！', icon: 'success' })
      setTimeout(() => {
        uni.switchTab({ url: '/pages/index/index' })
      }, 1500)
    },
    
    formatTime(seconds) {
      const m = Math.floor(seconds / 60)
      const s = seconds % 60
      return `${m}:${s.toString().padStart(2, '0')}`
    },
    
    scoreColor(score) {
      if (score >= 80) return '#52C41A'
      if (score >= 60) return '#FAAD14'
      return '#FF4D4F'
    }
  }
}
</script>

<style lang="scss" scoped>
.page-test {
  min-height: 100vh;
  background: #FFF8F0;
  padding: 40rpx 30rpx;
}

.test-header {
  text-align: center;
  margin-bottom: 20rpx;
  
  .step-indicator {
    display: block;
    font-size: 24rpx;
    color: #FF8C42;
    margin-bottom: 16rpx;
  }
  
  .test-title {
    display: block;
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }
}

.progress-dots {
  display: flex;
  justify-content: center;
  gap: 20rpx;
  margin-bottom: 40rpx;
  
  .dot {
    width: 24rpx;
    height: 24rpx;
    border-radius: 50%;
    background: #F0E0D0;
    
    &.current { background: #FF8C42; transform: scale(1.3); }
    &.done { background: #52C41A; }
  }
}

.question-area {
  .q-label {
    display: block;
    font-size: 24rpx;
    color: #999;
    margin-bottom: 8rpx;
  }
  
  .q-type {
    display: inline-block;
    padding: 6rpx 20rpx;
    background: #FFF0E0;
    color: #FF8C42;
    border-radius: 20rpx;
    font-size: 24rpx;
    margin-bottom: 20rpx;
  }
  
  .q-prompt {
    display: block;
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
    line-height: 1.6;
    margin-bottom: 40rpx;
  }
}

.prep-time {
  text-align: center;
  margin-bottom: 40rpx;
  
  .prep-label {
    display: block;
    font-size: 26rpx;
    color: #999;
    margin-bottom: 10rpx;
  }
  
  .prep-countdown {
    display: block;
    font-size: 64rpx;
    font-weight: bold;
    color: #FF8C42;
    margin-bottom: 30rpx;
  }
  
  .btn-start-record {
    width: 80%;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background: linear-gradient(135deg, #FF8C42, #FFB07A);
    color: #fff;
    border: none;
    border-radius: 40rpx;
    font-size: 30rpx;
    
    &::after { border: none; }
  }
}

.recording-area {
  text-align: center;
  
  .wave-animation {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 4rpx;
    height: 120rpx;
    margin-bottom: 30rpx;
    
    .wave-bar {
      width: 8rpx;
      background: #FF8C42;
      border-radius: 4rpx;
      transition: height 0.15s ease;
    }
  }
  
  .timer {
    display: block;
    font-size: 48rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 10rpx;
  }
  
  .recording-tip {
    display: block;
    font-size: 24rpx;
    color: #999;
    margin-bottom: 30rpx;
  }
  
  .btn-stop {
    width: 80%;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background: #FF4D4F;
    color: #fff;
    border: none;
    border-radius: 40rpx;
    font-size: 30rpx;
    
    &::after { border: none; }
  }
}

.analyzing {
  text-align: center;
  padding: 80rpx 0;
  
  .loading-icon {
    font-size: 64rpx;
    display: block;
    animation: spin 1s linear infinite;
  }
  
  .loading-text {
    display: block;
    font-size: 28rpx;
    color: #999;
    margin-top: 20rpx;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.result-area {
  text-align: center;
  
  .result-score {
    display: block;
    font-size: 80rpx;
    font-weight: bold;
    color: #FF8C42;
  }
  
  .result-label {
    display: block;
    font-size: 26rpx;
    color: #999;
    margin-bottom: 30rpx;
  }
  
  .result-bars {
    text-align: left;
    margin-bottom: 30rpx;
  }
  
  .result-bar {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;
    
    .bar-label {
      width: 120rpx;
      font-size: 24rpx;
      color: #666;
    }
    
    .bar-track {
      flex: 1;
      height: 12rpx;
      background: #F0E0D0;
      border-radius: 6rpx;
      margin: 0 16rpx;
      
      .bar-fill {
        height: 100%;
        border-radius: 6rpx;
        transition: width 0.5s ease;
      }
    }
    
    .bar-value {
      width: 50rpx;
      font-size: 24rpx;
      font-weight: 600;
      text-align: right;
    }
  }
  
  .result-comments {
    margin-bottom: 30rpx;
    
    .comment-encourage {
      display: block;
      font-size: 26rpx;
      color: #52C41A;
      margin-bottom: 12rpx;
    }
    
    .comment-improve {
      display: block;
      font-size: 26rpx;
      color: #FF8C42;
    }
  }
  
  .btn-next-q, .btn-finish {
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background: linear-gradient(135deg, #FF8C42, #FFB07A);
    color: #fff;
    border: none;
    border-radius: 40rpx;
    font-size: 30rpx;
    margin-bottom: 20rpx;
    
    &::after { border: none; }
  }
}
</style>
