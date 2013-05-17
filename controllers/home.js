var youtube = require('youtube')
var account = require('../mixins/account-actions')
var activity = require('../mixins/activity')

module.exports = {
  index : function (req, res, next) {
    return res.render('home', {
      title : 'Moving Worlds', 
      page_id : 'home', 
      video : youtube.embed('BcTQp935yco', 439, 253)
    })
  },
  org : function (req, res) {
    return res.render('home_org', {
      title : 'Moving Worlds', 
      page_id : 'org_home', 
      video : youtube.embed('BcTQp935yco', 439, 253)
    })
  },
  404 : function (req, res, next) {
    return res.render('404', {
      title : 'Could not find page',
      error : 'That page doesn\'t exist'
    })
  },
  500: function (req, res, next) {
    return res.render('500', {
      title : 'Internal Server Error!!',
      error : 'Something bad happened'
    })
  },
  blog : function (req, res) {
    return res.render('blog', { title : 'Blog', layout : 'layout_blog' })
  },
  finalization : function (req, res) { 
    return res.render('finalization', { title : 'Finalization' })
  },
}
