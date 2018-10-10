var config = require('../../utils/config.js');
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    picUrl:config.picUrl,
    userId: 0,
    sn: '',
    zan: 0,
    topicCount: 0,
    fans: 0,
    courseCount: 0,
    courses:null,
    fan:false,
    userinfo:null,
    topics:null,
    fansList:null,
    currentData: 0,
    top: 0,
    topnav: false,
    fanStatus: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var userId = options.userId;
    _this.setData({
      userId: userId
    })
    util.request({
      url: 'wx/user/agency/' + userId,
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          var userinfo = res.data.data;
          _this.setData({
            userinfo: userinfo
          })
          if (userinfo.phone) {
          var sn = userinfo.phone.substring(0, 3) + "****" + userinfo.phone.substring(7, 11);
            _this.setData({
              sn: sn
            })
          }
        }
      }
    });
    this.getPersons(userId);
    this.getCourses(userId);
    this.getFans(userId);
    this.gettopics();
    this.getfansbyuser();
    
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
  getFans:function(e){
    var _this = this;
    var userId = this.data.userId;
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      var fanUserId = userInfo.wxInfo.id;
      util.request({
        url: 'wx/fans',
        data: {
          userId: userId,
          fanUserId: fanUserId
        },
        method: 'POST',
        success: function (res) {
          if (res.data.data) {
           _this.setData({
             fan:true
           })
          } 
        }
      });
    }
  },
  getPersons: function (userId) {
    var _this = this;
    util.request({
      url: 'wx/person/tea/' + userId,
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          var zans = res.data.data;
          var fans = res.data.order;
          if (zans) {
            _this.setData({
              zan: zans.up,
              topicCount: zans.count
            })
          }
          if (fans) {
            _this.setData({
              fans: fans,
            })
          }
        }
      }
    });
  },
  gettopics: function () {
    var _this = this;
    util.request({
      url: 'wx/topic/user/' + _this.data.userId,
      method: 'POST',
      data:{
        offset:0,
        pageSize:20
      },
      success: function (res) {
        if (res.data.ret == 1) {
          _this.setData({
            topics:res.data.data
          })
        }
      }
    });
  },
  getfansbyuser: function () {
    var _this = this;
    util.request({
      url: 'wx/fans/user/' + _this.data.userId,
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          _this.setData({
            fansList: res.data.data
          })
        }
      }
    });
  },
  getCourses: function (userId) {
    var _this = this;
    util.request({
      url: 'wx/course/user/' + userId,
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          var course = res.data.data;
          if (course) {
            _this.setData({
              courses: course,
              courseCount: course.length
            })
          }

        }
      }
    });
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    if (this.data.currentData === e.target.dataset.current) {
      this.setData({
        currentData: false
      })
    } else {
      this.setData({
        currentData: e.target.dataset.current
      })
      
      
    }
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  topnav: function (e) {
    if (this.data.currentData != 0 && this.data.top > 100) {
      this.setData({
        topnav: true
      })
    } else {
      this.setData({
        topnav: false
      })
    }
  },
  fanStatus: function (e) {
    if (this.currentData === 2 && this.top > 100) {
      this.setData({
        fanStatus: true
      })
    } else {
      this.setData({
        fanStatus: false
      })
    }
  },

  scrollTopFun: function (e) {
    console.log(e.detail.scrollTop);
    this.setData({
      top: e.detail.scrollTop
    })
    this.topnav();
  },
  bindchange: function (e) {
    this.setData({
      currentData: e.detail.current
    })
    

  },
  guanzhu:function(e){
    var _this = this;
    var userId = this.data.userId;
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo){
      var fanUserId = userInfo.wxInfo.id;
      util.request({
        url: 'wx/fans/add',
        data: {
          userId: userId,
          fanUserId: fanUserId
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        method: 'POST',
        success: function (res) {
          if (res.data.ret == 1) {
            wx.showToast({
              title: '关注成功',
              icon: 'success',
              duration: 2000
            })
            _this.setData({
              fan:true
            })
          } 
        }
      });
    }else{
      this.setData({
        showtooltip: true,
        tooltip: '请登陆'
      })
      return;
    }
    
  }
})
