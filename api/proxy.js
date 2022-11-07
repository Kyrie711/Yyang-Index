const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = (req, res) => {
  let target = 'http://api.fanyi.baidu.com/api/trans/vip/translate'
  

  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      '^/base/': '/'
    }
  })(req, res)
}