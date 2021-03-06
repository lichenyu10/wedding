//app.js
var util = require("./util/util")
App({
  login_weixin: function (data) {
    
      wx.request({
        url: util.host+'user/login',
        // url: 'https://weixin.dongnaoedu.com',
        data: data,  
      success: (res => {
        console.log("--------------111") 
        console.log(res) 
       
        if (res.statusCode === 200) {
          //200: 服务端业务处理正常结束

          this.globalData.userId = res.data.data.userId
          
        } else   {
          //其它错误，提示用户错误信息
             
        }  

      }),
      fail: (res => {
        console.log(res) 
        if (this._errorHandler != null) {
          this._errorHandler(res)
        }
      }) 
  
    })
  },
  onLaunch: function () {


    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log("--------------111")
              console.log(res.userInfo)
              this.login_weixin(res.userInfo)  
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况 
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    userId:null
  }
})