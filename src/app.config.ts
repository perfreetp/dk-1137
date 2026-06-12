export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/publish/index',
    'pages/topics/index',
    'pages/messages/index',
    'pages/profile/index',
    'pages/post-detail/index',
    'pages/comments/index',
    'pages/topic-detail/index',
    'pages/settings/index',
    'pages/mood/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#7B68EE',
    navigationBarTitleText: '办公室树洞',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#7B68EE',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '树洞'
      },
      {
        pagePath: 'pages/publish/index',
        text: '发布'
      },
      {
        pagePath: 'pages/topics/index',
        text: '话题'
      },
      {
        pagePath: 'pages/messages/index',
        text: '消息'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  }
})
