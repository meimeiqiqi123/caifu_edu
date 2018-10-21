var config = require('../../utils/config.js');
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: config.picUrl,
    userinfo: null,
    picNum: 0,
    sn: '',
    zan: 0,
    count: 0,
    fans: 0,
    pics: null,
    showDes: false,
    courseCount: 0,
    count1: 0,
    count2: 0,
    length1: 0,
    length2: 0,
    agencyId: null,
    agencyLogo: '',
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
    role: 0,
    page: 0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var userinfo = wx.getStorageSync('userInfo');
    if (userinfo) {
      var user = userinfo.wxInfo;
      util.request({
        url: 'wx/user/' + user.id,
        method: 'POST',
        success: function (res) {
          if (res.data.ret == 1) {
            var userinfo = res.data.data;
            var role = userinfo.role;
            _this.setData({
              userinfo: userinfo,
              role: role,
              page: role
            })
            if (userinfo.phone) {
              var sn = userinfo.phone.substring(0, 3) + "****" + userinfo.phone.substring(7, 11);
              _this.setData({
                sn: sn
              })
            }
           // _this.getPersons(user.id);
            if (role == 1 || role == 3) {
              util.request({
                url: 'wx/user/agency/' + user.id,
                method: 'POST',
                success: function (res) {
                  if (res.data.ret == 1) {
                    var userinfo = res.data.data;
                    var label = [];
                    if (userinfo.manager.label) {
                      label = userinfo.manager.label.split(" ");
                    }
                    var logo = userinfo.manager.agency.logo;
                    if (logo) {
                      logo = config.picUrl + logo
                    } else {
                      logo = userinfo.headUrl
                    }
                    _this.setData({
                      userinfo: userinfo,
                      agencyId: userinfo.manager.agencyId,
                      agencyLogo: logo,
                      label: label
                    })
                  }
                }
              });
             
            }
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

  }
})