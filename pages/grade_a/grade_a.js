const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTabsIndex:1,
    gradeName:'',
    gradeNumber:'',
    currentIndex:0,
    tooltip:'',
    agencyId:0,
    grades:null,
    courses:null,
    courses_index:0,
    courseId:0,
    currentId:0,
    subdisabled:false,
    selectIds: '',
    selectname: '',
    teachers:null,
    title:'添加班级'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      agencyId:options.agencyId
    })
    this.loadTeacher();
    this.getCourses(options.agencyId);
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
  editGrade:function(e){
    var index = e.currentTarget.dataset.id;
    var grade = this.data.grades[index];





    
  },
  courseChange: function (e) {
    var courses_index = e.detail.value;
    this.setData({
      courses_index: e.detail.value,
      courseId: this.data.courses[courses_index].id
    })
  },
  getCourses: function (agencyId) {
    var _this = this;
    util.request({
      url: 'wx/course/agency/' + agencyId,
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          
          if (res.data.data.length>0){
            _this.setData({
              courses: res.data.data,
              courseId: res.data.data[0].id
            })
          }
        }
      }
    });
  },
  delGrade:function(e){
    var sid = e.currentTarget.dataset.id;
    this.setData({
      currentId: sid,
      showmodal:true,
      tooltip:'确认删除该班级？'
    })
  },
  confirmDelete:function(e){
    var _this = this;
    util.request({
      url: 'wx/grade/del/' + this.data.currentId,
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1000
          })
          _this.loadData();
        }
      }
    });
  },
  catClick: function (event) {
    var _this = this;
    var sid = event.currentTarget.dataset.sid;
    if(sid == 1){
      _this.setData({
        title:'添加班级'
      })
    }
    if(sid==2){
      _this.setData({
        title: '班级列表'
      })
      if (_this.data.currentTabsIndex!=2){
        _this.loadData();
      }
    }
    _this.setData({
      currentTabsIndex: sid
    })
  },
  loadData:function(e){ 
    var _this = this;
    util.request({
      url: 'wx/grade/agency/' + _this.data.agencyId,
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
  changeName:function(e){
    this.setData({
      gradeName:e.detail.value
    })
  },
  changeNumber:function(e){
    this.setData({
      gradeNumber: e.detail.value
    })
  },
  submitInfo:function(e){
    var gradeName = this.data.gradeName;
    if(gradeName == ''){
        this.setData({
          showtooltip:true,
          tooltip:'请输入班级名称'
        })
        return;
    }
    var gradeNumber = this.data.gradeNumber;
    if (gradeNumber == '') {
      this.setData({
        showtooltip: true,
        tooltip: '请输入班级编号'
      })
      return;
    }
    var courseId = this.data.courseId;
    if(courseId == 0){
      this.setData({
        showtooltip: true,
        tooltip: '请选择课程'
      })
      return;
    }
    var selectIds = this.data.selectIds;
    if (selectIds == '') {
      this.setData({
        showtooltip: true,
        tooltip: '请选择老师'
      })
      return;
    }
    this.setData({
      subdisabled: true
    })
    var _this = this;
    util.request({
      url: 'wx/grade/add',
      data: {
        name: gradeName,
        number: gradeNumber,
        courseId: courseId,
        agencyId: _this.data.agencyId,
        managerIds: selectIds
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          wx.showToast({
            title: '创建成功',
            icon: 'success',
            duration: 2000
          })
          _this.setData({
            subdisabled: false,
            gradeName: '',
            gradeNumber: ''
          })
        } else {
          _this.setData({
            subdisabled: false,
            showtooltip: true,
            tooltip: '创建失败,请重新创建'
          })
        }
        
      }
    });
  },
  loadTeacher: function (e) {
    var _this = this;
    util.request({
      url: 'wx/manager/agency/3/' + _this.data.agencyId,
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          _this.setData({
            teachers: res.data.data
          })
        }
      }
    });
  },
  selectTeacher: function (e) {
    this.setData({
      showselector: true
    })
  },
  selectThis: function (e) {
    var teachers = this.data.teachers;
    var id = e.currentTarget.dataset.id;
    for (var i = 0; i < teachers.length; i++) {
      if (id == teachers[i].id) {
        teachers[i].check = true
      }
    }
    this.setData({
      teachers: teachers
    })
  },
  delThis: function (e) {
    var teachers = this.data.teachers;
    var id = e.currentTarget.dataset.id;
    for (var i = 0; i < teachers.length; i++) {
      if (id == teachers[i].id) {
        teachers[i].check = false
      }
    }
    this.setData({
      teachers: teachers
    })
  },
  confirmSelect: function (e) {
    var selectIds = [];
    var selectname = [];
    var teachers = this.data.teachers;
    for (var i = 0; i < teachers.length; i++) {
      if (teachers[i].check) {
        selectIds.push(teachers[i].id);
        selectname.push(teachers[i].name)
      }
    }
    this.setData({
      selectIds: selectIds.join(","),
      selectname: selectname.join(",")
    })
  },
})