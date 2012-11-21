# Page = require("../models").Page

module.exports = [
    path: "/"
    type: "GET"
    login: 'none'
    action: (req, res, next) ->
      youtube = require("youtube")
      res.render "home",
        title: "Moving Words"
        page_id: "home"
        video: youtube.embed("BcTQp935yco", 439, 253)
        warning: req.flash('warning')
        error: req.flash('error')
  ,
    path: "/home"
    type: "GET"
    login: 'none'
    action: (req, res) ->
      res.redirect "/"
  ,
    path: "/se"
    type: "GET"
    login: 'none'
    action: (req, res) ->
      youtube = require("youtube")
      res.render "home_se",
        title: "Moving Words"
        page_id: "se_home"
        video: youtube.embed("BcTQp935yco", 439, 253)
]
