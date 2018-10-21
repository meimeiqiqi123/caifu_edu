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
    showDes:false,
    courseCount: 0,
    count1: 0,
    count2: 0,
    length1: 0,
    length2: 0,
    agencyId: null,
    agencyLogo:'',
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
    role:0,
    page:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var userinfo = wx.getStorageSync('userInfo');
    if(userinfo){
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
            _this.getPersons(user.id);
            if(role == 1 || role ==3){
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
                    if(logo){
                      logo = config.picUrl + logo
                    }else{
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
              _this.getCourseCount(user.id);
              _this.getStudentCount(user.id);
              _this.getTopics(user.id);
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
    var role = this.data.role;
    var page = this.data.page;
    if(role == 1){
      if(page == 0){
        this.setData({
          page:1
        })
      }else{
        this.setData({
          page:0
        })
      }
    }else if(role == 2){

    }else if(role == 3){
      if (page == 0) {
        this.setData({
          page: 3
        })
      } else {
        this.setData({
          page: 0
        })
      }
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
              zan: zans.up ? zans.up:0,
              count: zans.count ? zans.count:0
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
  publish: function () {
    var agencyId = this.data.userinfo.manager.agencyId;
    if (agencyId) {
      wx.navigateTo({
        url: '../publish/publish?agencyId=' + agencyId,
      })
    }
  },

  publish_p:function(e){
    var index = e.currentTarget.dataset.id;
    var pic = this.data.pics[index];
    var agencyId = pic.picture.agencyId;
    if(agencyId){
      wx.navigateTo({
        url: '../p_publish/p_publish?url=' + pic.picture.url+'&agencyId='+agencyId,
      })
    }
    
  },
  gotoOrder:function(e){
    var status = e.currentTarget.dataset.id;
    if(status == -1){
      wx.navigateTo({
        url: '../myorder/myorder',
      })
    }else{
      wx.navigateTo({
        url: '../myorder/myorder?status=' + status,
      })
    }
    
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
  },
  uploadPic: function (e) {
    var agencyId = this.data.userinfo.manager.agencyId;
    var managerId = this.data.userinfo.managerId;
    if (agencyId) {
      wx.navigateTo({
        url: '../upload_pic/upload_pic?agencyId=' + agencyId + '&managerId=' + managerId,
      })
    }

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
  kaoqin: function (e) {
    wx.navigateTo({
      url: '../course_list/course_list',
    })
  },
  getStudentCount: function (userId) {
    var _this = this;
    util.request({
      url: 'wx/student/course/scale/' + userId,
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          _this.setData({
            count1: res.data.data,
            count2: res.data.order,
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
      data: {
        offset: 0,
        pageSize: 2
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
  addManager: function (e) {
    if(this.data.agencyId){
      wx.navigateTo({
        url: '../teacher_m/teacher_m?agencyId=' + this.data.agencyId,
      })
    }
    
  },
  addStudent: function () {
    if (this.data.agencyId) {
      wx.navigateTo({
        url: '../student_a/student_a?agencyId=' + this.data.agencyId,
      })
    }
    
  },

  addCourse: function (e) {
    if (this.data.agencyId) {
      wx.navigateTo({
        url: '../course_a/course_a?agencyId=' + this.data.agencyId,
      })
    }
   
  },
  addGrade: function () {
    if (this.data.agencyId) {
      wx.navigateTo({
        url: '../grade_a/grade_a?agencyId=' + this.data.agencyId,
      })
    }
    
  },
  chooseImage: function () {   // 上传的fn
    var _this = this;
    // 调取手机的上传
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {       // 成功
        var tempFilePaths = res.tempFilePaths[0].toString();
        if (tempFilePaths) {
          //上传
          // 提交信息
          wx.uploadFile({
            url: config.requestUrl + 'wx/agency/logo/' + _this.data.agencyId,
            filePath: tempFilePaths,
            name: 'imageFile',
            success: function (res) {
              var data = JSON.parse(res.data);
              if (data.ret == 1) {
                _this.setData({
                  agencyLogo: config.picUrl + data.data
                })
                wx.showToast({
                  title: '上传成功',
                  icon: 'success',
                  duration: 2000
                })
              } 
            },
          });

        }
      }
    })
  },
  gotoOrder:function(e){
    var status = e.currentTarget.dataset.status;
    var agencyId = this.data.agencyId;
    if(agencyId){
      wx.navigateTo({
        url: '../agency_order/agency_order?status=' + status + '&agencyId=' + agencyId,
      })
    }
    
  }
})