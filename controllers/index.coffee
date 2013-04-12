_ = require('underscore')
fs = require('fs')
socialNetworks = require('./social_networks')
loginCheck = require('./access-control')
routes = []

excluded = [
    'index.coffee'
  , 'passport.coffee'
  , 'page.coffee'
  , 'social_networks.coffee'
  , 'api.js'
  , 'setup.js'
  , 'search.js'
  , 'access-control.coffee'
]

fs.readdirSync(__dirname).forEach (file) ->
  # if file.split('.').pop() is 'coffee'
  if !_.contains(excluded, file)
    routes = routes.concat(require './' + file) 

# console.log(routes)

module.exports = (app) ->
  require('./api.js')(app)
  require('./setup.js')(app)
  require('./search.js')(app)
  routes.forEach (route) ->
    app[ route.type.toLowerCase() ](route.path, loginCheck[route.login or 'none'], route.action)
  socialNetworks(app)