var config = require('../../utils/config.js');
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: config.picUrl,
    shows: null,
    courses: null,
    isshow:true,
    query: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var query = null;
    if (options && options.query) {
      query = options.query
    }
    this.getCourse(query);
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
    app.globalData.page = '';
    if (app.globalData.query) {
      var options = {};
      if (app.globalData.query) {
        options.query = app.globalData.query,
        this.setData({
          query: app.globalData.query,
          isshow:false
        })

      }
      this.onLoad(options);
      app.globalData.query = null
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
  getTestCourse: function () {
    var _this = this;
    util.request({
      url: 'wx/course/onsale',
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          var testCourses = res.data.data;
          _this.setData({
            testCourses: testCourses,
          })
        }
      }
    });
  },
  getCourse: function (query) {
    var _this = this;
    util.request({
      url: 'wx/course/onsale',
      method: 'POST',
      data: {query: query==null?'':query},
      success: function (res) {
        if (res.data.ret == 1) {
          var courses = res.data.data;
          _this.setData({
            courses: courses,
            shows: res.data.order
          })
        }
      }
    });
  },
  courseDetail: function (e) {
    var courseId = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../course_detail/course_detail?courseId=' + courseId+'&type='+type,
    })
  },
  showInput: function (e) {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  clearInput: function (e) {
    this.setData({
      query: null,
      isshow: true
    })
    this.onLoad();
  }
})