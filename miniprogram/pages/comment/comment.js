// pages/comment/comment.js
// 创建数据库对象
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value1:"",            //保存用户评论信息
    score:0,              //保存用户评论分数
    movieid:25779217,     //电影id
    detail:{},             //js对象当前电影信息
    images:[],             //保存图片
    fileIds:[]             //上传图片id
  },
  // 当用户输入内容在文本框触发事件
  onContentChange:function(event){
    //console.log(event.detail);
    this.setData({
      value1:event.detail
    })
  },
  // 打分
  onChangeScore:function(event){
    this.setData({
      score: event.detail
    })
    //console.log(event.detail)
  },
  // 选中图片并预览图片
  uploadFile:function(){
    // 1.选中图片
    wx.chooseImage({
      count:9,
      sizeType:["original","compressed"],
      sourceType:["camera","album"],
      success: (res)=>{  //选中成功
        // 临时路径
        var f = res.tempFilePaths;
        // 保存在images中
        this.setData({
          images:f
        })
      },
    })
  },
  // 发表评论
  submit:function(){
    // 功能
    // 1）.获取用户评论的信息
    // 2）.上传多张图片
    // 3）.将用户评论信息与图片fileId保存到云数据库
    // 1.在云数据库中创建集合comment  用户评论信息
    // 2.添加属性fileid：[]  上传文件id
    // 3.显示数据加载提示框
    // 判断
    if(this.data.images.length==0){
      // 1.提示信息
      wx.showToast({
        title: '请选择图片',
      })
      // 2.停止执行
      return;
    }
    wx.showLoading({
      title: '评论正在发表中...',
    });
    // 4.创建数组 rows 保存promise对象
    var rows = [];
    // 5.创建循环遍历每张选中的图片
    for (var i=0;i<this.data.images.length;i++){
      // 6.为每张图片创建promise对象完成上传一张图片
      rows.push(new Promise((resolve,reject)=>{
        // 6.1获取当前图片的名称
        var item = this.data.images[i];
        // 6.2获取后缀（拆分/搜索/正则表达式）
        var suffix = /\.\w+$/.exec(item)[0];
        // 6.3创建一个新的文件名  时间+随机数
        var newFile = new Date().getTime();
        newFile += Math.floor(Math.random()*9999);
        newFile += suffix;
        // 6.4上传一张图片
        wx.cloud.uploadFile({
          cloudPath:newFile,  //新文件名
          filePath:item,      //原文件名
          success:(res=>{
        // 6.5在data中添加数组 fileIds文件id
        // 6.6上传成功之后将fileid保存 图片的路径
        var fid = res.fileID;
        console.log(fid)
        this.data.fileIds.push(fid);
        // 6.7上传成功之后执行解析
        wx.hideLoading();
        resolve();
          })
        })
        
      }));
    }
    // 功能三：将用户评论信息与图片保存到云数据库

    // 1.创建数据库对象
    // 1.1等待所有promise执行完才执行以下代码
    Promise.all(rows).then(res=>{
      // 2.获取用户评论内容
      var content = this.data.value1;
      // 3.获取用户评分
      var score = this.data.score;
      // 4.当前电影id
      var id = this.data.movieid;
      // 5.图片fileids
      var list = this.data.fileIds;
      // 6.添加集合
      db.collection("comment").add({
        data:{
          content,
          score,
          movieid:id,
          fileIds:list
        }
      }).then(res=>{
        // 7.添加成功 隐藏加载提示框
        wx.hideLoading();
        // 8.提示评论成功
        wx.showToast({
          title: '发表成功',
        })
      }).catch(err=>{
        console.log(err)
      })
    })
    
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // options 获取参数
  onLoad: function (options) {
    // 获取当前电影的id并保存
    this.setData({
      movieid:options.id
    });
    this.loadMore();
  },
  loadMore:function(){
    // 功能：组件创建成功之后调用云函数
    // 1.获取用户选中电影 id
    var id = this.data.movieid
    // 2.显示数据加载提示框
    wx.showLoading({
      title: '正在加载中...',
    })
    // 3.调用云函数
    wx.cloud.callFunction({
      name:"findDetail1905",
      data:{
        id
      }
    }).then(res=>{
    // 4.获取云函数返回数据
    console.log(res)
      var result = JSON.parse(res.result);
    // 5.保存detail:{}
      var obj = result;
      this.setData({
        detail:obj
      });
      console.log(result)
    // 6.隐藏加载提示框
    wx.hideLoading();
    }).catch(err=>{
      console.log(err)
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

  }
})