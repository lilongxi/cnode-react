const axios = require('axios')
const baseUrl = `https://cnodejs.org/api/v1`
const queryString = require('query-string')

module.exports = function (req, res, next) {
  const path = req.path
  const user = req.session.user || {}
  const needAccessToken = req.query.needAccessToken

  if (needAccessToken && !user.accessToken) {
    res.status(401)
    res.send({
      success: false,
      msg: 'user not login'
    })
  }

  const query = Object.assign({}, req.query, {
    accesstoken: (needAccessToken && req.method === 'GET') ? user.accessToken : ''
  })

  if (query.needAccessToken) {
    delete query.needAccessToken
  }

  axios(`${baseUrl}${path}`, {
    method: req.method,
    params: query,
    data: queryString.stringify(Object.assign({}, req.body,
      { accesstoken: (needAccessToken && req.method === 'POST') ? user.accessToken : ''}
    )),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
    .then(resp => {
      if (resp.status === 200 && resp.data) {
        res.send(resp.data)
      }else {
        res.status(resp.status).send(resp.data)
      }
    })
    .catch(err => {
      if (err.response) {
        res.status(500).send(err.response.data)
      }else {
        res.status(500).send({
          success: false,
          msg: '未知错误'
        })
      }
    })
}
