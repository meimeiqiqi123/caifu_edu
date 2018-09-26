var config = require('../../utils/config.js');
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl:config.picUrl,
    url:'',
    userInfo:null,
    noteNowLen: 0,
    noteMaxLen: 100,
    content: '',
    agencyId:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo').wxInfo;
    var url = options.url;
    var agencyId = options.agencyId;
    this.setData({
      userInfo: userInfo,
      url: url,
      agencyId: agencyId
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
  bindTextAreaChange: function (e) {
    var that = this
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > that.data.noteMaxLen)
      return;
    that.setData({
      content: value, noteNowLen: len
    })
  },
  publish: function (e) {
    var content = this.data.content;
    var userId = this.data.userInfo.id;
    var url = this.data.url;
    if (content == '') {
      this.setData({
        showtooltip: true,
        tooltip: '请输入说说'
      })
      return;
    }
    this.setData({
      subdisabled: true
    })
    var _this = this;
    util.request({
      url: 'wx/topic/person/add',
      method: 'POST',
      data:{
        userId:userId,
        content: content,
        url:url,
        agencyId: _this.data.agencyId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.ret == 1) {
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            duration: 2000
          })
          wx.navigateBack({
            })
        }
      }
    });
  }
})