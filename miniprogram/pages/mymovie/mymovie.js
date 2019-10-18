// pages/mymovie/mymovie.js
// 创建数据库对象
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moviename:"",  //当前喜欢电影名称
    content: "",      //当前喜欢电影原因
    images:[],         //保存选中图片列表
    fileIds:[]         //保存上传文件fileid
  },
  // 功能：修改电影名称 
  onChangeMname:function(e){
    this.setData({
      moviename:e.detail
    })
  },
  // 功能：当用户输入原因时触发事件
  onChangeContent:function(e){
    this.setData({
      content: e.detail
    })
  },
  // 上传
  upload:function(){
    // 功能：
    // #选择多张图片
    // #将图片显示在imagelist区域
    // 1.显示数据加载提示框
    wx.showLoading({
      title: '图片正在加载...',
    })
    wx.chooseImage({
      // 2.选择多张图片
      count:9,
      // 3.图片类型
      sizeType: ["original", "compressed"],
      // 4.图片来源
      sourceType: ["camera", "album"],
      // 5.选择成功
      success: (res) =>{
        var f = res.tempFilePaths;
      // 6.将选中的图片保存images
      console.log(res)
      this.setData({
        images:f
      })
      // 7.隐藏加载提示框
      wx.hideLoading();
      },
    })
  },
  // 提交
  submit:function(){
    // 功能1：将选中的图片上传到云存储
    // 1.显示数据加载提示框
    wx.showLoading({
      title: '数据加载中...',
    })
    // 2.创建数组
    var rows = [];
    // 3.创建循环遍历选中图片列表
    for(var i=0;i<this.data.images.length;i++){
      // 4.创建promise对象完成上传
      rows.push(new Promise((resolve,reject)=>{
        // 5.获取当前文件名
        var item = this.data.images[i];
        // 6.获取后缀名
        var suffix = /\.\w+$/.exec(item)[0];
        // 7.创建新文件名时间+随机数+后缀
        var newFile = new Date().getTime();
        newFile += Math.floor(Math.random() * 9999);
        newFile += suffix;
        // 8.上传图片
        wx.cloud.uploadFile({
          cloudPath:newFile,
          filePath:item,
          success:(res=>{
            var fid = res.fileID;
            //console.log(fid)
            // 9.上传成功京fileid保存
            this.data.fileIds.push(fid);
            //console.log(this.data.fileIds)
            wx.hideLoading();
            // 10.解析
            resolve();
          })
        })
        
      }))
    }
    // 功能2：将用户信息fileid添加云数据库
    Promise.all(rows).then(res=>{
      // 11.获取用户留言
      var content = this.data.content;
      // 12.当前电影名称
      var moviename = this.data.moviename;
      // 13.获取上传图片
      var fileIds = this.data.fileIds;
      // 14.创建数据库对象
      // 15.云数据库控制台创建集合mymovie
      // 16.向集合中添加一条记录
      db.collection("mymovie").add({
        data: {
          content,
          moviename,
          fileIds: this.data.fileIds
        }
      })
      .then(res => {
        // 17：添加成功
        // 18.隐藏加载提示框
        wx.hideLoading();
        wx.showToast({
          // 19.显示提交成功
          title: '提交成功',
        })
      }).catch(err => {
        console.log(err);
      })
    })
  },
  // 跳转到电影详情列表
  jumpDetail:function(){
    wx.navigateTo({
      url: '/pages/movielist/movielist',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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