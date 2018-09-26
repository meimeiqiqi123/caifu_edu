var config = require('../../utils/config.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arrimg: [],           // 上传img的attr     => 页面显示的img                  
    len: 10,              // 上传的img的最大的length
    index: 0,         // 上传完成的个数
    agencyId:0,
    courses_index: 0,
    courseId: 0,
    currentId: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      agencyId:options.agencyId
    })
    this.getCourses(options.userId);
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
  courseChange: function (e) {
    var courses_index = e.detail.value;
    this.setData({
      courses_index: e.detail.value,
      courseId: this.data.courses[courses_index].id
    })
  },
  getCourses: function (userId) {
    var _this = this;
    util.request({
      url: 'wx/course/user/' + userId,
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          if (res.data.data.length > 0) {
            _this.setData({
              courses: res.data.data,
              courseId: res.data.data[0].id
            })
          }
         
        }
      }
    });
  },
  closeImgFn: function (e) {
    var doId = e.currentTarget.id;      // 对应的img的唯一id
    var doarrimg = this.data.arrimg;    // 页面显示的img the list    
    var doindex = this.data.index;   // 上传显示的个数
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
      count: 10,
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
  upload:function(e){
    var userId = wx.getStorageSync('userInfo').wxInfo.id;
    var arrimg = this.data.arrimg;
    if (arrimg.length == 0) {
      this.setData({
        showtooltip: true,
        tooltip: '请选择照片'
      })
      return;
    }
    var courseId = this.data.courseId;
    if (courseId == 0) {
      this.setData({
        showtooltip: true,
        tooltip: '请选择课程'
      })
      return;
    }
    this.setData({
      subdisabled: true
    })
    wx.showLoading({
      title: '上传中'
    });
    var _this = this;
    for(var i = 0; i < arrimg.length;i++){
      var path = arrimg[0];
      var index = 0;
      if (i == arrimg.length-1){
        index = 1
      }
      // 提交信息
      wx.uploadFile({
        url: config.requestUrl + 'wx/manager/upload',
        filePath: path,
        name: 'imageFile',
        formData: {
          userId: userId,
          agencyId: _this.data.agencyId,
          courseId: courseId,
          index:index
        },
        success: function (res) {
          var data = JSON.parse(res.data);
          if (data.ret == 1) {
            if (index==1){
              wx.hideLoading();
              wx.showToast({
                title: '上传成功',
                icon: 'success',
                duration: 2000
              })
              _this.setData({
                subdisabled: false,
                arrimg: [],
                index: 0
              })
            }
 
          } else {
            wx.hideLoading();
            _this.setData({
              subdisabled: false,
              showtooltip: true,
              tooltip: '上传失败,请重新上传'
            })
            return;
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
    }
  }

})