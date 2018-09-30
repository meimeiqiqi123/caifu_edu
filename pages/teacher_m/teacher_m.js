const app = getApp();
const util = require('../../utils/util.js');
var config = require('../../utils/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl:config.picUrl,
    currentTabsIndex: 1,
    teacherName: '',
    phone: '',
    currentIndex: 0,
    tooltip: '',
    agencyId: 0,
    teachers: null,
    currentId: 0,
    subdisabled: false,
    tea_select:'',
    selectIds:'',
    selectname:'',
    title:'编辑老师信息',
    description:'',
    age:'',
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
  editTeacher:function(e){
    var index = e.currentTarget.dataset.id;
    var tea = this.data.teachers[index];
    var arr = [];
    arr.push(this.data.picUrl+tea.headUrl)
    this.setData({
      currentId:tea.id,
      teacherName: tea.name,
      phone: tea.phone,
      age:tea.age,
      description:tea.description,
      arrimg:arr,
      index:1,
      currentTabsIndex: 1,
      title:'编辑老师信息'
    })
    
  },
  delTeacher: function (e) {
    var sid = e.currentTarget.dataset.id;
    this.setData({
      currentId: sid,
      showmodal: true,
      tooltip: '确认删除该老师？'
    })
  },
  confirmDelete: function (e) {
    var _this = this;
    util.request({
      url: 'wx/manager/del/' + this.data.currentId,
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1000
          })
          _this.loadTeacher();
        } else {
          _this.setData({
            showtooltip: true,
            tooltip: res.data.data,
          })
        }
      }
    });
  },
  catClick: function (event) {
    var _this = this;
    var sid = event.currentTarget.dataset.sid;
    if(sid == 1){
      _this.setData({
        title:'编辑老师信息',
        teacherName: '',
        phone: '',
        age: '',
        description: '',
        arrimg: [],
        index: 0,
        currentId: 0,
      })
     
    }
    if (sid == 2) {
      _this.setData({
        title: '老师列表'
      })
      if (_this.data.currentTabsIndex!=2){
        _this.loadTeacher();
      }
    }
    if (sid == 3) {
      _this.setData({
        title: '考勤管理'
      })
    }
    _this.setData({
      currentTabsIndex: sid
    })
  },
  loadTeacher: function (e) {
    var _this = this;
    util.request({
      url: 'wx/manager/agency/3/' + _this.data.agencyId,
      method: 'POST',
      showLoading: false,
      success: function (res) {
        if (res.data.ret == 1) {
          _this.setData({
            teachers: res.data.data
          })
        }
      }
    });
  },
  changeDes: function (e) {
    this.setData({
      description: e.detail.value
    })
  },
  changeName: function (e) {
    this.setData({
      teacherName: e.detail.value
    })
  },
  changePhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  changeAge:function(e){
    this.setData({
      age:e.detail.value
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






  submitInfo: function (e) {
    var teacherName = this.data.teacherName;
    if (teacherName == '') {
      this.setData({
        showtooltip: true,
        tooltip: '请输入老师姓名'
      })
      return;
    }
    var phone = this.data.phone;
    if (phone == '') {
      this.setData({
        showtooltip: true,
        tooltip: '请输入联系方式'
      })
      return;
    }
    var age = this.data.age;
    if (age == '') {
      this.setData({
        showtooltip: true,
        tooltip: '请输入教龄'
      })
      return;
    }
    var arrimg = this.data.arrimg;
    if (arrimg.length == 0) {
      this.setData({
        showtooltip: true,
        tooltip: '请上传老师头像'
      })
      return;
    }
    var description = this.data.description;
    this.setData({
      subdisabled: true
    })
    var _this = this;
    var path = arrimg[0];
    wx.showLoading({
      title: '上传中'
    });
    // 提交信息
    wx.uploadFile({
      url: config.requestUrl + 'wx/manager/add',
      filePath: path,
      name: 'imageFile',
      formData: {
        id: _this.data.currentId,
        name: teacherName,
        phone: phone,
        agencyId: _this.data.agencyId,
        description: description,
        age: age
      },
      success: function (res) {
        var data = JSON.parse(res.data);
        wx.hideLoading();
        if (data.ret == 1) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          })
          if (_this.data.currentId != 0){
            _this.setData({
              subdisabled: false,
              currentTabsIndex: 2,
              title: '老师列表'
            })
            _this.loadTeacher();
          }else{
            _this.setData({
              subdisabled: false,
              teacherName: '',
              phone: '',
              age: '',
              description: '',
              arrimg: [],
              index: 0,
              currentId: 0,
            })
          }
          
         
        } else {
          _this.setData({
            subdisabled: false,
            showtooltip: true,
            tooltip: res.data?res.data:'上传失败,请重新上传'
          })
        }
      },
      fail: function (res) {
        var id = _this.data.currentId;
        if (id&&id!=0){
          // 修改
          util.request({
            url: 'wx/manager/m' ,
            method: 'POST',
            data: {
              id: _this.data.currentId,
              name: teacherName,
              phone: phone,
              description: description,
              age: age
              },
            showLoading:false,
            success: function (res) {
              wx.hideLoading();
              if (res.data.ret == 1) {
                wx.showToast({
                  title: '保存成功',
                  icon: 'success',
                  duration: 2000
                })
                _this.setData({
                  subdisabled: false,
                  currentTabsIndex: 2,
                  title: '老师列表'
                })
                _this.loadTeacher();
                
            }
            },
            fail:function(){
              _this.setData({
                subdisabled: false
              })
            }
          });
        }else{
          _this.setData({
            subdisabled: false
          })
        }


        

      }
    });


    
  }
})