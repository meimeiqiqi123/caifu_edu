var config = require('../../utils/config.js');
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: config.picUrl,
    userInfo: null,
    isBlank: true,
    orders: null,
    startPage: 1,
    recordNum: 10,
    total: 0,
    load: true,
    status:null,
    isClose: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.status){
      this.setData({
        status: options.status
      })
    }
   
    this.loadData();
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
    if (!this.data.isClose) {
      this.loadData();
    }
    if(this.data.status == 0){
      wx.setNavigationBarTitle({
        title: '待付款订单',
      });
    } else if (this.data.status == 1){
      wx.setNavigationBarTitle({
        title: '待使用订单',
      });
    } else if (this.data.status == 6) {
      wx.setNavigationBarTitle({
        title: '待评价订单',
      });
    } else if (this.data.status == 7) {
      wx.setNavigationBarTitle({
        title: '已完成订单',
      });
    }else{
      wx.setNavigationBarTitle({
        title: '我的订单',
      });
    }
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
    var that = this
    setTimeout(function () {
      that.setData({ isClose: true })
    }, 200)
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
    var orders = this.data.orders.length;
    var userInfo = wx.getStorageSync('userInfo');
    if (!this.data.load || orders >= this.data.total || !userInfo) {
      return;
    }
    this.setData({
      load: false,
    })
    var _this = this;
    var startPage = _this.data.startPage + 1;
    var userId = userInfo.wxInfo.id;
    util.request({
      url: 'wx/order/status',
      showLoading: false,
      data: {
        userId: userId,
        status: that.data.status ? that.data.status : -1,
        offset: startPage,
        pageSize: _this.data.recordNum
      },
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          _this.setData({
            orders: _this.data.orders.concat(res.data.data),
            startPage: startPage,
            load: true,
          })
        } else {
          _this.setData({
            load: true,
          })
        }
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  loadData: function () {
    var that = this;
    var user = wx.getStorageSync('userInfo');
    if (user && user.wxInfo) {
      var userId = user.wxInfo.id;
      util.request({
        url: 'wx/order/status',
        data: {
          userId: userId,
          status: that.data.status?that.data.status:-1,
          offset: 1,
          pageSize: that.data.recordNum
        },
        method: 'POST',
        success: function (res) {
          if (res.data.ret == 1) {
            var total = res.data.order;
            if (res.data.data && res.data.data.length > 0) {
              that.setData({
                isBlank: true
              })
            } else {
              that.setData({
                isBlank: false
              })
            }
            that.setData({
              total: total,
              orders: res.data.data
            })
          }
        }
      });
    } else {
      that.setData({
        isBlank: false
      })
    }
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
  },
  orderDetail: function (e) {
    var order = e.currentTarget.dataset.order;
    var order = JSON.stringify(order);
    this.setData({
      isClose: false
    })
    wx.navigateTo({
      url: '../order_detail/order_detail?order=' + order,
    })
  },
 
 
  
})