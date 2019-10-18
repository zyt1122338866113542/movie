// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 电影列表
    list:[],
    pno:0,   //页码
  },
  loadMore:function(){
    // 下一页
    var pno = this.data.pno +1;
    this.setData({
      pno
    })
    var offset = (pno-1)*4;
    // 功能：调用云函数完成数据加载
    // 1.调用云函数
    wx.cloud.callFunction({
      name: "movielist1905",  //云函数的名称
      data: {
        start:offset,     //起始行数
        count:4      //几条记录
        }
    }).then(res => {
      // json解析结果
      //console.log(res.result)
      var rows = JSON.parse(res.result);
      var lists = this.data.list.concat(rows.subjects);
      // 云函数返回的结果放到list中
      this.setData({
        list:lists
      })
      //console.log(rows.subjects)
    }).catch(err => {
      console.log(err)
    })
  },
  comment(e){
    var _id = e.target.dataset.id;
    // 跳转到详情页
    // 关闭跳转：当前组件关闭（卸载）
    // wx.redirectTo({
    //   url: '/pages/comment/comment?id='+ _id,
    // })

    // 保留跳转
    wx.navigateTo({
      url: '/pages/comment/comment?id=' + _id,
    })
    //console.log(_id);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadMore()
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
    console.log(11)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 加载下一页数据
    this.loadMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})