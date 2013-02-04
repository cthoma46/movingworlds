module.exports = [

    path: "/settings"
    type: "GET"
    login: 'all'
    action: (req, res) ->
      user = req.user
      res.render "settings",
        title: "settings"
        headtype: "loggedin"
        user: user

]