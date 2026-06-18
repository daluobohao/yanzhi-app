<script>
import { onMounted } from 'vue'
export default {
  setup() {
    onMounted(() => {
      if (!localStorage.getItem('yanzhi_user')) {
        localStorage.setItem('yanzhi_user', JSON.stringify({
          nickname: '', avatar: '', level: 1, experience: 0,
          totalTrainings: 0, streakDays: 0, lastTrainDate: '',
          scenarios: [], dailyTime: '10分钟', selfScore: 3,
          isFirstLogin: true, createdAt: new Date().toISOString()
        }))
      }
    })
  }
}
</script>
<template>
  <router-view />
</template>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#FFF8F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#333;font-size:14px;-webkit-font-smoothing:antialiased}
@keyframes breathe{0%,100%{transform:scale(1);opacity:.8}50%{transform:scale(1.05);opacity:1}}
@keyframes slideUp{from{transform:translateY(50px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.animate-breathe{animation:breathe 2s ease-in-out infinite}
.animate-slide-up{animation:slideUp .4s ease-out}
.animate-fade-in{animation:fadeIn .3s ease-out}
</style>
