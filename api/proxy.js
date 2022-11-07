const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = (req, res) => {
  let target
  console.log(req.url)
  if (req.url.startsWith('/base')) {
    target = 'http://api.fanyi.baidu.com/api/trans/vip/translate'
  }

  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      '^/base/': '/'
    }
  })(req, res)
}