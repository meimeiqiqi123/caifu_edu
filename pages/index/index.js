var config = require('../../utils/config.js');
const app = getApp();
const util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    picUrl:config.picUrl,
    autioUrl: config.autioUrl,
    mp3:'music_1',
    topics: null,
    records: null,
    headUrl:'',
    zan:0,
    comment:0,
    currentId:0,
    Height: 0,
    top: 0,
    currentIndex:0,
    agency:'',
    topicDes:'',
    nickName:'',
    iszan:false,
    musicon:true,
    startPage: 1,
    recordNum: 10,
    total: 0,
    load: true,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userId = 0;
    var userInfo = wx.getStorageSync('userInfo');
    if(userInfo){
      userId = userInfo.wxInfo.id
    }
    this.setData({
      startPage: 1
    })
    var _this = this;
    util.request({
      url: 'wx/topic/all/',
      data:{
        startPage:1,
        recordNum:_this.data.recordNum,
        userId: userId
      },
      method: 'POST',
      success: function (res) {
        if (res.data.ret == 1) {
          if(res.data.data.length>0){
            var currentId = res.data.data[0].id;
            _this.setData({
              topics:res.data.data,
              currentId: currentId,
              headUrl: res.data.data[0].user.headUrl,
              nickName: res.data.data[0].user.nickName,
              zan: res.data.data[0].up ? res.data.data[0].up:0,
              topicDes:res.data.data[0].content,
              agency:res.data.data[0].agency.name,
              total:res.data.order
            })
            if (res.data.data[0].iszan == 1){
              _this.setData({
                iszan:true
              })
            }
            //_this.getRecords(currentId);
           // _this.getUserRecord(currentId)
          }
        }
      }
    });
  },
  changeScale: function (e) {
    var index = e.detail.currentItemId;
    var topic = this.data.topics[index];
    this.setData({
      currentIndex: index,
      currentId: topic.id,
      headUrl:topic.user.headUrl,
      zan:topic.up,
      topicDes: topic.content,
      agency: topic.agency.name,
      nickName:topic.user.nickName
    })
    this.getRecords(topic.id);
    //this.getUserRecord(topic.id);
    if (topic.iszan == 1) {
      this.setData({
        iszan: true
      })
    }else{
      this.setData({
        iszan: false
      })
    }
  },
  isInArray: function (id) {
    for (var i = 0; i < this.data.ss.length; i++) {
      if (id == this.data.ss[i]) {
        return true;
      }
    }
    return false;
  },
  getRecords:function(topicId){
    var _this = this;
    // 查询评论
    util.request({
      url: 'wx/record/topic/' + topicId,
      method: 'POST',
      data: {
        startPage: 1,
        recordNum: 20
      },
      showLoading: false,
      success: function (res) {
        if (res.data.ret == 1) {
          if (res.data.data) {
            _this.setData({
              records: res.data.data,
              comment:res.data.data.length
            })
          }
        }
      }
    });
  },
  
  imgHeight: function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
    var winHei = wx.getSystemInfoSync().windowHeight; //获取当前屏幕的宽度
    var imgh = e.detail.height;//图片高度
    var imgw = e.detail.width;//图片宽度
    if (imgh < imgw) {
      //this.data.ss.push(e.currentTarget.dataset.id)
    }
    var swiperH = winWid * imgh / imgw + "px"//等比设置swiper的高度。 即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度  ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
    this.setData({
      Height: winHei + "px"//设置高度
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  audioPlay: function () {
    this.audioCtx.play()
  },
  audioPause: function () {
    this.audioCtx.pause()
  },
  audioEnd:function(){
    this.audioCtx.pause()
  },
  funended:function(){
    
    this.audioCtx = wx.createAudioContext('myAudio');
    var i = Math.floor(5 * Math.random())+1;
    this.setData({
      mp3: 'music_' + i + '.mp3'
    })

    this.audioPlay();
    console.log("audio end");
  },
  funplay: function () {
    console.log("audio play");
  },
  funpause: function () {
    console.log("audio pause");
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.globalData.page='index';
    /*if (app.globalData.index != 0) {
      var options = {};
      options.showLoading = false;
      this.onLoad(options);
    }
    app.globalData.index++;
    */
    if(this.data.musicon){
      this.audioCtx = wx.createAudioContext('myAudio');
      var i = Math.floor(5 * Math.random())+1;
      console.log(i)
      this.setData({
        mp3:'music_'+i+'.mp3'
      })
      
      this.audioPlay();
    }
    app.globalData.page = 'index';
    var _this = this;
    var interval = setInterval(function () {
      var page = app.globalData.page;
      if(page == ''){
        _this.audioEnd();
      }
    }, 1000);
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
    this.onLoad();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    return {
      
      success: function (res) {
        console.log(111111111111111)
      },
      fail: function (res) {
        console.log(22222222222222)
      }
    }

  },
  /*是否点赞 */
  getUserRecord:function(topicId){
    var userInfo = wx.getStorageSync('userInfo');
    var _this = this;
    if(userInfo){
      util.request({
        url: 'wx/record/iszan/' + topicId,
        method: 'POST',
        data:{userId:userInfo.wxInfo.id},
        showLoading: false,
        success: function (res) {
          if (res.data.ret == 1) {
            if (res.data.data) {
              _this.setData({
                iszan:true
              })
            }else{
              _this.setData({
                iszan: false
              })
            }
          }
        }
      });
    }
   
  },
  sendMessage:function(e){
   
    var topic = this.data.topics[this.data.currentIndex];
    wx.navigateTo({
      url: '../comment_list/comment_list?topicId=' + topic.id + '&url=' + topic.url,
    })
    this.audioEnd();
  },
  
  dianzan:function(){
    var userInfo = wx.getStorageSync('userInfo');
    if(userInfo){
      if(this.data.iszan){
        this.setData({
          showtooltip: true,
          tooltip: '已经点赞,请勿重复点赞'
        })
        return;
      }
      var userId = userInfo.wxInfo.id;
      var topicId = this.data.currentId;
      var _this = this;
      util.request({
        url: 'wx/topic/zan/' + topicId,
        data: {
          userId: userId
        },
        showLoading: false,
        method: 'POST',
        success: function (res) {
          if (res.data.ret == 1) {
            wx.showToast({
              title: '点赞成功',
              icon: 'success',
              duration: 2000
            })
            var topics = _this.data.topics;
            var current = topics[_this.data.currentIndex];
            current.iszan = true;
            _this.setData({
              zan: res.data.data,
              iszan:true,
              topics: topics
            })
          }
        }
      });
    }else{
      this.setData({
        showtooltip: true,
        tooltip: '请登陆'
      })
    }
    
  },
  profilePage:function(e){

    var topic = this.data.topics[this.data.currentIndex];
    var role = topic.user.role;
    var userId = topic.userId;
   
    if(role == 0){
      wx.navigateTo({
        url: '../person_profile/person_profile?userId='+userId,
      })
    }else{
      wx.navigateTo({
        url: '../tea_profile/tea_profile?userId=' + userId,
      })
    }
    this.audioEnd();
  },
  musicChange:function(e){
    this.setData({
      musicon: !this.data.musicon
    })
    if(this.data.musicon){
      this.audioPlay();
    }else{
      this.audioPause();
    }
  },
  loadMore: function (e) {
    var topics = this.data.topics.length;
    if (!this.data.load || topics >= this.data.total) {
      return;
    }
    this.setData({
      load: false,
    })
    var _this = this;
    var startPage = _this.data.startPage + 1;
    util.request({
      url: 'wx/topic/all' ,
      showLoading: false,
      data: {
        startPage: startPage,
        recordNum: _this.data.recordNum
      },
      method: 'POST',
      success: function (result) {
        if (result.data.data) {
          _this.setData({
            topics: _this.data.topics.concat(result.data.data),
            startPage: startPage,
            load: true
          })
        } else {
          _this.setData({
            load: true,
          })
        }
      }

    })
  },
})