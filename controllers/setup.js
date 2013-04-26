var axx = require('./access-control')
var Account = require('../models').Account
var Experteer = require('../models').Experteer
var Organization = require('../models').Organization
var Opportunity = require('../models').Opportunity
var bcrypt = require('bcrypt')
var fs = require('fs')
var mail = require('../mail')

function setup (req, res, next) {
  // handle avatar upload
  if (req.files) {
    req.body.avatar = saveAvatar(req.files, req.user)
  }
  req.user.merge(req.body)
  req.user.save(function (error) {
    if (error) { 
      return next(error) 
    } 
    return res.redirect(req.body.next || 'back') 
  })
}

setup.experteer = {}
setup.organization = {}

setup.all = function (req, res, next) {
  if (req.user.setupBasicComplete() === false) {
    res.locals({ headtype : 'nonav' })
  }
  if (req.user.setupComplete() === false) {
    res.locals({ setup : true })
  }
  return next()
}

setup.invite = function (req, res, next) {
  console.debug('setup.invite')
  Account.findOne({ inviteCoupon : req.params.inviteCoupon })
    .exec(function (error, account) {
      if (error || !account) {
        return next(new Error('MovingWorlds is an invite only community'))
      }
      req.login(account, function (err) {
        console.debug('setup.invite req.login',  err)
        if (err) {
          return next(err)
        }
        return res.redirect('/setup/basic')
      })
    })
  ;
}

setup.password = function (req, res, next) {
  if (!req.body.password && !req.body.confirm) {
    return next()
  }
  if (req.body.password !== req.body.confirm) {
    req.flash('error', 'Your passwords did not match')
    return res.redirect('back')
  }
  req.user.hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
  return next()
}

setup.opportunity = function (req, res, next) { 
  req.user.opportunityUpsert(req.body.opportunity, function (err) {
    if (err) {
      return next(err)
    }
    return res.redirect(req.body.next || '/profile/' 
      + req.user.id + '/' 
      + req.body.opportunity._id) 
  })
}

/**
 * 1. 
 * - Basic Information 
 * - Experteer, Organization 
 * 
 */

setup.basic = function (req, res, next) { 
  console.log('setup.basic', req.user.model)
  Account.findById(req.user.id).exec(function (error, account) {
    if (error) {
      return next(error)
    }
    req.user = account
    res.locals({ title : 'Setup Basic Information' })
    return res.render('private/setup-basic')
  })
}

setup.experteer.basic = function (req, res, next) { 
  console.log('setup.experteer.basic', req.user.model)
  req.user.model = 'experteer'
  req.user.save(function (err) {
    if (err) {
      console.error(err)
    }
    res.redirect('back')
  })
}

setup.organization.basic = function (req, res, next) { 
  console.log('setup.organization.basic', req.user.model)
  req.user.model = 'organization'
  req.user.save(function (err) {
    if (err) {
      console.error(err)
    }
    res.redirect('back')
  })
}

/**
 * 2. 
 * - Personal Information 
 * - Experteer
 * 
 */

setup.experteer.personal = function (req, res, next) { 
  if (req.user.model === 'organization') {
    return res.redirect('/setup/company')
  }
  res.locals({ title : 'Setup Personal Information' })
  return res.render('private/setup-experteer-personal')
}

/**
 * 3. 
 * - Work & Education
 * - Experteer
 * 
 */

setup.experteer.history = function (req, res, next) { 
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
          employer : '',
          city : '',
          position : '',
          current : false
        } 
      ];
  }
  res.locals({ title : 'Setup Work & History' })
  return res.render('private/setup-experteer-history')
}

/**
 * 4. 
 * - Payment
 * - Experteer
 * 
 */

setup.experteer.payment = function (req, res, next) { 
  res.locals({ title : 'Setup Payment Information' })
  return res.render('private/setup-experteer-payment')
}

/**
 * 2. 
 * - Company Information
 * - Organization
 * 
 */

setup.organization.company = function (req, res, next) { 
  res.locals({ title : 'Setup Company Information' })
  return res.render('private/setup-organization-company')
}

/**
 * 3. 
 * - List Opportunity
 * - Organization
 * 
 */

setup.organization.opportunityList = function (req, res, next) { 
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
}

setup.organization.opportunityEdit = function (req, res, next) { 
  Opportunity.findById(req.params.id, function (err, doc) {
    if (err) {
      req.flash('error', err)
      return res.redirect('back')
    }
    res.locals({ title : 'Edit Opportunity' })
    res.locals({ opportunity : doc })
    return res.render('private/setup-organization-opportunity')
  })
}

setup.organization.opportunityDelete = function (req, res, next) { 
  req.user.opportunityRemove(req.params.id, function (error) {
    if (error) { 
      console.error(error)
      return next(error)
    }
    return res.redirect('/landing')
  })
}

/**
 * 4. 
 * - Review
 * - Organization
 * 
 */

setup.organization.review = function (req, res, next) { 
  res.locals({ title : 'Setup Review' })
  return res.render('private/setup-organization-review')
}

setup.charge = function (req, res, next) {
  var params = {
    cents : req.body.cents || 9900,
    stripeToken : req.body.stripeToken
  }
  req.user.charge(params, function (error, response) {
    console.log('Stripe Response', error, response)
    if (error) {
      req.flash('error', error.toString())
      return res.redirect('back')
    }
    req.user.save(function (err) {
      if (err) {
        console.error('Stripe processed CC but it wasnt saved locally.')
      }
      req.flash('success', 'Payment processed successfully')
      return res.redirect('/landing')
    })
  })
}

setup.charge.basic = function (req, res, next) {
  req.body.cents = 9900
  next()
}

setup.charge.premium = function (req, res, next) {
  req.body.cents = 19900
  next()
}

setup.charge.plus = function (req, res, next) {
  req.body.cents = 69900
  next()
}

setup.intro = function (req, res, next) {
  // req.user.id wants to contact req.params._id
  Account.findById(req.params._id, function (error, doc) {
    if (error || !doc) {
      return err(error, 'Oops, something went wrong. Please contact us.')
    }
    return contactRequest(req.user, doc)
  })
  function contactRequest (user, contact) {
    var params = {
      subject : user.name + ', you requested an intro with ' + contact.name,
      to : user.name + '<' + user.email + '>',
      userProfile : user.url,
      userName : user.name,
      contactProfile : contact.url,
      contactName : contact.name
    }
    mail('intro-notification', params, function (error, result) {
      if (error) {
       return err(error, 'Oops, something went wrong. Contact us.')
      }
      user.saveActivity('intro', contact, function (err) {
        if (err) {
         return err(err, 'Oops, something went wrong. Contact us.')
        }
        return success(result, 'The Moving Worlds team will be in touch soon.')
      })
    })
  }
  function err (error, msg) {
    console.error(error, msg)
    req.flash('error', msg)
    return res.redirect('back')
  }
  function success (result, msg) {
    console.notice(result, msg)
    req.flash('success', msg)
    return res.redirect('back')
  }
}

module.exports = function (app) {
  app.get('/invite/:inviteCoupon', setup.invite)
  app.get('/intro-request/:_id', axx.all, setup.intro)
  app.post('/payment/*', axx.experteer)
  app.post('/payment/basic', setup.charge.basic, setup.charge)
  app.post('/payment/premium', setup.charge.premium, setup.charge)
  app.post('/payment/plus', setup.charge.plus, setup.charge)
  app.post('/setup', axx.all, setup.password, setup)
  app.post('/setup/opportunity', setup.opportunity)
  app.get('/setup/*', axx.all, setup.all)
  app.get('/setup/basic', setup.basic)
  app.get('/setup/basic/organization', setup.organization.basic)
  app.get('/setup/basic/experteer', setup.experteer.basic)
  app.get('/setup/personal', setup.experteer.personal)
  app.get('/setup/history', setup.experteer.history)
  app.get('/setup/payment', setup.experteer.payment)
  app.get('/setup/company', setup.organization.company)
  app.get('/setup/opportunity', setup.organization.opportunityList)
  app.get('/setup/opportunity/:id', setup.organization.opportunityEdit)
  app.get('/delete/opportunity/:id', setup.organization.opportunityDelete)
  app.get('/setup/review', setup.organization.review)
}

function saveAvatar (files, user) {
  if (files && files.avatar && files.avatar.length > 0) {
    var file = fs.readFileSync(files.avatar.path)
    var fileName = user._id + '.' + files.avatar.type.split('/')[1]
    var path = __dirname + '/../public/avatars/' + fileName
    fs.writeFileSync(path, file)
    return '/avatars/' + fileName
  }
}
