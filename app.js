var settings = process.settings = require('./settings')
require('rconsole')
require('./underscore-mixins')
require('./models')
var express = require('express')
var stylus = require('stylus')
var http = require('http')
var mongoose = require('mongoose')
var moment = require('moment')
var SessionStore = require('session-mongoose')
var flash = require('connect-flash')
var passport = require('passport')
var youtube = require('youtube')
var controllers = require('./controllers')
var lang = require('./lang')
require('./passport')
var app = express()

function methodOverrideGET (key) {
  key = key || '_method'
  return function (req, res, next) {
    if (req.originalMethod !== req.method) {
      return next()
    }
    req.originalMethod = req.method
    if (req.query && !!req.query[key]) {
      req.method = req.query[key].toUpperCase()
      delete req.query[key]
    }
    return next()
  }
}

mongoose.connect(settings.dbUri, function (err) {
  if (err) {
    console.alert('COULD NOT CONNECT TO DB at: ' + settings.dbUri + '\n', err)
  }
})

app.configure(function () {
  app.locals(settings.locals)
  app.locals.pretty = false
  app.locals.youtube = youtube
  app.locals.moment = moment
  app.locals.extractYoutubeId = function (url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/
    var match = url.match(regExp);
    if (match && match[2].length === 11) {
      return match[2]
    } else {
      return null
    }
  }
  app.set('moment', moment)
  app.set('port', process.env.PORT || settings.port)
  app.set('view engine', 'jade')
  app.set('views', __dirname + '/views/jade')
  app.use(express.favicon(__dirname + '/public/images/favicon.ico'))
  app.use(express.static(__dirname + '/public')) 
  // app.use(express.logger())
  app.use(express.compress())
  app.use(express.methodOverride())
  app.use(express.bodyParser())
  app.use(express.cookieParser())
  app.use(express.session({
    secret : settings.session.secret,
    cookie : {
      path : '/',
      maxAge: settings.session.expire
    },
    store : new SessionStore({
      url : settings.dbUri,
      interval : 120000
    })
  }))
  app.use(stylus.middleware({
    src : __dirname + '/views',
    dest : __dirname + '/public',
    compress : true,
    debug : false
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(flash())
  app.use(function (req, res, next) {
    res.locals.lang = lang
    res.locals.flash = req.flash.bind(req)
    res.locals.user = req.user
    next()
  })
  app.use(app.router)
})

app.configure('development', function () {
  app.set(express.logger('dev'))
  app.use(express.errorHandler({ dumpExceptions : true, showStack : true }))
})

controllers(app)

module.exports = http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'))
})
