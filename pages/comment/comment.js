// pages/comment/comment.js
var config = require('../../utils/config.js');
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noteNowLen:0,
    roomdev:5,
    hotelen:5,
    roomen:5,
    noteMaxLen:200,
    content:'',
    orderId:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  this.setData({
    orderId:options.orderId
  })
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
  bindTextAreaChange:function(e){
    var that = this
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > that.data.noteMaxLen)
      return;
    that.setData({
      content: value, noteNowLen: len
    })
  },
  setRoomEn: function (e) {
    var score = e.currentTarget.dataset.sid;
    this.setData({
      roomen: score
    })
  },
  setRoomDev:function(e){
    var score = e.currentTarget.dataset.sid;
    this.setData({
      roomdev:score
    })
  },
  setHotelEn: function (e) {
    var score = e.currentTarget.dataset.sid;
    this.setData({
      hotelen: score
    })
  },
  submitInfo:function(){
    var _this = this;
    var user = wx.getStorageSync('userInfo').wxInfo;
    var userId = user.id;
    var openid = user.openId;
    util.request({
      url: 'wx/comment/add/',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        orderId: _this.data.orderId,
        userId:userId,
        openId: openid,
        content:_this.data.content,
        hotelEnv: _this.data.hotelenv,
        roomEnv: _this.data.roomenv,
        roomDev: _this.data.roomdev
      },
      method: 'POST',
      success: function (res) {
        wx.switchTab({
          url: '../index/index',
        })
      }
    })
  }

})