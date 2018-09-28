var config = require('../../utils/config.js');
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: config.picUrl,
    order: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let order = JSON.parse(options.order);
    this.setData({
      order: order
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
  callPhone: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.order.course.agency.phone,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  gotoComment: function (event) {
    var orderId = this.data.order.id;
    var scaleId = this.data.order.scaleId;
    wx.navigateTo({
      url: '../remark/remark?orderId=' + orderId + '&scaleId=' + scaleId,
    })
  },
  delOrder: function (e) {
    var orderId = this.data.order.id;
    if (orderId) {
      this.setData({
        showmodal: true,
        tooltip: '确认删除该订单？'
      })
    }
  },
  confirmDelete: function (e) {
    var orderId = this.data.order.id;
    util.request({
      url: 'wx/order/del/' + orderId,
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000
          })
          wx.switchTab({
            url: '../order/order',
          })
        }
      }
    })
  },
  cancelOrder: function (e) {
    this.setData({
      showmodal2: true,
      tooltip: '确认取消该订单？'
    })
  },
  confirmCancel: function (e) {
    if (this.data.cancelDisable) {
      return;
    }
    this.setData({
      cancelDisable: true
    })
    var orderId = this.data.order.id;
    var _this = this;
    util.request({
      url: 'wx/order/cancel/' + orderId,
      method: 'POST',
      success: function (res) {
        _this.setData({
          cancelDisable: false
        })
        if (res.data.ret == 1) {
          wx.showToast({
            title: '订单取消成功',
            icon: 'success',
            duration: 2000
          })
          wx.switchTab({
            url: '../order/order',
          })
        } else {
          _this.setData({
            showmodal_t: true,
            tooltip: res.data.data
          })
        }
      }
    })
  },
  gotoAddress: function (e) {
    var latitude = e.currentTarget.dataset.latitude;
    var longitude = e.currentTarget.dataset.longitude;
    var location = e.currentTarget.dataset.location;
    wx.openLocation({
      latitude: Number(latitude),
      longitude: Number(longitude),
      address: location
    })
  }
})