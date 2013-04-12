
module.exports =
  all : (req, res, next) ->
    # 'login required'
    user = req.user
    # console.log('login required', user.model)
    if user?
      if user.model is 'experteer' or user.model is 'organization' or user.model is 'admin'
        console.log('login detected')
        return next()
    req.session.returnTo = req.url
    req.flash 'error', '\<strong\>You are not logged in.\<strong\>\<br\>Please login to your account or request an invite.'
    res.redirect '/login'

  org : (req, res, next) ->
    # 'orgs only'
    user = req.user
    if user? and user.model is 'organization'
      next()
    else
      res.redirect('/404')

  experteer : (req, res, next) ->
    # 'experteers only'
    user = req.user
    if user? and user.model is 'experteer'
      next()
    else
      res.redirect('/404')

  admin : (req, res, next) ->
    # 'admins only'
    user = req.user
    if user? and user.model is 'admin'
      next()
    else
      res.redirect('/404')

  none : (req, res, next) ->
    # 'no login required'
    next();
