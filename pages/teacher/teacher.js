var config = require('../../utils/config.js');
const app = getApp();
const util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    picUrl:config.picUrl,
    userinfo:null,
    topics:null,
    sn:'',
    zan: 0,
    count: 0,
    fans: 0,
    courseCount:0,
    count1:0,
    count2:0,
    length1:0,
    length2:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    if (wx.getStorageSync('userInfo')) {
      var userId = wx.getStorageSync('userInfo').wxInfo.id;
      util.request({
        url: 'wx/user/agency/'+userId,
        method: 'POST',
        success: function (res) {
          if (res.data.ret == 1) {
            var userinfo = res.data.data;
            _this.setData({
              userinfo: userinfo
            })
            if (userinfo.phone){
              var sn = userinfo.phone.substring(0, 3) + "****" + userinfo.phone.substring(7, 11);
              _this.setData({
                sn:sn
              })
            }
          } 
        }
      });
      this.getPersons(userId);
      this.getCourseCount(userId);
      this.getStudentCount(userId);
      this.getTopics(userId);
    }
    
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
  publish:function(){
    var agencyId = this.data.userinfo.manager.agencyId;
    if(agencyId){
      wx.navigateTo({
        url: '../publish/publish?agencyId=' + agencyId,
      })
    }

    
  },
  
  uploadPic:function(e){
    var agencyId = this.data.userinfo.manager.agencyId;
    var userId = this.data.userinfo.id;
    if (agencyId) {
      wx.navigateTo({
        url: '../upload_pic/upload_pic?agencyId=' + agencyId +'&userId='+userId,
      })
    }
   
  },
  getPersons: function (userId) {
    var _this = this;
    util.request({
      url: 'wx/person/' + userId,
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          var pics = res.data.data;
          var zans = res.data.order;
          var fans = res.data.other;
          if (pics) {
            _this.setData({
              pics: pics,
              picNum: pics.length
            })
          }
          if (zans) {
            _this.setData({
              zan: zans.up,
              count: zans.count
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
  getCourseCount: function (userId) {
    var _this = this;
    util.request({
      url: 'wx/course/count/' + userId,
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          var count = res.data.data;
          if (count) {
            _this.setData({
              courseCount: count
            })
          }

        }
      }
    });
  },
  kaoqin:function(e){
    wx.navigateTo({
      url: '../course_list/course_list',
    })
  },
  getStudentCount: function (userId){
    var _this = this;
    util.request({
      url: 'wx/student/course/scale/' + userId,
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          _this.setData({
            count1:res.data.data,
            count2:res.data.order,
            length1: res.data.data * 10,
            length2: res.data.order * 10,
          })

        }
      }
    });
  },
  getTopics: function (userId) {
    var _this = this;
    util.request({
      url: 'wx/topic/up/user/' + userId,
      method: 'POST',
      data:{
        offset:0,
        pageSize:2
      },
      success: function (res) {
        if (res.data.ret == 1) {
          _this.setData({
            topics: res.data.data
          })
      }
      }
    })
  },
})