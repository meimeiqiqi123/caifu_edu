var config = require('../../utils/config.js');
const app = getApp();
const util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    picUrl:config.picUrl,
    userinfo: null,
    picNum:0,
    sn:'',
    zan:0,
    count:0,
    fans:0,
    pics:null, 
    showDes:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    if (wx.getStorageSync('userInfo')) {
      var userId = wx.getStorageSync('userInfo').wxInfo.id;
      util.request({
        url: 'wx/user/' + userId,
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
      this.getPersons(userId)
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
    app.globalData.page = '';
    if (app.globalData.person != 0) {
      this.onLoad();
    }
    app.globalData.person++
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
  jumppage:function(e) {
    wx.navigateTo({
      url: '../diary/diary?userId=' + this.data.userinfo.id
    })
  },
  login: function (e) {
    var that = this;
    var canUser = wx.canIUse('button.open-type.getUserInfo');
    wx.showLoading({
      title: '登陆中',
    })
    if (canUser) {
      if (e.detail.userInfo) {
        util.saveUserInfo(e.detail.userInfo, function (res) {
          that.setData({
            userinfo: res.wxInfo
          })
          wx.navigateTo({
            url: '../bond/bond',
          })
        })
        wx.hideLoading();
      } else {
        wx.hideLoading();
        console.log("授权失败")
      }
    } else {
      app.login(function (res) {
        wx.hideLoading();
        that.setData({
          userinfo: res.wxInfo
        })
        wx.navigateTo({
          url: '../bond/bond',
        })
      });
    }


    
  },
  bond:function(e){
    var userinfo = wx.getStorageSync('userInfo');
    if(userinfo){
      wx.navigateTo({
        url: '../bond/bond',
      })
    }else{
      this.tooltips("请先登录")
    }
  },
  tooltips: function (str) {
    var that = this;
    that.setData({
      showtooltip: true,
      tooltip: str
    })
  },
  closetooltip: function (e) {
    this.setData({
      tooltip: ''
    })
  },
  switchRole:function(e){
    var role = this.data.userinfo.role;
    if(role == 3){
      wx.navigateTo({
        url: '../teacher/teacher',
      })
    }else if(role == 2){

    }else if(role == 1){
      wx.navigateTo({
        url: '../agency/agency',
      })
    }
  },
  getPersons: function (userId){
    var _this = this;
    util.request({
      url: 'wx/person/' + userId,
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          var pics = res.data.data;
          var zans = res.data.order;
          var fans = res.data.other;
          if(pics){
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
  publish:function(e){
    var index = e.currentTarget.dataset.id;
    var pic = this.data.pics[index];
    var agencyId = this.data.userinfo.manager.agencyId;
    if(agencyId){
      wx.navigateTo({
        url: '../p_publish/p_publish?url=' + pic.url+'&agencyId='+agencyId,
      })
    }
    
  },
  gotoOrder:function(e){
    var status = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../myorder/myorder?status=' + status,
    })
  },
  editDes:function(e){
    var userInfo = wx.getStorageSync('userInfo');
    if(userInfo){
      this.setData({
        showDes: true,
      })
    }else{
      this.setData({
        showtooltip: true,
        tooltip: '请登陆'
      })
    }
    
  },
  canceldes: function (e) {
    this.setData({
      showDes: false,
    })
  },
  desChange: function (e) {
    this.setData({
      signature: e.detail.value
    })
  },
  confirmdes: function (e) {
    var signature = this.data.signature;
    if (signature == '') {
      this.setData({
        showtooltip: true,
        tooltip: '请输入个性签名'
      })
      return;
    }
    var that = this;
    var userId = wx.getStorageSync('userInfo').wxInfo.id;
    util.request({
      url: 'wx/user/signature/'+userId,
      method: 'POST',
      data: {
        signature: signature,
      },
      success: function (res) {
        if (res.data.ret == 1) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
          var userinfo = that.data.userinfo;
          userinfo.signature = signature;
          that.setData({
            showDes: false,
            userinfo: userinfo
          })
        } else {
          console.log(res.data);
        }
      }
      
    })
  }
})