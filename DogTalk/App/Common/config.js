'use stric'

module.exports = {
  header: {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },
  api: {
    base: 'http://rapapi.org/mockjsdata/18956/',
    // 首页列表API
    home: 'api/home',
    // 评论列表API
    comment: 'api/comment',
    // 发送评论
    sendComment: 'api/sendComment',
    // 点赞功能API
    up: 'api/up'
  }
}
