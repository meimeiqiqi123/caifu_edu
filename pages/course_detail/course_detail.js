var config = require('../../utils/config.js');
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    picUrl:config.picUrl,
    course:null,
    managers:null,
    userinfo: null,
    courses:null,
    pictures:null,
    courseId:0,
    orderType:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var courseId = options.courseId;
    var orderType = options.type;
    this.setData({
      userinfo: wx.getStorageSync('userInfo'),
      courseId: courseId,
      orderType: orderType
    });
    var _this = this;
    util.request({
      url: 'wx/course/'+courseId,
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          _this.setData({
            course: res.data.data,
          })
          _this.getCourses(res.data.data.agencyId)
        }
      }
    });
    this.getManagers(courseId);
    this.getPictures(courseId);
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
  getCourses:function(agencyId){
    var _this = this;
    util.request({
      url: 'wx/course/agency/' + agencyId,
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          _this.setData({
            courses: res.data.data,
          })
        }
      }
    });
  },
  getManagers:function(courseId){
    var _this = this;
    util.request({
      url: 'wx/manager/course/' + courseId,
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          _this.setData({
            managers: res.data.data,
          })
        }
      }
    });
  },
  getPictures: function (courseId) {
    var _this = this;
    util.request({
      url: 'wx/pic/course/' + courseId,
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          _this.setData({
            pictures: res.data.data,
          })
        }
      }
    });
  },
  managerPage:function(e){
    var userId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../tea_profile/tea_profile?userId=' + userId,
    })
  },
  getOrderInfo: function (orderType) {
    var totalPrice = this.data.course.realAmount;
    if(orderType==2){
      totalPrice = this.data.course.experienceAmount;
    }else if(orderType == 3){
      totalPrice = this.data.course.leagueAmount;
    }
    var courseId = this.data.course.id;
    var order = {
      courseId: courseId,
      totalPrice: totalPrice,
      orderType: orderType,
      courseName:this.data.course.name,
      pic:this.data.course.logo,
      incount:this.data.course.incount,
      leagueCount:this.data.course.leagueCount,
      agencyName:this.data.course.agency.name,
      agencyId:this.data.course.agencyId
    };
    var order = JSON.stringify(order);
    wx.navigateTo({
      url: '../orderconfirm/orderconfirm?order=' + order,
    })


  },
  submitOrder: function (e) {
    var ordertype = e.currentTarget.dataset.type;
    var that = this;
    var canUser = wx.canIUse('button.open-type.getUserInfo');
    if (canUser) {
      if (e.detail.userInfo) {
        util.saveUserInfo(e.detail.userInfo, function (res) {
          that.setData({
            userinfo: res.wxInfo
          })
          that.getOrderInfo(ordertype);
        })
      } else {
        console.log("授权失败")
      }
    } else {
      //兼容老版本
      app.login(function () {
        that.getOrderInfo(ordertype);
      });
    }
  },
  submitOrderNo: function (e) {
    var ordertype = e.currentTarget.dataset.type;
    this.getOrderInfo(ordertype);

  },
  
})