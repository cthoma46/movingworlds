passport = require('passport')

module.exports = [

    path: '/login'
    type: 'GET'
    action: (req, res) ->
      res.render 'login',
        title: 'Login'
        headtype: 'nonav'
        warning: req.flash('warning')
        error: req.flash('error')
  ,
    path: '/logout'
    type: 'GET'
    action: (req, res) ->
      req.logOut()
      res.redirect '/login'
  ,
    path: '/login'
    type: 'POST'
    action: (req, res, next) ->
      passport.authenticate('local', (err, user, info) ->
        if err
          return next(err) 
        unless user
          req.flash 'error', info.message
          return res.redirect('/login')
        req.logIn user, (err) ->
          if err
            return next(err)
          res.redirect req.session.redirect or '/landing'
      ) req, res, next

]