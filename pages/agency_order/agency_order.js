var config = require('../../utils/config.js');
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTabsIndex:1,
    status:null,
    agencyId:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var status = options.status;
    var agencyId = options.agencyId;
    this.setData({
      status:status,
      agencyId:agencyId
    })
    this.getOrder();
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
  catClick: function (event) {
    var _this = this;
    var sid = event.currentTarget.dataset.sid;
    if (sid == 1) {
      _this.setData({
        title: '添加班级'
      })
    }
    if (sid == 2) {
      _this.setData({
        title: '班级列表'
      })
      if (_this.data.currentTabsIndex != 2) {
        _this.loadData();
      }
    }
    _this.setData({
      currentTabsIndex: sid
    })
  },
  getOrder:function(e){
    var status = this.data.status;
    var agencyId = this.data.agencyId;
    if(status && agencyId){
      console.log(1111)
    }
  }
})