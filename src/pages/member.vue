<template>
  <view class="page-member">
    <view class="hero">
      <text class="hero-icon">👑</text>
      <text class="hero-title">开通会员</text>
      <text class="hero-desc">解锁全部功能，畅享无限训练</text>
    </view>
    
    <view class="plans">
      <view class="plan-card" :class="{ recommended: plan.recommended }" v-for="plan in plans" :key="plan.id" @click="subscribe(plan)">
        <view class="plan-header">
          <text class="plan-name">{{ plan.name }}</text>
          <text class="plan-price">¥{{ plan.price }}<text class="plan-period">{{ plan.period }}</text></text>
        </view>
        <view class="plan-features">
          <view class="feature" v-for="f in plan.features" :key="f">
            <text class="check">✅</text>
            <text>{{ f }}</text>
          </view>
        </view>
        <button class="btn-subscribe" v-if="plan.recommended">立即开通</button>
        <button class="btn-subscribe-outline" v-else @click="subscribe(plan)">选择此方案</button>
      </view>
    </view>
    
    <view class="free-compare">
      <text class="compare-title">免费版 vs 会员版</text>
      <view class="compare-row header-row">
        <text class="compare-item">权益</text>
        <text class="compare-item">免费版</text>
        <text class="compare-item vip">会员版</text>
      </view>
      <view class="compare-row" v-for="(row, i) in compareRows" :key="i">
        <text class="compare-item">{{ row[0] }}</text>
        <text class="compare-item">{{ row[1] }}</text>
        <text class="compare-item vip">{{ row[2] }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      plans: [
        {
          id: 'monthly',
          name: '月度会员',
          price: 18,
          period: '/月',
          recommended: false,
          features: ['每日无限训练', '详细分析报告', '全部场景题库', '自定义训练计划', '永久历史记录', '社区功能', 'AI专属教练']
        },
        {
          id: 'yearly',
          name: '年度会员',
          price: 168,
          period: '/年',
          recommended: true,
          features: ['月度会员全部权益', '立省48元', '专属徽章标识', '优先客服支持']
        }
      ],
      compareRows: [
        ['每日训练次数', '3次', '不限'],
        ['分析报告', '基础版', '详细版（逐句标注）'],
        ['训练题库', '基础', '全部场景+高级'],
        ['训练计划', '7天固定', '自定义+自适应'],
        ['历史记录', '7天', '永久保存'],
        ['社区功能', '❌', '✅'],
        ['AI专属教练', '❌', '✅']
      ]
    }
  },
  methods: {
    subscribe(plan) {
      uni.showModal({
        title: '确认开通',
        content: `确认开通${plan.name}（¥${plan.price}）？`,
        success: (res) => {
          if (res.confirm) {
            uni.showToast({ title: '支付功能开发中', icon: 'none' })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-member {
  min-height: 100vh;
  background: #FFF8F0;
  padding: 40rpx 30rpx;
}

.hero {
  text-align: center;
  padding: 60rpx 0;
  
  .hero-icon {
    font-size: 80rpx;
    display: block;
    margin-bottom: 20rpx;
  }
  
  .hero-title {
    display: block;
    font-size: 44rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 12rpx;
  }
  
  .hero-desc {
    display: block;
    font-size: 26rpx;
    color: #999;
  }
}

.plans {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  margin-bottom: 40rpx;
}

.plan-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 36rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
  
  &.recommended {
    border: 3rpx solid #FF8C42;
    position: relative;
    
    &::before {
      content: '推荐';
      position: absolute;
      top: -12rpx;
      right: 30rpx;
      background: #FF8C42;
      color: #fff;
      font-size: 22rpx;
      padding: 4rpx 16rpx;
      border-radius: 12rpx;
    }
  }
  
  .plan-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
    padding-bottom: 24rpx;
    border-bottom: 1rpx solid #f0f0f0;
    
    .plan-name {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
    
    .plan-price {
      font-size: 40rpx;
      font-weight: bold;
      color: #FF8C42;
      
      .plan-period {
        font-size: 24rpx;
        font-weight: normal;
      }
    }
  }
  
  .plan-features {
    .feature {
      display: flex;
      align-items: center;
      gap: 12rpx;
      margin-bottom: 12rpx;
      font-size: 26rpx;
      color: #666;
    }
  }
  
  .btn-subscribe {
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background: linear-gradient(135deg, #FF8C42, #FFB07A);
    color: #fff;
    border: none;
    border-radius: 40rpx;
    font-size: 30rpx;
    margin-top: 24rpx;
    
    &::after { border: none; }
  }
  
  .btn-subscribe-outline {
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background: #fff;
    color: #FF8C42;
    border: 2rpx solid #FF8C42;
    border-radius: 40rpx;
    font-size: 30rpx;
    margin-top: 24rpx;
    
    &::after { border: none; }
  }
}

.free-compare {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  
  .compare-title {
    display: block;
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
    text-align: center;
  }
  
  .compare-row {
    display: flex;
    padding: 16rpx 0;
    border-bottom: 1rpx solid #f5f5f5;
    
    &:last-child { border-bottom: none; }
    
    &.header-row {
      border-bottom: 2rpx solid #f0f0f0;
      font-weight: bold;
    }
    
    .compare-item {
      flex: 1;
      font-size: 24rpx;
      color: #666;
      text-align: center;
      
      &.vip {
        color: #FF8C42;
        font-weight: 500;
      }
    }
  }
}
</style>
