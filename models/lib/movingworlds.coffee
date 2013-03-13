fs = require('fs')
_ = require('underscore')

defaultSettings =
  version: '0.0.1'
  siteName: 'MovingWorlds'
  locals: 
    title: 'MovingWorlds'
    description: 'Use your expertise for global impact.'
  session:
    secret: '!M0v1ng!'
    expire: 1200000 #20 minunts by default
  url: 'http://localhost' # Without trailing /
  port: process.env.PORT or 3000
  debug: 0
  profile: 0
  dbUri: 'mongodb://localhost/movingworlds'
  database:
    type: 'mongodb'
    name: 'movingworlds'
    host: 'localhost'
    port: 27017
    username: ''
    password: ''

  mail:
    from: ''
    cc: ''
    sftp:
      user: ''
      password: ''
      host: ''
      port: ''
      ssl: ''

  apiKeys:
    google:
      key: ''
      secret: ''

    facebook:
      key: ''
      secret: ''
      devKey: ''
      devSecret: ''

    linkedin:
      key: ''
      secret: ''

# CONFIGURE SETTINGS - override default settings
exports.CONF = conf = '/etc/movingworlds.conf'

if fs.existsSync(conf)
  confFile = JSON.parse( fs.readFileSync(conf, 'utf8') )
  exports.SETTINGS = settings = _.extend( defaultSettings, confFile )
else
  exports.SETTINGS = settings = defaultSettings

###
Expose Page

@api public
###
# exports.Page = require('./page')

###
Expose Settings

@api public
###
# exports.Settings = require('./settings')

###
Expose User

@api public
###
exports.User = require('./user')

###
Expose User

@api public
###
exports.Experteer = require('./experteer')

###
Expose Organization

@api public
###
exports.Organization = require('./organization')

###
Expose Messages

@api public
###
# exports.Message = require('./message')

###
Expose Mail

@api public
###
exports.Mail = require('./mail')

###
Expose utils

@api public
###
exports.utils = require('./utils')

###
Expose Errors

@api public
###
exports.PageNotFoundError = require('./errors/page_not_found')
