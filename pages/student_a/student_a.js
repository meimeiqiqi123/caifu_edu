var config = require('../../utils/config.js');
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTabsIndex: 1,
    title: '添加学生',
    agencyId:0,
    students:null,
    studentName:'',
    phone:'',
    gradeIndex: 0,
    grades:null,
    sourceIndex: 0,
    source: [{id:1,name:'采赋'},{id:2,name:'大众点评'},{id:3,name:'家长推荐'}],
    arrimg: [],           // 上传img的attr     => 页面显示的img                  
    len: 1,              // 上传的img的最大的length
    index: 0,         // 上传完成的个数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    this.setData({
      agencyId: options.agencyId
    })
    util.request({
      url: 'wx/grade/agency/' + options.agencyId,
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          _this.setData({
            grades: res.data.data
          })
        }
      }
    });
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
  gradeChange:function(e) {
    this.setData({
      gradeIndex: e.detail.value
    })
  },
  sourceChange: function(e) {
    this.setData({
      sourceIndex: e.detail.value
    })
  },
  changeName: function(e) {
    this.setData({
      studentName: e.detail.value
    })
  },
  changePhone: function (e) {
    this.setData({
      phone: e.detail.value
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
    _this.setData({
      currentTabsIndex: sid
    })
    if (sid == 1) {
      _this.setData({
        title: '添加学生'
      })
    }
    if (sid == 2) {
      _this.setData({
        title: '学生管理'
      })
    }
  },
  submitInfo: function (e) {
    var studentName = this.data.studentName;
    if (studentName == '') {
      this.setData({
        showtooltip: true,
        tooltip: '请输入学生姓名'
      })
      return;
    }
    var phone = this.data.phone;
    var phone_d = this.checkPhone(phone);
    if (phone_d != 1) {
      this.setData({
        showtooltip: true,
        tooltip: phone_d
      })
      return;
    }
    var arrimg = this.data.arrimg;
    if (arrimg.length == 0) {
      this.setData({
        showtooltip: true,
        tooltip: '请上传学生头像'
      })
      return;
    }
    this.setData({
      subdisabled: true
    })
    var grade = this.data.grades[this.data.gradeIndex].id;
    var source = this.data.source[this.data.sourceIndex].id;
    var agencyId = this.data.agencyId;
    var path = arrimg[0];
    var _this = this;
    wx.showLoading({
      title: '上传中'
    });
    // 提交信息
    wx.uploadFile({
      url: config.requestUrl + 'wx/student/add',
      filePath: path,
      name: 'imageFile',
      formData: {
        stuName: studentName,
        phone: phone,
        gradeId: grade,
        source: source,
        agencyId: agencyId
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
            studentName: '',
            phone: '',
            arrimg: [],
            index: 0
          })
        } else {
          _this.setData({
            subdisabled: false,
            showtooltip: true,
            tooltip: '上传失败,请重新上传'
          })
        }
      },
      fail: function () {
        wx.hideLoading();
        _this.setData({
          subdisabled: false
        })
        console.log("fail");
      }
    });

  },
  checkPhone: function (phone) {
    if (phone.length == 0) {
      return '请输入手机号码！';
    }
    if (phone.length != 11) {
      return '请输入有效的手机号码！'
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
    if (!myreg.test(phone)) {
      return '请输入有效的手机号码！'
    }
    return '1'
  },
  loadData: function (e) {
    var _this = this;
    util.request({
      url: 'wx/student/agency/' + _this.data.agencyId,
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          _this.setData({
            students: res.data.data
          })
        }
      }
    });
  },
})