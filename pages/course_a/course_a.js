var config = require('../../utils/config.js');
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: config.picUrl,
    agencyId:0,
    currentTabsIndex: 1,
    currentIndex: 0,
    tooltip: '',
    agencyId: 0,
    currentId: 0,
    subdisabled: false,
    courses:null,
    title: '添加课程',
    location:'',
    courseName:'',
    realAmount:'',
    scales:[{id:1,name:'普通课'},{id:2,name:'体验课'}],
    arrimg: [],           // 上传img的attr     => 页面显示的img                  
    len: 1,              // 上传的img的最大的length
    index: 0,         // 上传完成的个数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      agencyId: options.agencyId
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
  scaleChange: function (e) {
    var currentIndex = e.detail.value;
    this.setData({
      currentIndex: e.detail.value,
      scale: this.data.scales[currentIndex].id
    })
  },
  closeImgFn: function (e) {
    var doId = e.currentTarget.dataset.id;      // 对应的img的唯一id
    var doarrimg = this.data.arrimg;    // 页面显示的img the list    
    var doindex = this.data.index;   // 上传显示的个数
    var suArr = this.data.successArr;      // 发送的img的list的数组
    doarrimg.splice(doarrimg[doId], 1);     // 删除当前的下标的数组
    doindex--;       // 删除一个上传的个数就递减
    this.setData({
      arrimg: doarrimg,
      index: doindex
    })
  },
  chooseimage: function (e) {
    this.chooseImageFn();   // 上传的fn
  },
  chooseImageFn: function () {   // 上传的fn
    var _this = this;
    var len = _this.data.len;   // 获取data的上传的总个数
    var index = _this.data.index;  // 获取data的上传完成的个数
    var arr = _this.data.arrimg;         // 获取data的img的list 

    // 调取手机的上传
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {       // 成功
        //var tempFilePaths = res.tempFilePaths[0].toString();
        //len == index ? index = 7 : index++;

        if (_this.data.index <= len) {// 上传之前的验证个数
          var count = len - _this.data.index;
          var length = res.tempFilePaths.length;
          var sum = length < count ? length : count
          for (var i = 0; i < sum; i++) {
            arr.push(res.tempFilePaths[i]);
            index++
          }
          //arr.push(tempFilePaths);
          _this.setData({
            arrimg: arr,
            index: index
          })

        }
      }
    })
  },
  catClick: function (event) {
    var _this = this;
    var sid = event.currentTarget.dataset.sid;
    if (sid == 1) {
      _this.setData({
        title: '添加课程'
      })
    }
    if (sid == 2) {
      _this.setData({
        title: '课程列表'
      })
      if (_this.data.currentTabsIndex!=2){
        _this.loadCourse();
      }
    }
    _this.setData({
      currentTabsIndex: sid
    })
  },
  loadCourse: function (e) {
    var _this = this;
    util.request({
      url: 'wx/course/agency/' + _this.data.agencyId,
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          _this.setData({
            courses: res.data.data
          })
        }
      }
    });
  },
  changeName: function (e) {
    this.setData({
      courseName: e.detail.value
    })
  },
  changeLocation: function (e) {
    this.setData({
      location: e.detail.value
    })
  },
  changeAmount: function (e) {
    this.setData({
      realAmount: e.detail.value
    })
  },
  submitInfo: function (e) {
    var courseName = this.data.courseName;
    if (courseName == '') {
      this.setData({
        showtooltip: true,
        tooltip: '请输入课程名称'
      })
      return;
    }
   
    var location = this.data.location;
    if (location == '') {
      this.setData({
        showtooltip: true,
        tooltip: '请输入上课地址'
      })
      return;
    }
    var arrimg = this.data.arrimg;
    if (arrimg.length == 0) {
      this.setData({
        showtooltip: true,
        tooltip: '请上传课程图片'
      })
      return;
    }
    this.setData({
      subdisabled: true
    })
   // var scale = this.data.scales[this.data.currentIndex].id;
    var agencyId = this.data.agencyId;
    var path = arrimg[0];
    var _this = this;
    wx.showLoading({
      title: '添加中'
    });
    // 提交信息
    wx.uploadFile({
      url: config.requestUrl + 'wx/course/add',
      filePath: path,
      name: 'imageFile',
      formData: {
        courseName: courseName,
        agencyId: _this.data.agencyId,
        location:location
      },
      success: function (res) {
        var data = JSON.parse(res.data);
        wx.hideLoading();
        if (data.ret == 1) {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000
          })
          _this.setData({
            subdisabled: false,
            courseName: '',
            realAmount: '',
            arrimg: [], 
            index:0
          })
        } else {
          _this.setData({
            subdisabled: false,
            showtooltip: true,
            tooltip: '添加失败,请重新创建'
          })
        }
      },
      fail: function () {
        wx.hideLoading();
        that.setData({
          subdisabled: false
        })
        console.log("fail");
      }
    });

  },
  delCourse: function (e) {
    var sid = e.currentTarget.dataset.id;
    this.setData({
      currentId: sid,
      showmodal: true,
      tooltip: '确认删除该课程？'
    })
  },
  confirmDelete: function (e) {
    var _this = this;
    util.request({
      url: 'wx/course/del/' + this.data.currentId,
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000
          })
          _this.loadCourse();
        }
      }
    });
  },
})