var config = require('../../utils/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
       picUrl: config.picUrl,
       courseName:'',
       bond:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var bond = wx.getStorageSync('userInfo').wxInfo.bond;
   
      this.setData({
        bond: bond,
        courseName: options.courseName,
        pic:options.pic
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  gotoIndex: function () {
    wx.switchTab({
      url: '../index/index',
    })
  },
  gotoOrder:function(){
    wx.navigateTo({
      url: '../myorder/myorder',
    })
  },
  bond:function(e){
    wx.navigateTo({
      url: '../bond/bond',
    })
  }
})