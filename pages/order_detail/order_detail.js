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
    cancelDisable: false,
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
    wx.navigateTo({
      url: '../comment/comment?orderId=' + orderId ,
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
         
          wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
          });
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
          /*wx.showToast({
            title: '订单取消成功',
            icon: 'success',
            duration: 2000
          })*/
          wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
          });
        } else {
          _this.setData({
            showmodal_t: true,
            tooltip: res.data.data
          })
        }
      },
      fail:function(res){
        _this.setData({
          cancelDisable: false
        })
      }
    })
  },
  pay:function(e){
    var order = {
      id: this.data.order.id,
      totalPrice: this.data.order.totalPrice,
      orderType: this.data.order.orderType,
      courseName: this.data.order.course.name,
      pic: this.data.order.course.logo,
      incount: this.data.order.course.incount,
      leagueCount: this.data.order.course.leagueCount,
      agencyName: this.data.order.course.agency.name,
      number: this.data.order.number,
      openId: this.data.order.openId
    };
    var order = JSON.stringify(order);
    wx.navigateTo({
      url: '../orderconfirm/orderconfirm?order=' + order,
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