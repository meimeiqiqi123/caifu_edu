const TITLE_HEIGHT = 30
const config = require('../../utils/config.js');
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl:config.picUrl,
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
    teachers:[],
    title:'添加班级',
    animationData: '',
    showModalStatus: false,
    t_list:[],
    toView: '',
    scrollTop: 0,
    listHeight: [],
    currentTIndex: 0,
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
  returnb:function(e){
    this.hideModal();
  },
  selectTeacher: function (e) {
    if(this.data.teachers.length>0){
      this.setData({
        t_list: this._normalizeSinger(this.data.teachers),
      })
      this.showModal();
      this._calculateHeight();
    }else{
      this.setData({
        showtooltip: true,
        tooltip: '暂无老师'
      })
      return;
    }

  },
  selectThis: function (e) {
    var teachers = this.data.teachers;
    var id = e.currentTarget.dataset.id;
    for (var i = 0; i < teachers.length; i++) {
      if (id == teachers[i].id) {
        if (teachers[i].check){
          teachers[i].check = false
        }else{
          teachers[i].check = true
        }
      }
    }
    this.setData({
      teachers: teachers,
      t_list: this._normalizeSinger(teachers),
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
    this.hideModal();
  },

  //选择老师列表 仿微信通信录
  _normalizeSinger:function(list) {
    //歌手列表渲染
    let map = {

    }
    list.forEach((item, index) => {
      const key = item.surname
      if (!map[key]) {
        map[key] = {
          title: key,
          items: []
        }
      }
      map[key].items.push({
        name: item.name,
        avatar: item.headUrl,
        id:item.id,
        check:item.check
      })
    })
    // 为了得到有序列表，我们需要处理 map
    let ret = []
    for (let key in map) {
      let val = map[key]
      if (val.title.match(/[a-zA-Z]/)) {
        ret.push(val)
      }
    }
    ret.sort((a, b) => {
      return a.title.charCodeAt(0) - b.title.charCodeAt(0)
    })
    return ret
  },
  scroll: function (e) {
    var newY = e.detail.scrollTop;
    this.scrollY(newY);
  },
  scrollY:function(newY) {
    const listHeight = this.data.listHeight;
    // 当滚动到顶部，newY>0
    if (newY == 0 || newY < 0) {
      this.setData({
        currentTIndex: 0,
        fixedTitle: ''
      })
      return
    }
    // 在中间部分滚动
    for (let i = 0; i < listHeight.length - 1; i++) {
      let height1 = listHeight[i]
      let height2 = listHeight[i + 1]
      if (newY >= height1 && newY < height2) {
        this.setData({
          currentTIndex: i,
          fixedTitle: this.data.t_list[i].title
        })
        this.fixedTt(height2 - newY);
        return
      }
    }
    // 当滚动到底部，且-newY大于最后一个元素的上限
    this.setData({
      currentTIndex: listHeight.length - 2,
      fixedTitle: this.data.t_list[listHeight.length - 2].title
    })
  },
  fixedTt: function(newVal) {
    let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
    if (this.data.fixedTop === fixedTop) {
      return
    }
    this.setData({
      fixedTop: fixedTop
    })
  },
  _calculateHeight: function() {
    var lHeight = [],
      that = this;
    let height = 0;
    lHeight.push(height);
    var query = wx.createSelectorQuery();
    query.selectAll('.list-group').boundingClientRect(function (rects) {
      var rect = rects,
        len = rect.length;
      for (let i = 0; i < len; i++) {
        height += rect[i].height;
        lHeight.push(height)
      }

    }).exec();
    var calHeight = setInterval(function () {
      if (lHeight != [0]) {
        that.setData({
          listHeight: lHeight
        });
        clearInterval(calHeight);
      }
    }, 1000)
  },
  scrollToview: function(e) {
    var id = e.target.dataset.id;
    this.setData({
      toView: id
    })

  },

  showModal: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    this._calculateHeight();
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
    
  },
  hideModal: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },

})