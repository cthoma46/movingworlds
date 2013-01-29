express = require("express")
stylus = require("stylus")
http = require("http")
path = require("path")
mongoose = require("mongoose")
moment = require("moment")
SessionStore = require("session-mongoose")
utils = require("util")
flash = require("connect-flash")
passport = require("passport")
settings = require("./models").SETTINGS
youtube = require("youtube")

# console.log(process.versions);
#/////////////////////////////////////////
#              GLOBAL                   //
#/////////////////////////////////////////
app = express()

#/////////////////////////////////////////
#              DATABASE                 //
#/////////////////////////////////////////
mongoose.connect settings.dbUri, (err) ->
  console.log "COULD NOT CONNECT TO DB at: " + settings.dbUri + "\n", err  if err

#/////////////////////////////////////////
#            PASSPORT                   //
#/////////////////////////////////////////
require "./controllers/passport"

#/////////////////////////////////////////
#             CONFIGURE                 //
#/////////////////////////////////////////
app.configure ->
  app.locals settings.locals
  app.locals.pretty = false
  app.locals.youtube = youtube
  app.locals.extractYoutubeId = (url) ->
    regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/
    match = url.match(regExp);
    if match && match[2].length == 11
      return match[2]
    else
      return null
  app.set "moment", moment
  app.set "port", process.env.PORT or settings.port
  app.set "view engine", "jade"
  app.set "views", __dirname + "/views/jade"

  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use express.cookieParser()
  app.use express.session(
    secret: settings.session.secret
    cookie:
      path: '/'
      maxAge: settings.session.expire
    store: new SessionStore
      url:settings.dbUri
      interval: 120000

  )
  app.use stylus.middleware(
    src: __dirname + "/views"
    dest: __dirname + "/public"
    compress: true
    debug: false
  )
  app.use passport.initialize()
  app.use passport.session()
  app.use flash()

  app.use (req, res, next) ->
    res.locals.flash = req.flash.bind(req)
    res.locals.user = req.user
    next()


  app.use app.router
  app.use express.favicon(__dirname + "/public/images/favicon.ico")
  app.use express.static(__dirname + "/public")

# Development Config
app.configure "development", ->
  app.set express.logger("dev")
  app.use express.errorHandler(
    dumpExceptions: true
    showStack: true
  )
  # check for leaks
  # detector = require('gleak')();
  # detector.detect().forEach (name) ->
  #   console.warn('found global leak: %s', name);

  require("./sandbox")

# Production Config
app.configure "production", ->


#/////////////////////////////////////////
#              ROUTES                   //
#/////////////////////////////////////////
require("./controllers")(app)

#/////////////////////////////////////////
#              LISTEN                   //
#/////////////////////////////////////////
module.exports = http.createServer(app).listen(app.get("port"), ->
  console.log "Express server listening on port " + app.get("port") )