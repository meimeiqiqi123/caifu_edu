var config = require('../../utils/config.js');
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: config.picUrl,
    currentTabsIndex: 1,
    agencyId: null,
    commentCount:0,
    isBlank: true,
    comments: null,
    startPage: 1,
    recordNum: 10,
    total: 0,
    load: true,
    reply:0,
    showreply:false,
    currentCommentId:0,
    focousreply:false,
    replyContent:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var agencyId = options.agencyId;
    this.setData({
      agencyId: agencyId
    })
    this.getComments();
    this.getCommentCount();
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
  catClick: function (event) {
    var _this = this;
    var sid = event.currentTarget.dataset.sid;
    if (_this.data.currentTabsIndex == sid) {
      return;
    }
    var reply = 0;
    if(sid == 2){
      reply = 0
    }else if(sid == 3){
      reply = 1
    }
    _this.setData({
      startPage: 1,
      reply: reply,
      currentTabsIndex: sid
    })
    _this.getComments();

  },
  getComments: function (startPage) {
    var agencyId = this.data.agencyId;
    var _this = this;
    if (agencyId) {
      util.request({
        url: 'wx/comment/agency/' + agencyId,
        method: 'POST',
        data: {
          reply: _this.data.reply,
          offset: startPage ? startPage : _this.data.startPage,
          pageSize: _this.data.recordNum,
          query: _this.data.query
        },
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
              comments: res.data.data
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
    var comments = this.data.comments.length;
    if (!this.data.load || comments >= this.data.total) {
      return;
    }
    this.setData({
      load: false,
    })
    var startPage = _this.data.startPage + 1;
    var agencyId = this.data.agencyId;
    var reply = this.data.reply;
    var _this = this;
    util.request({
      url: 'wx/order/agency/' + agencyId,
      showLoading: false,
      data: {
        reply: reply,
        offset: _this.data.startPage,
        pageSize: _this.data.recordNum
      },
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          _this.setData({
            comments: _this.data.comments.concat(res.data.data),
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
  getCommentCount: function (e) {
    var agencyId = this.data.agencyId;
    var _this = this;
    if (agencyId) {
      util.request({
        url: 'wx/comment/sum/agency/' + agencyId,
        method: 'POST',
        success: function (res) {
          if (res.data.ret == 1) {
            var commentCount = res.data.data;
            _this.setData({
              commentCount: commentCount,
            })
          }
        }
      });
    }
  },
  replyComment:function(e){
    var commentId = e.currentTarget.dataset.id;
    if (this.data.showreply){
      var content = this.data.replyContent;
      if(content){
        var _this = this;
        util.request({
          url: 'wx/comment/reply/' + commentId,
          method: 'POST',
          data: {
            reply: 1,
            content: content
          },
          success: function (res) {
            if (res.data.ret == 1) {
              wx.showToast({
                title: '回复成功',
                icon: 'success',
                duration: 2000
              })
              _this.getComments();
              _this.setData({
                showreply: false
              })
            }
          }
        });
      }else{
        this.setData({
          showtooltip:true,
          tooltip:'请输入回复内容'
        })
      }
    }else{
      this.setData({
        currentCommentId: commentId,
        showreply: true,
        focousreply: true
      })
    }
    
  },
  contentChange:function(e){
    this.setData({
      replyContent:e.detail.value
    })
  },
  
})