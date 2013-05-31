var mongoose = require('mongoose')
var Account = mongoose.model('account')
var passport = require('passport')
var home = require('./home') 
var generic = require('./generic');
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
  app.get( '/invite/:inviteCoupon',   acc.setupInvite)
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
  app.get( '/setup/organization',     x.all,        m.organization, m.save)
  app.get( '/setup/experteer',        x.all,        m.experteer, m.save)
  app.get( '/setup/preferences',      x.exp,        acc.setupPreferences)
  app.get( '/setup/skills',           x.exp,        acc.setupSkills)
  app.get( '/setup/plan',             x.exp,        acc.setupPlan)
  app.get( '/setup/company',          x.org,        acc.setupCompany)
  app.get( '/setup/review',           x.org,        acc.setupReview)
  app.get( '/opportunity',            x.org,    opp.create, acc.setupOpportunity)
  app.post('/opportunity/:id',        x.org,    opp.edit, acc.setupOpportunity)
  app.get( '/opportunity/:id',        x.org,    opp.read, acc.setupOpportunity)
  app.get( '/opportunity/:id/delete', x.org,    opp.delete, home)
  app.get( '/profile/:_id/:_id2?',    acc.profile)
  app.get( '/about',                  home.page('about.markdown', 'About Movingworlds'))
  app.get( '/partners',               home.page('partners', 'Partners'))
  app.get( '/faq',                    home.page('faq', 'Frequently Asked Questions'))
  app.get( '/resources',              home.page('resources.markdown', 'Resources'))
  app.get( '/resources/information-for-experteers.html', home.page('experteers.markdown', 'Info for Experteers'))
  app.get( '/resources/information-for-hosting-organizations.html', home.page('organizations.markdown', 'Info for Organizations'))
  app.get( '/contact',                home.page('contact.markdown', 'Contact'))
  app.get( '/terms-of-use',           home.page('terms-of-use.markdown', 'Terms of Use'))
}
