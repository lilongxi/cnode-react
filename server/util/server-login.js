const router = require('express').Router()
const axios = require('axios')

const baseUrl = `https://cnodejs.org/api/v1`

router.post('/login', function (req, res) {
  axios.post(`${baseUrl}/accesstoken`, {
    accesstoken: req.body.accessToken
  })
    .then(resp => {
      if (resp.status === 200 && resp.data.success) {
        req.session.user = {
          accessToken: req.body.accessToken,
          loginName: resp.data.loginname,
          id: resp.data.id,
          avatarUrl: resp.data.avatar_url
        }
        res.send({
          success: true,
          code: 0,
          data: resp.data
        })
      }
    })
    .catch(err => {
      if (err.response) {
        res.send({
          success: false,
          code: 1,
          data: err.response.data
        })
      }else {
        next(err)
      }
    })
})

module.exports = router
