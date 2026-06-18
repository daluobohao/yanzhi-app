<template>
  <view class="page-record">
    <!-- 题目展示 -->
    <view class="question-display">
      <text class="q-scene">{{ sceneName }}</text>
      <text class="q-prompt">{{ currentQuestion }}</text>
      
      <!-- 准备倒计时 -->
      <view class="prep-section" v-if="!recording && !analyzing">
        <view class="prep-circle" :class="{ active: prepTime > 0 }">
          <text class="prep-number">{{ prepTime }}</text>
          <text class="prep-label">秒准备时间</text>
        </view>
        <button class="btn-skip" @click="skipPrep">跳过准备</button>
      </view>
    </view>
    
    <!-- 录制区域 -->
    <view class="record-area" v-if="recording">
      <view class="wave-visual">
        <view class="wave-ring" :class="{ pulse: recording }"></view>
        <view class="wave-ring wave-ring-inner" :class="{ pulse: recording }"></view>
        <button class="btn-mic" @click="stopRecording">
          <text class="mic-icon">🎤</text>
        </button>
      </view>
      <text class="record-timer">{{ formatTime(elapsed) }}</text>
      <text class="record-tip">正在录音，请开始说话...</text>
    </view>
    
    <!-- 分析中 -->
    <view class="analyzing-area" v-if="analyzing">
      <text class="loading-emoji">🔄</text>
      <text class="loading-text">AI 正在分析你的表现...</text>
      <view class="loading-steps">
        <text class="step" :class="{ done: step >= 1 }">✓ 语音识别</text>
        <text class="step" :class="{ done: step >= 2 }">○ 文本分析</text>
        <text class="step" :class="{ done: step >= 3 }">○ 评分生成</text>
      </view>
    </view>
    
    <!-- 底部导航 -->
    <view class="bottom-nav">
      <button class="btn-back" @click="goBack">← 返回</button>
      <button class="btn-retry" @click="retry" v-if="result">再来一次</button>
    </view>
  </view>
</template>

<script>
import { getUser } from '@/utils/userStore'
import { SCENES, CHALLENGE_QUESTIONS } from '@/data/training'
import { mockAnalyzeSpeech } from '@/api/mock'
import { addRecord } from '@/utils/userStore'

export default {
  data() {
    return {
      sceneName: '',
      sceneId: '',
      currentQuestion: '',
      prepTime: 15,
      prepTimer: null,
      recording: false,
      elapsed: 0,
      recordTimer: null,
      analyzing: false,
      step: 0,
      result: null
    }
  },
  onLoad(options) {
    this.sceneId = options.scene || 'work_report'
    this.sceneName = this.getSceneName()
    this.currentQuestion = this.getQuestion()
    this.startPrep()
  },
  onUnload() {
    clearInterval(this.prepTimer)
    clearInterval(this.recordTimer)
  },
  methods: {
    getSceneName() {
      const scene = SCENES.find(s => s.id === this.sceneId)
      return scene ? scene.name : '即兴发言'
    },
    
    getQuestion() {
      const scene = SCENES.find(s => s.id === this.sceneId)
      if (!scene) return '请做一个即兴演讲'
      
      // 随机选题
      const q = scene.questions[Math.floor(Math.random() * scene.questions.length)]
      return q
    },
    
    startPrep() {
      this.prepTime = 15
      this.prepTimer = setInterval(() => {
        this.prepTime--
        if (this.prepTime <= 0) {
          clearInterval(this.prepTimer)
          this.startRecording()
        }
      }, 1000)
    },
    
    skipPrep() {
      clearInterval(this.prepTimer)
      this.startRecording()
    },
    
    startRecording() {
      this.recording = true
      this.elapsed = 0
      
      this.recordTimer = setInterval(() => {
        this.elapsed++
        // 自动停止（最长3分钟）
        if (this.elapsed >= 180) {
          this.stopRecording()
        }
      }, 1000)
    },
    
    stopRecording() {
      clearInterval(this.recordTimer)
      this.recording = false
      this.analyzing = true
      this.runAnalysis()
    },
    
    async runAnalysis() {
      // 模拟分析步骤
      this.step = 1
      await this.sleep(800)
      this.step = 2
      await this.sleep(800)
      this.step = 3
      
      const mockText = '我认为这个方案非常好。首先，它能够有效提升工作效率。其次，它可以降低团队沟通成本。最后，它有利于项目的长期发展。总之，我强烈推荐这个方案。'
      
      this.result = await mockAnalyzeSpeech(mockText, this.elapsed)
      
      // 保存记录
      addRecord(this.result)
      
      this.analyzing = false
    },
    
    goBack() {
      uni.navigateBack()
    },
    
    retry() {
      this.result = null
      this.elapsed = 0
      this.analyzing = false
      this.startPrep()
    },
    
    formatTime(seconds) {
      const m = Math.floor(seconds / 60)
      const s = seconds % 60
      return `${m}:${s.toString().padStart(2, '0')}`
    },
    
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
  }
}
</script>

<style lang="scss" scoped>
.page-record {
  min-height: 100vh;
  background: linear-gradient(180deg, #FF8C42 0%, #FFB07A 40%, #FFF8F0 100%);
  padding: 40rpx 30rpx;
}

.question-display {
  text-align: center;
  margin-bottom: 60rpx;
  
  .q-scene {
    display: inline-block;
    padding: 8rpx 24rpx;
    background: rgba(255, 255, 255, 0.3);
    color: #fff;
    border-radius: 20rpx;
    font-size: 24rpx;
    margin-bottom: 24rpx;
  }
  
  .q-prompt {
    display: block;
    font-size: 34rpx;
    font-weight: 500;
    color: #fff;
    line-height: 1.6;
    margin-bottom: 40rpx;
  }
}

.prep-section {
  text-align: center;
  
  .prep-circle {
    width: 200rpx;
    height: 200rpx;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto 30rpx;
    
    &.active {
      animation: breathe 1s ease-in-out infinite;
    }
    
    .prep-number {
      font-size: 72rpx;
      font-weight: bold;
      color: #fff;
    }
    
    .prep-label {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.8);
    }
  }
  
  .btn-skip {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    border: 2rpx solid rgba(255, 255, 255, 0.5);
    border-radius: 40rpx;
    padding: 16rpx 48rpx;
    font-size: 26rpx;
    
    &::after { border: none; }
  }
}

@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.record-area {
  text-align: center;
  
  .wave-visual {
    position: relative;
    width: 300rpx;
    height: 300rpx;
    margin: 0 auto 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .wave-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 4rpx solid rgba(255, 140, 66, 0.3);
      
      &.pulse {
        animation: ringPulse 1.5s ease-out infinite;
      }
      
      &.wave-ring-inner {
        width: 70%;
        height: 70%;
        animation-delay: 0.5s !important;
      }
    }
    
    .btn-mic {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      background: #FF8C42;
      border: none;
      
      .mic-icon {
        font-size: 48rpx;
      }
      
      &::after { border: none; }
    }
  }
  
  .record-timer {
    display: block;
    font-size: 56rpx;
    font-weight: bold;
    color: #fff;
    margin-bottom: 10rpx;
  }
  
  .record-tip {
    display: block;
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.8);
  }
}

@keyframes ringPulse {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}

.analyzing-area {
  text-align: center;
  padding: 100rpx 0;
  
  .loading-emoji {
    font-size: 80rpx;
    display: block;
    animation: spin 1s linear infinite;
  }
  
  .loading-text {
    display: block;
    font-size: 28rpx;
    color: #fff;
    margin-top: 20rpx;
    margin-bottom: 40rpx;
  }
  
  .loading-steps {
    .step {
      display: block;
      font-size: 26rpx;
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 16rpx;
      
      &.done {
        color: #fff;
      }
    }
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 20rpx;
  padding: 20rpx 30rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: rgba(255, 248, 240, 0.95);
  
  .btn-back, .btn-retry {
    flex: 1;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    border-radius: 40rpx;
    border: none;
    font-size: 28rpx;
  }
  
  .btn-back {
    background: #f0f0f0;
    color: #666;
    &::after { border: none; }
  }
  
  .btn-retry {
    background: #fff;
    color: #FF8C42;
    border: 2rpx solid #FF8C42;
    &::after { border: none; }
  }
}
</style>
