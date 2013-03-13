# Page = require('../models').Page

module.exports = [
    path: '/'
    type: 'GET'
    # login: 'none'
    action: (req, res, next) ->
      youtube = require('youtube')
      res.render 'home',
        title: 'Moving Worlds'
        page_id: 'home'
        video: youtube.embed('BcTQp935yco', 439, 253)
        warning: req.flash('warning')
        error: req.flash('error')
        
  # ,
  #   path: '/home'
  #   type: 'GET'
  #   login: 'none'
  #   action: (req, res) ->
  #     res.redirect '/'

  ,
    path: '/org'
    type: 'GET'
    # login: 'none'
    action: (req, res) ->
      youtube = require('youtube')
      res.render 'home_org',
        title: 'Moving Worlds'
        page_id: 'org_home'
        video: youtube.embed('BcTQp935yco', 439, 253)
]
