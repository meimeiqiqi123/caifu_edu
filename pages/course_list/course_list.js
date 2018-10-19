var config = require('../../utils/config.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 0,
    longitude: 0,
    scroll: {
      left: 0
    },
    lessons: [],  //课程data
    dates: [],     //本周日期
    currentCardId: 0,
    year: 0,
    month: 0,
    top: 0,
    scale:0      //最早的一门课

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDate();
    this.getCourseList(true);
    this.getLocation();
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
  get_kb: function (id) {
    //数组去除指定值
    function removeByValue(array, val) {
      for (var i = 0, len = array.length; i < len; i++) {
        if (array[i] == val) { array.splice(i, 1); break; }
      }
      return array;
    }
    var today = parseInt(1);  //0周日,1周一
    today = today === 0 ? 6 : today - 1; //0周一,1周二...6周日
    var week = 2;

    //各周日期计算
    var dates = []
    var nowD = new Date(),
      nowMonth = nowD.getMonth(),
      nowDate = nowD.getDate();
    var year = nowD.getYear();
    var monarr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    // check for leap year
    if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) monarr[1] = "29";
    for (var i = nowDate; i <= monarr[nowMonth]; i++) {
      var day_now = {};
      day_now.month = nowMonth + 1;
      day_now.day = i;
      dates.push(day_now)
    }

    var lesson = []
    var day_lesson =
      {
        course: [{ name: '足球', place: 'ssssss', number: 2 }, { name: '足球', place: 'ssssss', number: 5 }],
        date: '6'
      }

    lesson.push(day_lesson)

    this.setData({
      today: today,
      week: week,
      toweek: week,
      dates: dates,
      remind: '',
      lessons: lesson
    });
  },
  getDate: function (e) {
    //各周日期计算
    var dates = []
    var nowD = new Date(),
      nowMonth = nowD.getMonth(),
      nowDate = nowD.getDate();
    var year = nowD.getYear();
    var monarr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    // check for leap year
    if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) monarr[1] = "29";
    for (var i = 1; i <= monarr[nowMonth]; i++) {
      var day_now = {};
      day_now.month = nowMonth + 1;
      day_now.day = i;
      dates.push(day_now)
    }
    this.setData({
      dates: dates,
      month: nowMonth + 1,
      year: year
    });
  },
  getCourseList: function (isshow) {
    var _this = this;
    var userId = wx.getStorageSync('userInfo').wxInfo.id;
    util.request({
      url: 'wx/course/card/' + userId,
      showLoading: isshow,
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          var lessons = res.data.data;
          _this.setData({
            lessons: lessons,
            scale:res.data.order-1
          });
          //console.log(lessons)

        }
      }
    });
  },
  getLocation: function (cb) {
    var _this = this;
    //获取用户当前位置
    wx.getLocation({
      success: function (res) {
        _this.setData({ latitude: res.latitude, longitude: res.longitude });
        typeof cb == "function" && cb();
      }
    })
  },
  sign: function (e) {
    var _this = this;
    var nowD = new Date();
    var n_week = nowD.getDay();
    var lesson = this.data.lessons[n_week - 1];
    if (lesson.cards && lesson.cards.length > 0) {
      var longitude = _this.data.longitude;
      var latitude = _this.data.latitude;
      if (longitude == 0) {
        _this.getLocation(function () {
          _this.setData({
            showmodal: true,
            tooltip: '前去打卡？',
          })
        });
      } else {
        _this.setData({
          showmodal: true,
          tooltip: '前去打卡？',
        })
      }
    } else {
      _this.setData({
        showtooltip: true,
        tooltip: '今日无课'
      })
    }



  },
  confirmSign: function (e) {
    var user = wx.getStorageSync('userInfo').wxInfo;
    var userId = user.id;
    var managerId = user.managerId;
    var longitude = this.data.longitude;
    var latitude = this.data.latitude;
    var n_week = new Date().getDay();
    var lesson = this.data.lessons[n_week - 1];
    var courseCardId1;
    var courseCardId2;
    var cards = lesson.cards;
    courseCardId1 = cards[0].cardId;
    courseCardId2 = cards[cards.length - 1].cardId;
    var _this = this;
    util.request({
      url: 'wx/course/card/sign',
      method: 'POST',
      data: {
        userId: userId,
        managerId: managerId,
        longtitude: longitude,
        latitude: latitude,
        courseCardId1: courseCardId1,
        courseCardId2: courseCardId2,
      },
      success: function (res) {
        if (res.data.ret == 1) {
          wx.showToast({
            title: '打卡成功',
            icon: 'success',
            duration: 2000
          })
          //_this.getCourseList(false);
        } else {
          _this.setData({
            showtooltip: true,
            tooltip: res.data.data
          })
        }
      }
    });
  },

})