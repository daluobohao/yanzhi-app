/**
 * 用户数据管理
 * 本地存储 + 简单状态管理
 */

import { getLevelByExp, getCurrentLevelConfig, getLevelProgress, getExpToNextLevel } from './levels'

const USER_KEY = 'yanzhi_user'
const RECORDS_KEY = 'yanzhi_records'
const BADGES_KEY = 'yanzhi_badges'

/**
 * 获取用户信息
 */
export function getUser() {
  const user = uni.getStorageSync(USER_KEY)
  if (!user) {
    return getDefaultUser()
  }
  return user
}

/**
 * 更新用户信息
 */
export function updateUser(updates) {
  const user = getUser()
  const newUser = { ...user, ...updates }
  uni.setStorageSync(USER_KEY, newUser)
  return newUser
}

/**
 * 增加经验值
 */
export function addExperience(exp) {
  const user = getUser()
  const oldExp = user.experience || 0
  const newExp = oldExp + exp
  const oldLevel = user.level || 1
  
  // 检查是否升级
  const newLevel = getLevelByExp(newExp)
  const leveledUp = newLevel > oldLevel
  
  const updated = updateUser({
    experience: newExp,
    level: newLevel,
    totalTrainings: (user.totalTrainings || 0) + 1
  })
  
  // 更新连续打卡
  updateStreak(updated)
  
  return { 
    user: updated, 
    leveledUp, 
    newExp, 
    oldLevel, 
    newLevel,
    progress: getLevelProgress(newExp),
    expToNext: getExpToNextLevel(newExp)
  }
}

/**
 * 更新连续打卡
 */
function updateStreak(user) {
  const today = new Date().toDateString()
  const lastDate = user.lastTrainDate
  
  if (lastDate) {
    const last = new Date(lastDate)
    const diff = Math.floor((new Date() - last) / (1000 * 60 * 60 * 24))
    
    if (diff === 1) {
      user.streakDays = (user.streakDays || 0) + 1
    } else if (diff > 1) {
      user.streakDays = 1
    }
  } else {
    user.streakDays = 1
  }
  
  user.lastTrainDate = today
  uni.setStorageSync(USER_KEY, user)
}

/**
 * 获取默认用户
 */
function getDefaultUser() {
  return {
    nickname: '',
    avatar: '',
    level: 1,
    experience: 0,
    totalTrainings: 0,
    streakDays: 0,
    lastTrainDate: '',
    scenarios: [],
    dailyTime: '10分钟',
    selfScore: 3,
    isFirstLogin: true,
    createdAt: new Date().toISOString()
  }
}

/**
 * 获取训练记录
 */
export function getRecords() {
  try {
    const records = uni.getStorageSync(RECORDS_KEY)
    return records ? JSON.parse(records) : []
  } catch (e) {
    return []
  }
}

/**
 * 添加训练记录
 */
export function addRecord(record) {
  const records = getRecords()
  record.id = Date.now()
  record.createdAt = new Date().toISOString()
  records.unshift(record)
  
  // 只保留最近100条
  if (records.length > 100) {
    records.pop()
  }
  
  uni.setStorageSync(RECORDS_KEY, JSON.stringify(records))
  
  // 增加经验
  const levelResult = addExperience(record.totalScore || 10)
  
  // 检查徽章
  checkSpecialBadges(record)
  
  return { record, levelResult }
}

/**
 * 获取最近训练记录
 */
export function getRecentRecords(n = 7) {
  const records = getRecords()
  return records.slice(0, n)
}

/**
 * 获取维度平均分数
 */
export function getAverageScores() {
  const records = getRecords()
  if (records.length === 0) {
    return { logic: 0, fluency: 0, filler: 0, tone: 0, appeal: 0, duration: 0 }
  }
  
  const sum = { logic: 0, fluency: 0, filler: 0, tone: 0, appeal: 0, duration: 0 }
  records.forEach(r => {
    sum.logic += r.scores?.logic || 0
    sum.fluency += r.scores?.fluency || 0
    sum.filler += r.scores?.filler || 0
    sum.tone += r.scores?.tone || 0
    sum.appeal += r.scores?.appeal || 0
    sum.duration += r.scores?.duration || 0
  })
  
  const count = records.length
  return {
    logic: Math.round(sum.logic / count),
    fluency: Math.round(sum.fluency / count),
    filler: Math.round(sum.filler / count),
    tone: Math.round(sum.tone / count),
    appeal: Math.round(sum.appeal / count),
    duration: Math.round(sum.duration / count)
  }
}

/**
 * 徽章定义
 */
export const BADGES = [
  { id: 'first_training', name: '初次开口', icon: '🌱', desc: '完成第一次训练', condition: (user) => user.totalTrainings >= 1 },
  { id: 'week_streak', name: '七日打卡', icon: '🔥', desc: '连续7天训练', condition: (user) => user.streakDays >= 7 },
  { id: 'zero_filler', name: '零填充词大师', icon: '🧹', desc: '单次训练填充词<3个', condition: null },
  { id: 'speed_demon', name: '极速表达', icon: '⚡', desc: '30秒内完成1分钟演讲', condition: null },
  { id: 'all_scenarios', name: '千人千面', icon: '🎭', desc: '尝试过全部6种场景', condition: (user) => user.scenarios?.length >= 6 },
  { id: 'level_5', name: '进阶之路', icon: '🌟', desc: '达到Lv.5', condition: (user) => user.level >= 5 },
  { id: 'level_8', name: '演说家', icon: '👑', desc: '达到Lv.8', condition: (user) => user.level >= 8 },
  { id: 'level_10', name: '言值大师', icon: '🏆', desc: '达到Lv.10', condition: (user) => user.level >= 10 },
  { id: 'total_50', name: '持之以恒', icon: '💯', desc: '累计训练50次', condition: (user) => user.totalTrainings >= 50 },
  { id: 'total_100', name: '言值达人', icon: '✨', desc: '累计训练100次', condition: (user) => user.totalTrainings >= 100 }
]

/**
 * 获取已解锁徽章
 */
export function getUnlockedBadges() {
  const user = getUser()
  const saved = uni.getStorageSync(BADGES_KEY)
  const unlocked = saved ? JSON.parse(saved) : []
  
  // 动态检查
  return BADGES.filter(b => {
    if (b.condition) return b.condition(user)
    return false
  })
}

/**
 * 解锁徽章
 */
export function unlockBadge(id) {
  const user = getUser()
  const unlocked = getUnlockedBadges()
  const badge = BADGES.find(b => b.id === id)
  if (badge && !unlocked.find(b => b.id === id)) {
    uni.setStorageSync(BADGES_KEY, JSON.stringify([...unlocked, badge]))
    uni.showToast({ title: `解锁徽章: ${badge.icon} ${badge.name}`, icon: 'success' })
    return true
  }
  return false
}

/**
 * 检查特殊徽章条件
 */
function checkSpecialBadges(record) {
  // 零填充词
  if (record.fillerCount !== undefined && record.fillerCount < 3) {
    unlockBadge('zero_filler')
  }
  // 极速表达
  if (record.durationSec !== undefined && record.durationSec <= 60 && record.durationSec >= 30) {
    unlockBadge('speed_demon')
  }
}
