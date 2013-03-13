_ = require('underscore')
fs = require('fs')
socialNetworks = require('./social_networks')

loginCheck =
  all : (req, res, next) ->
    # 'login required'
    user = req.user
    if user?
      if user.type is 'experteer' or user.type is 'representative' or user.type is 'admin'
        next()
    else
      req.session.redirect = req.url
      req.flash 'warning', '<strong>MovingWorlds is an invite only community.<strong><br>If you are already a member and would like to login with another social network please login first and then connect the network on your landing page.'
      res.redirect '/login'

  org : (req, res, next) ->
    # 'orgs only'
    user = req.user
    if user? and user.type is 'representative'
      next()
    else
      res.redirect('/404')

  experteer : (req, res, next) ->
    # 'experteers only'
    user = req.user
    if user? and user.type is 'experteer'
      next()
    else
      res.redirect('/404')

  admin : (req, res, next) ->
    # 'admins only'
    user = req.user
    if user? and user.type is 'admin'
      next()
    else
      res.redirect('/404')

  none : (req, res, next) ->
    # 'no login required'
    next();

routes = []

excluded = [
    'index.coffee'
  , 'passport.coffee'
  , 'page.coffee'
  , 'social_networks.coffee'
]

fs.readdirSync(__dirname).forEach (file) ->
  if file.split('.').pop() is 'coffee' and !_.contains(excluded, file)
    routes = routes.concat(require './' + file) 

console.log(routes)

module.exports = (app) ->
  routes.forEach (route) ->
    app[ route.type.toLowerCase() ](route.path, loginCheck[route.login or 'none'], route.action)
  socialNetworks(app)