const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = (req, res) => {
  let target = ''
  if (req.url.startsWith('/backend')) {
    target = 'http://api.fanyi.baidu.com/api/trans/vip/translate'
  }

  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      '^/backend/': '/'
    }
  })(req, res)
}