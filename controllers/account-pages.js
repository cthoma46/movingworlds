var _ = require('underscore')
var passport = require('passport')
var mongoose = require('mongoose')
var Account = mongoose.model('account') 
var Opportunity = mongoose.model('opportunity') 
var moment = require('moment')
var Lang = require('../lang')
var activity = require('../mixins/activity')
var actions = require('../mixins/account-actions')

module.exports = {

  login : function (req, res) {
    return res.render('login', { headtype : 'nonav', title : 'Login' })
  },
  
  doLogin : passport.authenticate('local', {
    successRedirect : '/landing',
    failureRedirect : '/login',
    failureFlash : true
  }),
  
  dashboard : function (req, res) {
    req.query.limit = 2
    req.query.page = 1
    req.query.filter = { industry : req.user.industry }
    activity.getActivity(req, res, function () {
      actions.searchRequest(req, res, function () {
        return res.render('private/dashboard', { title : 'Dashboard' })
      })
    })
  },
  
  logout : function (req, res) {
    req.logOut()
    return res.redirect('/login')
  },

  search : function (req, res, next) {
    res.render('private/search', {
      title : 'Search',
      headtype : 'loggedin',
      message : '',
      search_str : req.query.q,
      opp_index : 0,
      search : true
    })
  },

  profile : function (req, res, next) {
    Account.findById(req.params._id, function (error, account) { 
      if (error || !account) {
        console.error(error)
        req.flash('error', 'Oops')
        return res.redirect('back')
      }
      getIntroDate(req.user, req.params._id, function (err, introDate) {
        res.locals({ introDate : introDate })
        if (account.model === 'organization') {
          account
          .opportunityList()
          .populate('organization')
          .exec(function (err, docs) {
            var opp_id = 0
            account.addDefaults()
            account.opportunities = docs
            account.opportunities.forEach(function (opportunity, i) {
              if (opportunity.id === req.params._id2) {
                opp_id = i
              }
            }) 
            renderProfile(account, opp_id)
          })
        } else {
          account.addDefaults()
          renderProfile(account)
        }
      })
    })
    function renderProfile (account, opp_id) {
      res.render('private/profile', {
        title : 'MovingWorlds Profile - ' + account.name,
        experteer : account,
        org : account,
        account : account,
        moment : moment,
        opp_id: opp_id || 0,
        countryList : Lang.en.Countries,
        regionList : Lang.en.Regions
      })
    }
  },

  setupInvite : function (req, res, next) {
    console.debug('accountController.setup.invite')
    Account.findOne({ inviteCoupon : req.params.inviteCoupon })
      .exec(function (error, account) {
        console.log(arguments)
        if (error || !account) {
          return next(new Error('MovingWorlds is an invite only community'))
        }
        account.addDefaults()
        req.login(account, function (err) {
          console.debug('accountController.setup.invite req.login',  err)
          if (err) {
            return next(err)
          }
          return res.redirect('/setup/basic')
        })
      })
    ;
  },

  /**
   * 1. 
   * - Basic Information 
   * - Experteer, Organization 
   * 
   */
  setupBasic : function (req, res, next) { 
    console.log('setup.basic', req.user.model)
    Account.findById(req.user.id).exec(function (error, doc) {
      if (error || !doc) {
        return next(error)
      }
      doc.addDefaults()
      req.user = doc
      res.locals({ title : 'Setup Basic Information' })
      return res.render('private/setup-basic')
    })
  },

  /**
   * 4. 
   * - Review
   * - Organization
   * 
   */
  setupReview : function (req, res, next) { 
    res.locals({ title : 'Setup Review' })
    return res.render('private/setup-organization-review')
  },

  /**
   * 3. Add Opportunity
   * - Organization
   * 
   */
  setupNewOpportunity : function (req, res, next) { 
    req.user
      .opportunityList()
      .populate('organization')
      .exec(function (err, docs) {
        if (err) {
          return next(err)
        }
        req.user.opportunities = docs
        res.locals({ title : 'Setup Opportunities' })
        res.locals({ opportunity : new Opportunity() })
        return res.render('private/setup-organization-opportunity')
      })
    ;
  },

  setupOpportunity : function (req, res, next) { 
    Opportunity.findById(req.params.id, function (err, doc) {
      if (err) {
        req.flash('error', err)
        return res.redirect('back')
      }
      res.locals({ title : 'Edit Opportunity' })
      res.locals({ opportunity : doc })
      return res.render('private/setup-organization-opportunity')
    })
  },

  /**
   * 2. Experteering Preferences 
   * - Experteer
   * 
   */
  setupPreferences : function (req, res, next) { 
    if (req.user.model === 'organization') {
      return res.redirect('/setup/company')
    }
    res.locals({ title : 'Setup Experteering Preferences' })
    return res.render('private/setup-experteer-preferences')
  },

  /**
   * 3. Professional Skills
   * - Experteer
   * 
   */
  setupSkills : function (req, res, next) { 
    req.user.employment = req.user.employment || []
    if (req.user.employment.length === 0)
    {
      req.user.employment = [
         {
          employer : '',
          city : '',
          position : '',
          current : false
        }
      ]
    }
    req.user.education = req.user.education || []
    if (req.user.education.length === 0)
    {
       req.user.education = [
          {
            school : '',
            major : '',
            degree : '',
            start : '',
            end : ''
          }
        ];
    }
    res.locals({ title : 'Setup Professional Skills' })
    return res.render('private/setup-experteer-skills')
  },

  /**
   * 4. Choose Plan & Payment
   * - Experteer
   * 
   */
  setupPlan : function (req, res, next) { 
    res.locals({ title : 'Choose Plan & Payment' })
    return res.render('private/setup-experteer-plan')
  },

  /**
   * 2. Company Information
   * - Organization
   * 
   */
 setupCompany : function (req, res, next) { 
    res.locals({ title : 'Setup Company Information' })
    return res.render('private/setup-organization-company')
  },

}

function getIntroDate (account, peerId, callback) {
  if (!account) {
    return callback()
  }
  account
    .findActivities()
    .where('peer').equals(peerId)
    .where('type').equals('intro')
    .exec(function (err, docs) {
      if (err) {
        console.error(err, docs)
        return callback(err)
      }
      if (!docs.length) {
        return callback()
      }
      return callback(null, docs[0].created)
    })
  ;
}
