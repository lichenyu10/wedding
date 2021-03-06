
var app = getApp()
var util = require("../../util/util")
Page({
  data: {
    awardsList: {},
    animationData: {},
    btnDisabled: '',
    awards:[]
  },
  onLoad:function(option){
    var that=this;
    console.log("onLad---")
    
  },
  gotoList: function() {
    wx.navigateTo({ 
      url: '../detaillist/detaillist' 
    })
  },
  getLottery: function () {
    var that = this
    var awardIndex = Math.random() * 6 >>> 0;

    // 获取奖品配置
    var awardsConfig = app.awardsConfig
    if (awardIndex < 2) awardsConfig.chance = false
    console.log(awardIndex)

    // 初始化 rotate
    var animationInit = wx.createAnimation({
      duration: 1
    })
    this.animationInit = animationInit;
    animationInit.rotate(0).step()
    this.setData({
      animationData: animationInit.export(),
      btnDisabled: 'disabled'
    })

    // 旋转抽奖
    setTimeout(function() {
      var animationRun = wx.createAnimation({
        duration: 4000,
        timingFunction: 'ease'
      })
      that.animationRun = animationRun
      animationRun.rotate(360 * 8 - awardIndex * (360 / 6)).step()
      that.setData({
        animationData: animationRun.export()
      })
    }, 100)

    // 中奖提示
    setTimeout(function() {
      wx.showModal({
        title: '恭喜',
        content: '获得' + (awardsConfig.awards[awardIndex].prizeName),
        showCancel: false
      })
      console.log("----------->UserID  " + app.globalData.userId)
      wx.request({
        url: util.host + '/user/prize/addUserPrize',
        data:{
          prizeName: awardsConfig.awards[awardIndex].prizeName,
          prizeId: awardsConfig.awards[awardIndex].prizeId,
          userId: app.globalData.userId
        },
        success: function (res) {

        },
        fail: function (res) {
          console.log("fail");
          console.log(res)
        }
      })
      if (awardsConfig.chance) { 
        that.setData({
          btnDisabled: '' 
        })  
      }
    }, 4100);
  },
  onReady: function (e) {
    var that = this;
    // getAwardsConfig

    wx.request({
      url: util.host + 'v1/users/prizeFrezzList',
      success: function (res) {
        var data = res.data.data;

        if (data.length > 0) {
          var tmpData = [];
          if (data.length < 6) {
            var thankyou = 6 - data.length;
            var j = 0;
            var thankyouItem = {

              prizeId: '-1',
              prizeName: '谢谢回顾',
              prizeImg: '',
              prizeNumber: 1
            }
            for (var i = 0; i < 6; i++) {
              var tmpItem = data[i];
              if (thankyou > 0) {
                if (i % 2 == 0) {
                  tmpData.push(
                    thankyouItem
                  );
                  if (j < data.length) {
                    tmpData.push(
                      data[j]
                    )
                    j++;
                  }
                  thankyou--;
                }


              } else {

                if (j < data.length) {
                  tmpData.push(
                    data[j]
                  )
                  j++;
                }

              }

            }
          } else {
            for (var i = 0; i < 6; i++) {
              var tmpItem = data[i];
              tmpData.push(
                data[i]
              )
            }

          }
          thankyou--; 

        }
        console.log(tmpData)
        that.setData({
          awards: tmpData
        }
        
        );
        console.log("=======11============================")
        console.log(that.data.awards)
        app.awardsConfig = {
          chance: true,
          awards: that.data.awards
        }

        // wx.setStorageSync('awardsConfig', JSON.stringify(awardsConfig))
        console.log("=======22============================")
        console.log(that.data.awards)

        // 绘制转盘
        var awardsConfig = app.awardsConfig.awards,
          len = awardsConfig.length,
          rotateDeg = 360 / len / 2 + 90,
          html = [],
          turnNum = 1 / len  // 文字旋转 turn 值
        that.setData({
          btnDisabled: app.awardsConfig.chance ? '' : 'disabled'
        })
        var ctx = wx.createContext()
        console.log("-------->awardsConfig")
        console.log(that.data.awards)
        for (var i = 0; i < len; i++) {
          // 保存当前状态
          ctx.save();
          // 开始一条新路径
          ctx.beginPath();
          // 位移到圆心，下面需要围绕圆心旋转
          ctx.translate(150, 150);
          // 从(0, 0)坐标开始定义一条新的子路径
          ctx.moveTo(0, 0);
          // 旋转弧度,需将角度转换为弧度,使用 degrees * Math.PI/180 公式进行计算。
          ctx.rotate((360 / len * i - rotateDeg) * Math.PI / 180);
          // 绘制圆弧
          ctx.arc(0, 0, 150, 0, 2 * Math.PI / len, false);

          // 颜色间隔
          if (i % 2 == 0) {
            ctx.setFillStyle('#ffb820');
          } else {
            ctx.setFillStyle('#ffcb3f');
          }

          // 填充扇形
          ctx.fill();
          // 绘制边框
          ctx.setLineWidth(0.2);
          ctx.setStrokeStyle('#e4370e');
          ctx.stroke();

          // 恢复前一个状态
          ctx.restore();

          // 奖项列表
          html.push({ turn: i * turnNum + 'turn', award: awardsConfig[i].prizeName });
        }
        that.setData({
          awardsList: html
        });

        wx.drawCanvas({
          canvasId: 'lotteryCanvas',
          actions: ctx.getActions()
        })
      },

      fail: function (res) {
        console.log("fail");
        console.log(res)
      }
    })
    

  }

})
