var passport = require('passport')
var home = require('./home') 
var generic = require('./generic');
var pages = require('./account-pages') 
var invite = require('./invite') 
var access = require('../mixins/access')
var actions = require('../mixins/account-actions')
var activity = require('../mixins/activity') 

module.exports = function (app) { 
  app.all('*', function (req, res, next) { 
    console.notice(req.method, req.url)
    next()
  })
  require('./api')(app)
  app.post(               '/invite', invite.invite)
  app.post(        '/invite_extras', invite.inviteExtras)
  app.get(  '/invite/:inviteCoupon', invite.invite)
  app.get(   '/profile/:_id/:_id2?', pages.profile)
  app.get(                   '/404', home[404])
  app.get(                   '/500', home[500])
  app.get(                      '/', home.index)
  app.get(                  '/home', home.index)
  app.get(                   '/org', home.org)
  app.get(                 '/login', pages.login)
  app.post(                '/login', pages.doLogin)
  app.all(  '/search/:model/:page?', actions.searchPage,        pages.search)
  app.get(                '/logout', access.all,                pages.logout)
  app.get(               '/landing', access.all,                pages.dashboard)
  app.get(    '/intro-request/:_id', access.all,                actions.intro)
  app.get(               '/publish', access.all,                actions.publish,      actions.save)
  app.get(             '/unpublish', access.all,                actions.unpublish,    actions.save)

  app.post(        '/payment/basic', access.experteer,          actions.charge.basic, actions.charge)
  app.post(      '/payment/premium', access.experteer,          actions.charge.premium, actions.charge)
  app.post(         '/payment/plus', access.experteer,          actions.charge.plus,  actions.charge)
  app.post(                '/setup', access.all,                actions.password,     actions.save)
  app.get(           '/setup/basic', access.all,                actions.defaults,     pages.setupBasic)
  app.get(    '/setup/organization', access.all,                actions.defaults,     actions.organization)
  app.get(       '/setup/experteer', access.all,                actions.defaults,     actions.experteer)
  app.get(     '/setup/preferences', access.experteer,          actions.defaults,     pages.setupPreferences)
  app.get(          '/setup/skills', access.experteer,          actions.defaults,     pages.setupSkills)
  app.get(            '/setup/plan', access.experteer,          actions.defaults,     pages.setupPlan)
  app.get(         '/setup/company', access.organization,       actions.defaults,     pages.setupCompany)
  app.get(          '/setup/review', access.organization,       actions.defaults,     pages.setupReview)
  app.get(     '/setup/opportunity', access.organization,       actions.defaults,     pages.setupNewOpportunity)
  app.post(    '/setup/opportunity', access.organization,       actions.opportunity)
  app.get( '/setup/opportunity/:id', access.organization,       actions.defaults,     pages.setupOpportunity)
  app.get('/delete/opportunity/:id',  access.organization,      actions.opportunityDelete)

  app.get(         '/auth/linkedin', passport.authenticate('linkedin'))
  app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { 
    failureRedirect : '/login' 
  }), function (req, res) {
      console.info('LinkedIn Success', req.session)
      req.flash('success', 'You have successfully connected to LinkedIn')
      return res.redirect(req.session.returnTo || '/setup/basic')
    }
  )
  // app.get(                  '/blog', home.blog)
  // app.get(              '/finalize', home.finalization)

  app.get('/about', generic.about);
  app.get('/partners', generic.partners);
}
