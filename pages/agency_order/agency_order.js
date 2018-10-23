var config = require('../../utils/config.js');
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: config.picUrl,
    currentTabsIndex:1,
    status:null,
    agencyId:null,
    userInfo: null,
    isBlank: true,
    orders: null,
    startPage: 1,
    recordNum: 10,
    total: 0,
    load: true,
    orderType:1,
    orderPrice:0,
    orderCount:0,
    query:'',
    showverify:false,
    randomCode:'',
    currentOrderId:0
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
    this.getOrderInfo();
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
    if(this.data.status == 1){
      wx.setNavigationBarTitle({
        title: '待消费',
      });
    }else if(this.data.status == 3){
      wx.setNavigationBarTitle({
        title: '已消费',
      });
    } else if (this.data.status == 7) {
      wx.setNavigationBarTitle({
        title: '已评价',
      });
    } else if (this.data.status == -1) {
      wx.setNavigationBarTitle({
        title: '全部订单',
      })
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
    if (_this.data.currentTabsIndex == sid) {
      return;
    }
    _this.setData({
      startPage:1,
      orderType:sid,
      currentTabsIndex: sid
    })
    _this.getOrder();
   
  },
  changeQuery:function(e){
    var query = e.detail.value;
    this.setData({
      query:query
    })
  },
  clearInput: function (e) {
    this.setData({
      query: '',
    })
    this.getOrder(1);
  },
  getOrder:function(startPage){
    var status = this.data.status;
    var agencyId = this.data.agencyId;
    var orderType = this.data.orderType;
    var _this = this;
    if(status && agencyId){
      util.request({
        url: 'wx/order/agency/'+agencyId,
        data: {
          orderType: orderType,
          status: status ? status : -1,
          offset: startPage ?startPage:_this.data.startPage,
          pageSize: _this.data.recordNum,
          query:_this.data.query
        },
        method: 'POST',
        success: function (res) {
          if (res.data.ret == 1) {
            var total = res.data.order;
            if (res.data.data && res.data.data.length > 0) {
              _this.setData({
                isBlank: true
              })
            } else {
              _this.setData({
                isBlank: false
              })
            }
            _this.setData({
              total: total,
              orders: res.data.data
            })
          } 
        }
      });
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  loadMore: function () {
    var orders = this.data.orders.length;
    if (!this.data.load || orders >= this.data.total) {
      return;
    }
    this.setData({
      load: false,
    })
    var startPage = _this.data.startPage + 1;
    var status = this.data.status;
    var agencyId = this.data.agencyId;
    var orderType = this.data.orderType;
    var _this = this;
    util.request({
      url: 'wx/order/agency/' + agencyId,
      showLoading: false,
      data: {
        orderType: orderType,
        status: status ? status : -1,
        offset: _this.data.startPage,
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
  getOrderInfo: function (e) {
    var agencyId = this.data.agencyId;
    var _this = this;
    if (agencyId) {
      util.request({
        url: 'wx/order/info/' + agencyId,
        method: 'POST',
        success: function (res) {
          if (res.data.ret == 1) {
            var orderCount = res.data.data;
            var orderPrice = res.data.order;
            _this.setData({
              orderCount: orderCount,
              orderPrice: orderPrice
            })
          }
        }
      });
    }
  },
  verify:function(e){
    var orderId = e.currentTarget.dataset.id;
    this.setData({
      showverify:true,
      currentOrderId: orderId
    })
  },
  changeCode:function(e){
    this.setData({
      randomCode:e.detail.value
    })
  },
  confirm:function(e){
    if (this.data.randomCode){
      var userinfo = wx.getStorageSync('userInfo');
      var orderId = this.data.currentOrderId;
      var code = this.data.randomCode;
      this.setData({
        showverify:false
      })
      var _this = this;
      util.request({
        url: 'wx/order/verify/' + orderId,
        method: 'POST',
        data:{
          randomCode:code,
          managerId: userinfo.wxInfo.managerId
        },
        success: function (res) {
          if (res.data.ret == 1) {
            wx.showToast({
              title: '验证成功',
              icon: 'success',
              duration: 1000
            })
            _this.getOrder();
          }else{
            _this.setData({
              showtooltip: true,
              tooltip:res.data.data
            })
          }
        }
      });

    }
  }
})