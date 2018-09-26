var config = require('../../utils/config.js');
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTabsIndex: 0,
    isBlank: true,
    orders:null,
    status:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      status:options.status,
      currentTabsIndex: options.status
    })

    this.loadData(options.status)
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
  loadData: function (status) {
    var that = this;
    var user = wx.getStorageSync('userInfo');
    if (user) {
      this.setData({
        userInfo: user.wxInfo
      })
      var userId = user.wxInfo.id;
      util.request({
        url: 'wx/order/status',
        data: {
          userId: userId,
          status: status
        },
        method: 'POST',
        success: function (res) {
          if (res.data.ret == 1) {
            if (res.data.data.length == 0) {
              that.setData({
                isBlank: false
              })
            } else {
              that.setData({
                isBlank: true
              })
            }
            that.setData({
              orders: res.data.data
            })
          }
        }
      });
    } else {
      // this.tooltips('您还未登录,请登录');
    }

  },
  catClick: function (event) {
    var sid = event.currentTarget.dataset.sid;
    this.setData({
      currentTabsIndex: sid
    })
    this.loadData(sid);
  },
})