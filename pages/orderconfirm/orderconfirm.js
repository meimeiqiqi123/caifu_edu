var config = require('../../utils/config.js');
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: config.picUrl,
    wallet: 0,
    totalPrice: 0,
    payment: 2,
    order: null,
    isshow: false,
    subdisabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 查询红包
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
  closeRoom: function () {
    this.setData({
      isshow: false
    })
  },
  checkPrice: function (event) {
    this.setData({
      isshow: true
    })
  },
  submit: function (e) {
    var courseId = this.data.order.courseId;
    var userinfo = wx.getStorageSync('userInfo');
    var totalPrice = this.data.order.totalPrice;
    var payment = this.data.payment;
    var that = this;
    this.setData({
      subdisabled: true
    })
    if (userinfo && courseId) {
      util.request({
        url: 'wx/order/add',
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        data: {
          courseId: courseId,
          openId: userinfo.openid,
          totalPrice: totalPrice,
          orderType: this.data.order.orderType,
          userId: userinfo.wxInfo.id,
          payment: payment
        },
        success: function (res) {
          //订单创建成功,调用微信支付接口创建预支付订单
          console.log("订单创建成功,开始创建预支付订单")
          if (res.data.ret == 1) {
            var orderNo = res.data.data.number;
            var orderId = res.data.data.id;
            var total_fee = res.data.data.totalPrice;
            if (total_fee > 0 && payment == 2) {
              util.request({
                url: 'wx/pay',
                method: 'POST',
                data: {
                  orderNo: orderNo,
                  openId: userinfo.openid,
                  total_fee: total_fee
                },
                success: function (res) {
                  if (res.data.ret == 1) {
                    console.log("预支付订单创建成功,调用支付接口");
                    var data = res.data.data;
                    var pack = data.package.split('=')[1];
                    wx.requestPayment({
                      'timeStamp': data.timestamp,
                      'nonceStr': data.noncestr,
                      'package': data.package,
                      'signType': 'MD5',
                      'paySign': data.paySign,
                      'success': function (res) {
                        wx.navigateTo({
                        url: '../paysuccess/paysuccess?courseName='+that.data.order.courseName+'&pic='+that.data.order.pic
                        })
                      },
                      'fail': function (res) {
                        if (res.errMsg = 'requestPayment:fail cancel') {
                          that.setData({
                            subdisabled: false
                          })
                        }
                      }
                    })
                  } else {
                    console.log(res.data);
                    that.setData({
                      subdisabled: false
                    })
                  }
                },
                fail: function (res) {
                  console.log("预支付订单创建失败")
                  that.setData({
                    subdisabled: false
                  })
                }
              })
            } else {
              wx.navigateTo({
                url: '../paysuccess/paysuccess?courseName=' + that.data.order.courseName + '&pic=' + that.data.order.pic
              })
            }
          } else {
            that.setData({
              showtooltip: true,
              tooltip: res.data.data
            })
            that.setData({
              subdisabled: false
            })
          }
        },
        fail: function () {
          console.log("订单创建失败");
          that.setData({
            subdisabled: false
          })
        }
      });
    }

  },
  calTotal: function (obj) {
    var order = wx.getStorageSync('order');
    var totalPrice = order.totalPrice
    var redbag = this.data.redbag;
    var redamount = 0;
    if (redbag <= totalPrice) {
      totalPrice = totalPrice - redbag;
      redamount = redbag
    } else {
      totalPrice = 0;
      redamount = totalPrice
    }
    this.setData({
      totalPrice: totalPrice.toFixed(2),
      redamount: redamount
    })
  },
  setPay: function (e) {
    var index = e.currentTarget.dataset.index;
    if (index == 1) {
      var wallet = this.data.wallet;
      // 判断余额
      var total = this.data.order.totalPrice;
      if (wallet < total) {
        return;
      }
    }
    this.setData({
      payment: index
    })
  }
})