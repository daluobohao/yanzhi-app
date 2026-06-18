/**
 * 口才等级配置
 * Lv.1-10 等级体系
 */

export const LEVEL_CONFIGS = [
  { level: 1, name: '初学菜鸟', minExp: 0, maxExp: 100, badge: '🌱', description: '刚入门，敢说就行！', unlocks: ['基础训练'] },
  { level: 2, name: '敢言学徒', minExp: 100, maxExp: 250, badge: '📗', description: '开始熟悉表达框架', unlocks: ['3个场景'] },
  { level: 3, name: '练习生', minExp: 250, maxExp: 450, badge: '🎤', description: '能完成简单汇报', unlocks: ['5个场景'] },
  { level: 4, name: '表达新手', minExp: 450, maxExp: 700, badge: '⭐', description: '逻辑初步成型', unlocks: ['挑战模式-简单'] },
  { level: 5, name: '进阶者', minExp: 700, maxExp: 1000, badge: '🌟', description: '能应对常见职场场景', unlocks: ['全部场景'] },
  { level: 6, name: '熟练表达者', minExp: 1000, maxExp: 1400, badge: '💪', description: '表达流畅，填充词少', unlocks: ['技能训练解锁'] },
  { level: 7, name: '自信演讲者', minExp: 1400, maxExp: 1900, badge: '🔥', description: '有一定感染力', unlocks: ['高级题库'] },
  { level: 8, name: '专业演说家', minExp: 1900, maxExp: 2500, badge: '👑', description: '逻辑+感染力俱佳', unlocks: ['社区排行榜'] },
  { level: 9, name: '金牌导师', minExp: 2500, maxExp: 3200, badge: '🏆', description: '可指导他人', unlocks: ['分享模板'] },
  { level: 10, name: '言值大师', minExp: 3200, maxExp: 999999, badge: '👑', description: '顶级表达能力', unlocks: ['全部权益'] }
]

/**
 * 根据经验值获取当前等级
 */
export function getLevelByExp(exp) {
  let level = 1
  for (let i = LEVEL_CONFIGS.length - 1; i >= 0; i--) {
    if (exp >= LEVEL_CONFIGS[i].minExp) {
      level = LEVEL_CONFIGS[i].level
      break
    }
  }
  return level
}

/**
 * 获取当前等级的配置信息
 */
export function getCurrentLevelConfig(exp) {
  const level = getLevelByExp(exp)
  return LEVEL_CONFIGS.find(l => l.level === level)
}

/**
 * 计算升级所需经验值
 */
export function getExpToNextLevel(exp) {
  const current = getCurrentLevelConfig(exp)
  if (!current || current.level >= 10) return 0
  return current.maxExp - exp
}

/**
 * 计算升级进度百分比 (0-100)
 */
export function getLevelProgress(exp) {
  const current = getCurrentLevelConfig(exp)
  if (!current) return 0
  if (current.level >= 10) return 100
  const range = current.maxExp - current.minExp
  const progress = ((exp - current.minExp) / range) * 100
  return Math.min(100, Math.max(0, progress))
}
