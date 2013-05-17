var notLoggedIn = '\<strong\>You are not logged in.\<strong\>\<br\>Please log in to your account or request an invite.'

function redirectToLogin (req, res) {
  req.session.returnTo = req.url
  req.flash('error', notLoggedIn)
  return res.redirect('/login')
}

module.exports = {
  all : function (req, res, next) { 
    if (req.user) {
      switch (req.user.model) {
        case 'experteer' :
        case 'organization' :
        case 'admin' :
          return next()
        default :
          return redirectToLogin(req, res)
      }
    }
    return redirectToLogin(req, res)
  },
  organization : function (req, res, next) { 
    if (req.user && req.user.model === 'organization') {
      return next()
    }
    return res.redirect('/404')
  },
  experteer : function (req, res, next) { 
    if (req.user && req.user.model === 'experteer') {
      return next()
    }
    return res.redirect('/404')
  },
  admin : function (req, res, next) {
    if (req.user && req.user.model === 'admin') {
      return next()
    }
    return res.redirect('/404') 
  },
  none : function (req, res, next) { 
    return next()
  }
}
