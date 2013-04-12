User = require('../models').Account
Experteer = require('../models').Experteer
Organization = require('../models').Organization
_ = require('underscore')
moment = require('moment')
passport = require('passport')
bcrypt = require('bcrypt')
util = require('util')
utile = require('utile')
fs = require('fs')
ObjectID = require('mongoose/node_modules/mongodb').ObjectID

# utile.mixin in this file with mongoose models
# is really not going to work well...
# we need to use a merge or an update method

registerInviteCoupon = (req, res, next) ->
  # console.log('registerInviteCoupon 1', req.user)
  # passport.authenticate('local', (err, user, info) ->
  inviteCoupon = req.params.inviteCoupon
  # req.session.returnTo = '/register/' + inviteCoupon
  User.findOne 'inviteCoupon': inviteCoupon , (err, user) ->
    console.log('registerInviteCoupon 3', user)
    if !err && user
      req.logIn user, (err) ->
        next err if err
        res.render 'register',
          title: 'register'
          user: user,
          headtype: 'nonav'
          # warning: req.flash 'warning'
          # error: req.flash 'error'
    else
      next( new Error('MovingWorlds is an invite only community') );
  # )(req, res, next)
  return

register = (req, res, next) ->
  console.log('register', req.body.type, 'user type')
  Experteer.findById req.user._id, (err, user) ->
    # console.log req.body
    return new Error('There was a problem saving your information.')  if err or not user
    # delete user.inviteCoupon;
    user.type = req.body.type
    user.firstName = req.body.firstName
    user.lastName = req.body.lastName
    user.birthday = req.body.birthday
    user.city = req.body.city
    user.country = req.body.country
    user.password = req.body.password
    user.confirm = req.body.confirm
    user.gender = req.body.gender
    user.agree = req.body.agree
    if not user.type or not user.firstName or not user.lastName or not user.birthday or not user.city or not user.country or not user.password or not user.confirm or not user.gender or not user.agree
      req.flash 'error', 'All fields are required'
      return res.redirect('back')
    #2. check passwords and confirm if they are the same
    unless user.password is user.confirm
      req.flash 'error', 'Your passwords did not match'
      return res.redirect('back')
    #3. ensure validation code corresponds with email address
    # TODO:
    #4. make sure type is defined
    if !user.type?
      req.flash 'error', 'Choose "I want to go experteering" or "I want support for my organization"'
      return res.redirect('back')
    password = user.password
    delete user.password
    delete user.confirm
    salt = bcrypt.genSaltSync(10)
    user.hash = bcrypt.hashSync(password, salt)
    # console.log(user.hash, user.salt);
    # Create a new user in your data store
    console.log('saving user...', user)
    user.save (err) ->
      if err 
        console.log err
      next new Error('There was a problem saving your information.')  if err
      # console.log user
      console.log 'saved ' + user.type
      res.redirect '/register/2/' + user.type

registerStepExperteer = (req, res) ->
  console.log('registerStepExperteer')
  req.session.returnTo = '/register/#{req.params.step}/experteer'
  view = 'register/experteer/step' + req.params.step

  Experteer.findById req.user._id , (err, user) ->
    if !err && user
      res.render view,
        title: 'register'
        headtype: 'nonav'
        user: user
    else
      console.log('error locating account', err, user)
      next 'There was an error locating your account.'

saveAvatar = (files, user) ->
  if files && files.avatar && files.avatar.length > 0
    file = fs.readFileSync(files.avatar.path)
    fileName = user._id + '.' + files.avatar.type.split('/')[1]
    path = __dirname + '/../public/avatars/' + fileName
    fs.writeFileSync(path, file)
    return '/avatars/' + fileName

registerTwoExperteer = (req, res) ->
  console.log('registerTwoExperteer', req.user._id)

  Experteer.findById req.user._id, (err, user) ->
    unless user
      console.error 'findById returned nothing', err, user
      req.flash 'message', err
      res.redirect '/register/2/experteer'

    unless err
      user.avatar = saveAvatar(req.files, user)
      user.merge(req.body)

      req.body.skills = if String(req.body.skills).length > 0 then String(req.body.skills).split(',') else []
      req.body.interests = if String(req.body.iterests).length > 0 then String(req.body.iterests).split(',') else []
      req.body.visited = if String(req.body.visited).length > 0 then String(req.body.visited).split(',') else []
      req.body.languages = if String(req.body.languages).length > 0 then String(req.body.languages).split(',') else []

      user.markModified('languages')
      user.markModified('visited')
      user.markModified('interests')
      user.markModified('skills')

      console.log('saving user...', user)
      user.save (err) ->
        unless err
          res.redirect '/register/3/experteer'
        else
          console.error 'save error', err
          req.flash 'message', err
          res.redirect '/register/2/experteer'
    else
      console.error 'findById error', err
      req.flash 'message', err
      res.redirect '/register/2/experteer'

registerThreeExperteer = (req, res) ->
  console.log('registerThreeExperteer')
  Experteer.findById req.user._id, (err, user) ->
    unless err
      # user.industry = req.body.industry
      # user.experience = req.body.experience
      user.merge(req.body)

      # unless user.employment
        # user.employment = []
      # for item of req.body.employer
      #   job = new Object()
      #   for employment in user.employment
      #     if req.body.employerId[item] == employment._id.toString()
      #       employment.employer = req.body.employer[item] or ''
      #       employment.city = req.body.city[item] or ''
      #       employment.position = req.body.position[item] or ''
      #       employment.save (err) ->
      #         if err
      #           console.log(err)
      #   if req.body.employerId? && req.body.employerId[item] == ''
      #     job['employer'] = req.body.employer[item] or ''
      #     job['city'] = req.body.city[item] or ''
      #     job['position'] = req.body.position[item] or ''
      #     user.employment.push job  if job.employer.length > 0 or job.city.length > 0 or job.position.length > 0
      # unless user.education
      #   user.education = []
      # for item of req.body.school
      #   edu = new Object()
      #   for education in user.education
      #     if req.body.educationId[item] == education._id.toString()
      #       education.school = req.body.school[item] or ''
      #       education.major = String(req.body.major[item]).split(',') or []
      #       education.graduated = typeof req.body.graduated[item] isnt 'undefined'  if req.body.hasOwnProperty('graduated')
      #       education.degree = req.body.degree[item] or ''
      #       education.start = req.body.start[item] or ''
      #       education.end = req.body.end[item] or ''
      #       education.save (err) ->
      #         if err
      #           console.log(err)
      #   if req.body.educationId? && req.body.educationId[item] == ''
      #     edu['school'] = req.body.school[item] or ''
      #     edu['major'] = String(req.body.major[item]).split(',') or []
      #     edu['graduated'] = typeof req.body.graduated[item] isnt 'undefined'  if req.body.hasOwnProperty('graduated')
      #     edu['degree'] = req.body.degree[item] or ''
      #     edu['start'] = req.body.start[item] or ''
      #     edu['end'] = req.body.end[item] or ''
      #     user.education.push edu  if edu.school.length > 0 or edu.degree.length > 0 or edu.graduted or edu.degree.start > 0 or edu.degree.end > 0


      console.log('saving info', req.body, user)
      
      user.markModified('employment')
      user.markModified('education')

      user.save (err) ->
        unless err
          res.redirect '/register/4/experteer'
        else
          req.flash 'message', err
          res.redirect '/register/3/experteer'
    else
      req.flash 'message', err
      res.redirect '/register/3/experteer'

registerStepOrganization = (req, res) ->
  console.log('registerStepOrganization')
  view = 'register/organization/step' + req.params.step
  rep_id = req.user._id
  organization = new Organization()
  Organization.findOne rep_id: rep_id, (err, org) ->
    if err == null && org != null
      utile.mixin(organization, org)
    res.render view,
      title: 'register'
      headtype: 'nonav'
      org: organization

registerTwoOrganization = (req, res) ->
  console.log('registerTwoOrganization')
  rep_id = req.user._id
  organization = new Organization()
  organization.rep_id = rep_id
  Organization.findOne rep_id: rep_id, (err, org) ->
    if err == null && org != null
      utile.mixin(organization, org)
    # Upload Avatar
    if req.files && req.files.avatar && req.files.avatar.length > 0
      file = fs.readFileSync(req.files.avatar.path)
      fileName = 'logo_' + rep_id + '.' + req.files.avatar.type.split('/')[1]
      path = __dirname + '/../public/avatars/' + fileName
      fs.writeFileSync(path, file)
      req.body.avatar = '/avatars/' + fileName
    utile.mixin(organization, req.body);
    organization.save (err) ->
      unless err
        res.redirect '/register/3/organization'
      else
        req.flash 'message', err
        res.redirect '/register/2/organization'

registerThreeOrganization = (req, res) ->
  console.log('registerThreeOrganization')
  rep_id = req.user._id
  Organization.findOne rep_id: rep_id, (err, org) ->
    unless err
      org.opportunities.push req.body.opportunity
      org.save (err) ->
        unless err
          res.redirect '/register/4/organization'
        else
          console.log err
          req.flash 'message', err
          res.redirect '/register/3/organization'
    else
      req.flash 'message', err
      res.redirect '/register/3/organization'

module.exports = [
#     path : '/register/:inviteCoupon'
#     type : 'GET'
#     action : registerInviteCoupon
#   ,
#     path : '/register'
#     type : 'POST'
#     action : register
#   ,
#     path : '/register/:step/experteer'
#     type : 'GET'
#     login : 'experteer'
#     action : registerStepExperteer
#   ,
#     path : '/register/2/experteer'
#     type : 'POST'
#     login : 'experteer'
#     action : registerTwoExperteer
#   ,
#     path : '/register/3/experteer'
#     type : 'POST'
#     login : 'experteer'
#     action : registerThreeExperteer
#   ,
#     path : '/register/:step/organization'
#     type : 'GET'
#     login : 'org'
#     action : registerStepOrganization
#   ,
#     path : '/register/2/organization'
#     type : 'POST'
#     login : 'org'
#     action : registerTwoOrganization
#   ,
#     path : '/register/3/organization'
#     type : 'POST'
#     login : 'org'
#     action : registerThreeOrganization
]



# /setup/basic
# /setup/personal
# /setup/experience
# /setup/payment

# /setup/basic
# /setup/company
# /setup/opportunity






