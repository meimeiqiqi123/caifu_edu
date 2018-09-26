const config = require('utils/config.js');
const util = require('utils/util.js');
App({
  onLaunch: function () {
    var _this = this;
    var userinfo = wx.getStorageSync("userInfo");
    wx.login({
      success: function (res) {
        wx.request({
          url: config.requestUrl + 'wx/login',
          data: { code: res.code },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (session) {
            var openid = session.data.data.openid;
            //判断是否已经注册
            if (session.data.order) {
              console.log("已经注册");
              wx.removeStorageSync('userInfo');
              //已经注册不需要再登陆
              var userInfo = {
                'openid': '',
                'wxInfo': ''
              };
              userInfo.openid = openid;
              userInfo.wxInfo = session.data.order;   
              wx.setStorageSync('userInfo', userInfo);
              _this.globalData.userInfo = session.data.order;
            }
          }
        });
        //更新版本
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function (res) {
          // 请求完新版本信息的回调
          console.log(res.hasUpdate)
        })
        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否马上重启小程序？',
            success: function (res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            }
          })
        })
      },
      fail: function () {

      }
    });
  },

  login: function (cb) {
    var _this = this;
    if (_this.globalData.userInfo){
      typeof cb == "function" && cb(res.wxInfo);
    }else{
      util.getUserInfo(function getInfo(res) {
        _this.globalData.userInfo = res.wxInfo;
        typeof cb == "function" && cb(res.wxInfo);
      });
    }
    
  },

  globalData: {
    userInfo: null,
    index: 0,
    course: 0,
    person: 0,
    page:'',//音乐
    query:null
  }
})