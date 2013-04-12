var youtube = require('youtube')
var passport = require('passport')
var search = require('./search')

module.exports = [

  // 
  // Experts Landing page
  // 
  {
    path : '/',
    type : 'GET',
    action : function (req, res, next) {
      res.render('home', {
        title : 'Moving Worlds', 
        page_id : 'home', 
        video : youtube.embed('BcTQp935yco', 439, 253), 
        // warning : req.flash('warning'), 
        // error : req.flash('error')
      })
    }
  }, 

  // 
  // Organization landing page
  // 
  {
    path : '/org',
    type : 'GET',
    action : function (req, res) {
      res.render('home_org', {
        title : 'Moving Worlds', 
        page_id : 'org_home', 
        video : youtube.embed('BcTQp935yco', 439, 253)
      })
    }
  },

  // 
  // extra redirect
  // 
  {
    path : '/home',
    type : 'GET',
    action : function (req, res) {
      res.redirect('/')
    }
  },

  // 
  // Not used 
  // 
  {
    path : '/finalization',
    type : 'GET',
    action : function (req, res) { 
      res.render('finalization', { title : 'Finalization' })
    }
  },

  // 
  // login dashboard
  // 
  {
    path : '/landing',
    type : 'GET',
    login : 'all',
    action : function (req, res) {
      req.query.limit = 2
      req.query.page = 1
      req.query.filter = { industry : req.user.industry }
      populateActivities(req, res, function () {
        search.searchRequest(req, res, function () {
          res.render('private/dashboard', { title : 'Dashboard' })
        })
      })
    }

  },

  // 
  // login page
  // 
  {
    path : '/login',
    type : 'GET',
    action : function (req, res) {
      res.render('login', { headtype : 'nonav', title : 'Login' })
    }
  },

  // 
  // handle login
  // 
  {
    path : '/login',
    type : 'POST',
    action : passport.authenticate('local', {
      successRedirect : '/landing',
      failureRedirect : '/login',
      failureFlash : true
    })
  },

  // 
  // handle logout
  // 
  {
    path : '/logout',
    type : 'GET',
    action : function (req, res) {
      req.logOut()
      res.redirect('/login')
    }
  },

  // 
  // 404 page
  // 
  {
    path : '/404',
    type : 'GET',
    action : function (req, res, next) {
      res.render('errors/404', {
        title : 'Could not find page',
        error : 'That page doesn\'t exist'
      })
    }
  },

  // 
  // 500 page
  // 
  {
    path : '/500',
    type : 'GET',
    action : function (req, res, next) {
      res.render('errors/500', {
        title : 'Internal Server Error!!',
        error : 'Something bad happened'
      })
    }
  }

]

function populateActivities (req, res, callback) {
  req.user
    .findActivities()
    .populate('peer')
    .populate('account')
    .exec(function (err, docs) {
      if (err) {
        console.error(err, docs)
        return callback(err)
      }
      if (!docs.length) {
        return callback()
      }
      req.user.activity = docs
      return callback()
    })
  ;
}
