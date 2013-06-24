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

  // a little something that matches all HTTP verbs:
  // ensure the user variable is defined.
  app.all('*', 
    function (req, res, next) {
      req.user = req.user || new Account()
      next()
    }, 
    m.defaults, 
    function (req, res, next) { 
      console.log(req.method, req.url, req.user.loggedIn)
      next()
    })

  // LinkedIn authentication callback
  app.get('/auth/linkedin/callback', 
    passport.authenticate('linkedin', { failureRedirect : '/login' }),
    function (req, res) {
      return res.redirect(req.session.returnTo || '/setup/basic')
    }
  )

  // application routes!
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
  app.post('/payment',                x.exp,        m.charge)
  app.post('/setup',                  x.all,        m.password, m.save)
  app.get( '/setup/basic',            x.all,        acc.setupBasic)
  app.get( '/setup/organization',     x.all,        m.organization, m.save)
  app.get( '/setup/experteer',        x.all,        m.experteer, m.save)
  app.get( '/setup/preferences',      x.exp,        acc.setupPreferences)
  app.get( '/setup/skills',           x.exp,        acc.setupSkills)
  app.get( '/setup/plan',             x.exp,        acc.setupPlan)
  app.get( '/setup/company',          x.org,        acc.setupCompany)
  app.get( '/setup/review',           x.org,        acc.setupReview)
  app.get( '/setup/opportunity',      x.org,    opp.create, acc.setupOpportunity)
  app.post('/opportunity/:id',        x.org,    opp.edit, acc.setupOpportunity)
  app.get( '/opportunity/:id',        x.org,    opp.read, acc.setupOpportunity)
  app.get( '/opportunity/:id/delete', x.org,    opp.delete, home)
  app.get( '/profile/:_id/:_id2?',    acc.profile)
  app.get( '/about',                  home.page('about', 'About Movingworlds'))
  app.get( '/pricing',                home.page('pricing', 'Pricing'))
  app.get( '/partners',               home.page('partners', 'Partners'))
  app.get( '/faq',                    home.page('faq', 'Frequently Asked Questions'))
  app.get( '/resources',              home.page('resources', 'Resources'))
  app.get( '/resources/experteers',   home.page('experteers', 'Info for Experteers'))
  app.get( '/resources/organizations', home.page('organizations', 'Info for Organizations'))
  app.get( '/contact',                home.page('contact', 'Contact'))
  app.get( '/terms-of-use',           home.page('terms-of-use.markdown', 'Terms of Use'))
}
