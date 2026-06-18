/**
 * API 模拟层
 * 实际使用时替换为真实的后端API调用
 */

/**
 * 模拟AI分析结果
 */
export function mockAnalyzeSpeech(text, audioDuration) {
  // 模拟延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      const wordCount = text.replace(/[\s\n]/g, '').length
      const fillerWords = (text.match(/嗯|啊|然后|就是|那个/g) || []).length
      const hasStructure = text.includes('首先') || text.includes('第一') || text.includes('总之') || text.includes('综上所述')
      
      // 生成模拟评分
      const logicScore = hasStructure ? 75 + Math.random() * 20 : 50 + Math.random() * 25
      const fluencyScore = 60 + Math.random() * 35
      const fillerScore = Math.max(0, 100 - fillerWords * 15 + Math.random() * 10)
      const toneScore = 65 + Math.random() * 30
      const appealScore = 60 + Math.random() * 35
      const durationScore = audioDuration > 10 && audioDuration < 120 ? 70 + Math.random() * 25 : 50 + Math.random() * 20
      
      const scores = {
        logic: Math.round(logicScore),
        fluency: Math.round(fluencyScore),
        filler: Math.round(Math.max(0, Math.min(100, fillerScore))),
        tone: Math.round(toneScore),
        appeal: Math.round(appealScore),
        duration: Math.round(durationScore)
      }
      
      const totalScore = Math.round(
        scores.logic * 0.3 +
        scores.fluency * 0.2 +
        scores.filler * 0.15 +
        scores.tone * 0.15 +
        scores.appeal * 0.1 +
        scores.duration * 0.1
      )
      
      // 生成评语
      const encouragements = [
        '整体表现不错，继续保持！',
        '你的表达越来越流畅了，加油！',
        '很有进步，继续训练！',
        '今天的状态很好，保持这种节奏！',
        '逻辑清晰，表达自然，做得好！'
      ]
      
      const improvements = []
      if (scores.filler < 70) improvements.push('减少填充词的使用，尝试用停顿代替')
      if (scores.logic < 70) improvements.push('尝试使用PREP或SCQA等表达框架来组织思路')
      if (scores.fluency < 70) improvements.push('注意语速控制，适当放慢节奏')
      if (scores.tone < 70) improvements.push('增加语音语调的变化，让表达更有感染力')
      if (scores.appeal < 70) improvements.push('多加入一些具体的例子和情感表达')
      if (scores.duration < 70) improvements.push('注意控制表达时长，保持在合理范围内')
      
      if (improvements.length === 0) improvements.push('各方面都很均衡，继续保持！')
      
      resolve({
        scores,
        totalScore,
        encouragement: encouragements[Math.floor(Math.random() * encouragements.length)],
        improvement: improvements[0],
        fillerCount: fillerWords,
        wordCount,
        hasStructure,
        transcribedText: text,
        durationSec: audioDuration || 60
      })
    }, 1500)
  })
}

/**
 * 真实的ASR + AI分析流程（待接入）
 */
export async function analyzeSpeechReal(audioPath, text) {
  // 1. 上传音频到ASR服务
  // const asrResult = await uploadToASR(audioPath)
  
  // 2. 调用大模型进行分析
  // const analysis = await callAIAnalysis(asrResult.text)
  
  // 3. 返回结构化结果
  return mockAnalyzeSpeech(text, 60)
}

/**
 * 生成训练计划
 */
export function generateTrainingPlan(user) {
  const { scenarios, level, streakDays } = user
  const plan = []
  
  // 根据等级确定训练难度
  const difficulty = level <= 3 ? 'basic' : level <= 6 ? 'medium' : 'advanced'
  
  // 根据连续打卡天数确定今日推荐
  if (streakDays >= 7) {
    plan.push({ type: 'challenge', label: '🔥 连续打卡奖励：挑战模式' })
  }
  
  // 根据短板推荐训练
  const records = [] // 从store获取
  if (records.length > 0) {
    const avgFiller = records.reduce((sum, r) => sum + (r.scores?.filler || 0), 0) / records.length
    if (avgFiller < 70) {
      plan.push({ type: 'skill', skillId: 'filler_control', label: '🧹 填充词控制训练' })
    }
  }
  
  // 默认推荐
  if (plan.length === 0) {
    const scene = scenarios[0] || 'work_report'
    plan.push({ type: 'scene', sceneId: scene, label: '📋 场景训练' })
  }
  
  return plan
}

/**
 * 获取每日金句
 */
export function getDailyTip() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return DAILY_TIPS[dayOfYear % DAILY_TIPS.length]
}

import { DAILY_TIPS } from '../data/training.js'
