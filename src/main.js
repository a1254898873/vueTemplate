import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router/index'
import { createPinia } from 'pinia'





const app = createApp(App)

// 全局过滤器
app.config.globalProperties.$filters = {
  prefix(url) {
    if (url && url.startsWith('http')) {
      return url
    } else {
      url = `http://localhost:3000${url}`
      return url
    }
  },
  resetImgUrl(imgObj, imgSrc, maxErrorNum) {
    if (maxErrorNum > 0) {
      imgObj.onerror = function () {
        resetImgUrl(imgObj, imgSrc, maxErrorNum - 1)
      }
      setTimeout(function () {
        imgObj.src = imgSrc
      }, 500)
    } else {
      imgObj.onerror = null
      imgObj.src = imgSrc
    }
  }
}


// 实例化 Pinia
const pinia = createPinia()


app.use(pinia)
app.use(ElementPlus)
app.use(router)



app.mount('#app')