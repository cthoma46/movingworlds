var mongoose = require('mongoose')
var Account = mongoose.model('account')
var passport = require('passport')
var home = require('./home') 
var acc = require('./account-pages') 
var invite = require('./invite') 
var x = require('../middleware/access')
var m = require('../middleware/account-actions')
var opp = require('../middleware/opportunity')
var activity = require('../middleware/activity') 

module.exports = function (app) { 
  app.all('*', function (req, res, next) {
    req.user = req.user || new Account()
    next()
  }, 
  m.defaults, 
  function (req, res, next) { 
    console.notice(req.method, req.url, req.user.loggedIn)
    next()
  })
  app.get('/auth/linkedin/callback',  passport.authenticate('linkedin', { 
    failureRedirect : '/login' 
  }), function (req, res) {
      console.info('LinkedIn Success', req.session)
      req.flash('success', 'You have successfully connected to LinkedIn')
      return res.redirect(req.session.returnTo || '/setup/basic')
    }
  )
  app.get( '/auth/linkedin',          passport.authenticate('linkedin'))
  require( './api')(app)
  app.get( '/404',                    home[404])
  app.get( '/500',                    home[500])
  app.get( '/',                       m.getFeaturedData, home)
  app.get( '/home',                   home)
  app.get( '/org',                    home.org)
  
  app.all( '/search/:model/:page?',   m.searchPage, acc.search)
  
  app.post('/invite',                 invite.invite)
  app.post('/invite_extras',          invite.inviteExtras)
  app.get( '/invite/:inviteCoupon',   invite.invite)
  
  app.get( '/login',                  acc.login)
  app.post('/login',                  acc.doLogin)
  app.get( '/logout',                 x.all,        acc.logout)
  
  app.get( '/landing',                x.all,        acc.dashboard)
  
  app.get( '/intro-request/:_id',     x.all,        m.intro)
  
  app.get( '/publish',                x.all,        m.publish, m.save)
  app.get( '/unpublish',              x.all,        m.unpublish, m.save)
  app.get( '/feature',                x.all,        m.feature, m.save)
  app.get( '/unfeature',              x.all,        m.unfeature, m.save)
  
  app.post('/payment/basic',          x.exp,        m.charge.basic, m.charge)
  app.post('/payment/premium',        x.exp,        m.charge.premium, m.charge)
  app.post('/payment/plus',           x.exp,        m.charge.plus, m.charge)
  
  app.post('/setup',                  x.all,        m.password, m.save)
  app.get( '/setup/basic',            x.all,        acc.setupBasic)
  app.get( '/setup/organization',     x.all,        m.organization)
  app.get( '/setup/experteer',        x.all,        m.experteer)
  app.get( '/setup/preferences',      x.exp,        acc.setupPreferences)
  app.get( '/setup/skills',           x.exp,        acc.setupSkills)
  app.get( '/setup/plan',             x.exp,        acc.setupPlan)
  app.get( '/setup/company',          x.org,        acc.setupCompany)
  app.get( '/setup/review',           x.org,        acc.setupReview)

  // add an opportunity with a form
  // edit an opportunity with a form
  // delete an opportunity with a form
  // publish an opportunity
  // unpublish an opportunity
  // view a profile and an opportunity on a profile page

  app.get( '/opportunity',            x.org,    opp.create, acc.setupOpportunity)
  app.post('/opportunity/:id',        x.org,    opp.edit, acc.setupOpportunity)
  app.get( '/opportunity/:id',        x.org,    opp.read, acc.setupOpportunity)
  app.get( '/opportunity/:id/delete', x.org,    opp.delete, home)
  // app.get( '/opportunity/:id/publish', x.org,   opp.publish)
  // app.get( '/opportunity/:id/unpublish', x.org, opp.unpublish)
  app.get( '/profile/:_id/:_id2?', acc.profile)
  
  // app.get( '/setup/opportunity',      x.org,  acc.setupNewOpportunity)
  // app.post('/setup/opportunity',      x.org,  opp.update)
  // app.get( '/setup/opportunity/:id',  x.org,  acc.setupOpportunity)
  // app.get( '/delete/opportunity/:id', x.org,  opp.delete)



  // app.get('/blog', home.blog)
  // app.get('/finalize', home.finalization)
}
