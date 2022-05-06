import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router/index'
import { createPinia } from 'pinia'

// import 'element-plus/lib/theme-chalk/index.css'



const orderStatus = {
  0: '待支付',
  1: '已支付',
  2: '配货完成',
  3: '出库成功',
  4: '交易成功',
  '-1': '手动关闭',
  '-2': '超时关闭',
  '-3': '商家关闭'
}

const app = createApp(App)
// 全局过滤器
app.config.globalProperties.$filters = {
  orderMap(status) {
    return orderStatus[status] || '未知状态'
  },
  prefix(url) {
    if (url && url.startsWith('http')) {
      return url
    } else {
      url = `http://backend-api-02.newbee.ltd${url}`
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