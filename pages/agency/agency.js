var config = require('../../utils/config.js');
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        id: 1,
        title: '团购课',
        subtitle: '报名人数',
        content: '0',
        d: '0%',
        w: '0%',
        m: '0%'
      },
      {
        id: 1,
        title: '体验课',
        subtitle: '报名人数',
        content: '0',
        d: '0%',
        w: '0%',
        m: '0%'
      },
      {
        id: 1,
        title: '新增',
        subtitle: '关注人数',
        content: '0',
        d: '0%',
        w: '0%',
        m: '0%'
      },
      {
        id: 1,
        title: '新增',
        subtitle: '内容推送',
        content: '0',
        d: '0%',
        w: '0%',
        m: '0%'
      }
    ],
    userinfo:null,
    agencyId:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    if (wx.getStorageSync('userInfo')) {
      var userId = wx.getStorageSync('userInfo').wxInfo.id;
      util.request({
        url: 'wx/user/agency/' + userId,
        method: 'POST',
        success: function (res) {
          if (res.data.ret == 1) {
            var userinfo = res.data.data;
            _this.setData({
              userinfo: userinfo,
              agencyId: userinfo.manager.agencyId
            })
          }
        }
      });
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
  gradeManager: function () {
    if (this.data.gradelist) {
      this.setData({
        gradelist: false
      })
    } else {
      this.setData({
        gradelist: true
      })
    }

  },
  teacherManager:function(){
    if(this.data.teacherlist){
      this.setData({
        teacherlist: false
      })
    }else{
      this.setData({
        teacherlist: true
      })
    }
    
  },

  studentManager: function () {
    if (this.data.studentlist) {
      this.setData({
        studentlist: false
      })
    } else {
      this.setData({
        studentlist: true
      })
    }

  },
  addManager:function(e){
    wx.navigateTo({
      url: '../teacher_m/teacher_m?agencyId=' + this.data.agencyId,
    })
  },
  addStudent:function(){
    wx.navigateTo({
      url: '../student_a/student_a?agencyId=' + this.data.agencyId,
    })
  },
  
  addCourse:function(e){
    wx.navigateTo({
      url: '../course_a/course_a?agencyId=' + this.data.agencyId,
    })
  },
  addGrade:function(){
    wx.navigateTo({
      url: '../grade_a/grade_a?agencyId=' + this.data.agencyId,
    })
  },
  
})