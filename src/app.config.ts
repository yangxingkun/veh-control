export default defineAppConfig({
  // pages: [
  //   'pages/index/index'
  // ],
  pages: [
    'pages/index/index',
    'pages/userAgreement/index',
    'pages/search/index',
    'pages/interest/index',
    'pages/login/index',
    'pages/auth/index',
    'pages/tagDetailPage/index',
    'pages/industrialWasteDetailPage/index',
    'pages/meControlChatPage/index',

  ],
  // subpackages: [
  //   {
  //     root: 'subpackages',
  //     pages: [
  //       'pages/tagDetailPage/index',
  //       'pages/search/index',
  //       'pages/industrialWasteDetailPage/index',
  //     ]
  //   }
  // ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  plugins: {
    contactPlugin: {
      version: '1.4.3',
      provider: 'wx104a1a20c3f81ec2',
    }
  },
  usingComponents: {
    cell: 'plugin://contactPlugin/cell',
  }
  // https://mp.weixin.qq.com/wxopen/plugindevdoc?appid=wx104a1a20c3f81ec2&token=&lang=zh_CN
})
