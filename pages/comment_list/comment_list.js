var config = require('../../utils/config.js');
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl:config.picUrl,
    records: null,
    topicId:0,
    url:'',
    commentfocus: false,
    content: '',
    startPage: 1,
    recordNum: 10,
    total: 0,
    load: true,
    currentCount: 0,
    style:'fixed'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取评论数
    this.getRecords(options.topicId);
    this.setData({
      url:options.url,
      topicId: options.topicId
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
  focuson:function(e){
      this.setData({
        style:'static'
      })
  },
  getRecords: function (topicId) {
    var _this = this;
    _this.setData({
      startPage: 1
    })
    // 查询评论
    util.request({
      url: 'wx/record/topic/' + topicId,
      data: {
        startPage: 1,
        recordNum: _this.data.recordNum
      },
      method: 'POST',
      showLoading: false,
      success: function (res) {
        if (res.data.ret == 1) {
          if (res.data.data) {
            _this.setData({
              records: res.data.data,
              total: res.data.order,
              currentCount: res.data.data.length
            })
          }
        }
      }
    });
  },
  commentMore: function (e) {
    var records = this.data.records.length;
    if (!this.data.load || records >= this.data.total) {
      return;
    }
    this.setData({
      load: false,
    })
    var _this = this;
    var startPage = _this.data.startPage + 1;
    util.request({
      url: 'wx/record/topic/' + _this.data.topicId,
      showLoading: false,
      data: {
        startPage: startPage,
        recordNum: _this.data.recordNum
      },
      method: 'POST',
      success: function (result) {
        if (result.data.data) {
          var records = _this.data.records.concat(result.data.data)
          _this.setData({
            records: records,
            startPage: startPage,
            load: true,
            currentCount: records.length
          })
        } else {
          _this.setData({
            load: true,
          })
        }
      }

    })
  },
  
  contentChange: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  publish: function () {
    var userInfo = wx.getStorageSync('userInfo');
    if(!userInfo){
      this.setData({
        showtooltip: true,
        tooltip: '请登陆'
      })
      return;
    }

    var userId = userInfo.wxInfo.id;
    var topicId = this.data.topicId;
    var content = this.data.content;
    if (content == '') {
      this.setData({
        showtooltip: true,
        tooltip: '请输入内容'
      })
      return;
    }
    var _this = this;
    util.request({
      url: 'wx/record/add',
      data: {
        topicId: topicId,
        content: content,
        userId: userId,
        scale: 1
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          _this.setData({
            content: '',
            commentHidden: true
          })
          _this.getRecords(topicId);
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            duration: 2000
          })

        } else {
          _this.setData({
            tooltip: '发布失败,请重新发布'
          })
        }
      }
    });
  },
})