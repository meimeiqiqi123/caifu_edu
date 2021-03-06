var config = require('../../utils/config.js');
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noteNowLen:0,
    noteMaxLen:100,
    content:'',
    arrimg: [],           // 上传img的attr     => 页面显示的img                  
    len: 1,              // 上传的img的最大的length
    index: 0,         // 上传完成的个数
    successArr: [], 
    agencyId:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  this.setData({
    agencyId:options.agencyId
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
  bindTextAreaChange: function (e) {
    var that = this
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > that.data.noteMaxLen)
      return;
    that.setData({
      content: value, noteNowLen: len
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
  publish:function(e){
    var content = this.data.content;
    if (content == '') {
      this.setData({
        showtooltip: true,
        tooltip: '请输入说说'
      })
      return;
    }
    var arrimg = this.data.arrimg;
    if (arrimg.length == 0) {
      this.setData({
        showtooltip: true,
        tooltip: '请上传照片'
      })
      return;
    }
    this.setData({
      subdisabled: true
    })
    var userId = wx.getStorageSync('userInfo').wxInfo.id;
    var path = arrimg[0];
    var _this = this;
    wx.showLoading({
      title: '发布中'
    });
    // 提交信息
    wx.uploadFile({
      url: config.requestUrl + 'wx/topic/add',
      filePath: path,
      name: 'imageFile',
      formData: {
        userId: userId,
        agencyId:_this.data.agencyId,
        content: content
      },
      success: function (res) {
        var data = JSON.parse(res.data);
        wx.hideLoading();
        if (data.ret == 1) {
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            duration: 2000
          })
          _this.setData({
            subdisabled: false,
            content: '',
            arrimg: [],
            index: 0,
            noteNowLen:0
          })
        } else {
          _this.setData({
            subdisabled: false,
            showtooltip: true,
            tooltip: '发布失败,请重新发布'
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
  }
})