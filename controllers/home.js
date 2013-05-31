var _ = require('underscore')
var youtube = require('youtube')
var account = require('../middleware/account-actions')
var activity = require('../middleware/activity')

module.exports = function (req, res, next) {
  if (req.url !== '/') {
    return res.redirect('/')
  }
  return res.render('home', {
    title : 'Moving Worlds', 
    page_id : 'home', 
    video : youtube.embed('BcTQp935yco', 439, 253)
  })
}

_.extend(module.exports, {
  org : function (req, res) {
    return res.render('home-org', {
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
  page : function (pageName, title) {
    return function (req, res) {
      return res.render('markdown/' + pageName, function (err, html) {
        if (err) {
          console.error(err)
        }
        return res.render('markdown-page', { 
          page : html,
          title : title, 
        })
      })
    }
  },
  blog : function (req, res) {
    return res.render('blog', { title : 'Blog', layout : 'layout_blog' })
  },
  finalization : function (req, res) { 
    return res.render('finalization', { title : 'Finalization' })
  },
})
