// pages/bond/bond.js
//获取应用实例
var config = require('../../utils/config.js');
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tooltip:'',
    phone: '',
    code: '',
    code_disabled: false,
    subdisabled: false,
    code_title: '点击获取',
    currentTime: 60
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  checkPhone: function (phone) {
    if (phone.length == 0) {
      return '请输入手机号码！';
    }
    if (phone.length != 11) {
      return '请输入有效的手机号码！'
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
    if (!myreg.test(phone)) {
      return '请输入有效的手机号码！'
    }
    return '1' 
  },
  phoneChange: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  codeChange: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  getCode: function (e) {
    var phone = this.data.phone;
    var phone_info = this.checkPhone(phone);
    if (phone_info != '1') {
      this.tooltips(phone_info);
      return false;
    }
    var that = this;
    that.setData({
      code_disabled: true
    })
    var currentTime = that.data.currentTime
    var interval = setInterval(function () {
      currentTime--;
      that.setData({
        code_title: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          code_title: '点击获取',
          currentTime: 60,
          code_disabled: false
        })
      }
    }, 1000);
    //获取短信验证码
    util.request({
      url: 'wx/login/code',
      data: {
        phone: phone
      },
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          wx.showToast({
            title: '发送成功',
            icon: 'success',
            duration: 1000
          })
        } else {
          that.tooltips('发送失败,请重新获取');
        }
      }
    });
  },
  tooltips: function (str) {
    var that = this;
    that.setData({
      showtooltip: true,
      tooltip: str
    })
  },
  closetooltip: function (e) {
    this.setData({
      tooltip: ''
    })
  },
  submitInfo: function (e) {
    var that = this;
    var phone = that.data.phone;
    var code = that.data.code;
    if (code == '') {
      that.tooltips('请输入验证码');
      return false;
    }
    that.setData({
      subdisabled: true
    })
    var userId = wx.getStorageSync('userInfo').wxInfo.id;
    if(userId){
      util.request({
        url: 'wx/login/checkCode',
        data: {
          phone: phone,
          userId: userId,
          code: code
        },
        method: 'POST',
        success: function (res) {
          if (res.data.ret == 1) {
            //更新userinfo
            var userInfo = wx.getStorageSync('userInfo');
            userInfo.wxInfo.bond = 1;
            wx.setStorageSync('userInfo', userInfo);
            wx.switchTab({
              url: '../person/person',
            })
          } else {
            that.tooltips(res.data.data);
            that.setData({
              subdisabled: false
            })
          }
        }
      });
    }else{
      that.tooltips('请先登录');
    }
    
  },
  
})