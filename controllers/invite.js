var mongoose = require('mongoose')
var Account = mongoose.model('account')
var Organization = mongoose.model('organization')
var moment = require('moment')
var ObjectId = mongoose.Types.ObjectId
var utile = require('utile')
var Lang = require('../lang')

var _ = require('underscore')
var mongoose = require('mongoose')
var User = mongoose.model('account') 
var mail = require('../mail')
var settings = require('../settings')
var inviteRequestedSubject = 'You requested an invitation to MovingWorlds' 
var inviteSubject = 'Your invitation from MovingWorlds'
var savingError = 'There was a problem saving your information.'
var inviteStepOneHeadline = 'Get Started!'
var inviteStepOneMessage = 'Please give us a little more information about yourself so that we can properly invite you to MovingWorlds.'
var invalidEmail = 'Please enter a valid email address'
var inviteAlreadyRequested = 'You have already requested an invite. If you don\'t remember your account or need a new invite email, please let us know at info@movingworlds.org'
var inviteSentModal = []
inviteSentModal[0] = 'Thank you for your interest'
inviteSentModal[1] = 'We have sent you an email with your personal invitation code. Please follow it\'s instructions to sign up to MovingWorlds.'
inviteSentModal[2] = '<nav class="socials"><ul><li><a href="http://www.facebook.com/movingworlds" class="facebook">Facebook</a></li><li><a href="http://twitter.com/experteering" class="twitter">Twitter</a></li><li><a href="http://plus.google.com/u/0/108922624586110967899/posts" class="googleplus">Google+</a></li><li><a href="http://www.linkedin.com/company/movingworlds" class="linkedin">LinkedIn</a></li></ul></nav><p class="clear"><a href="/blog" class="movingforward">Moving Forward</a></p>'

module.exports = { 
  invite : function (req, res) {
    var email = req.body.email
    if (!email || !_.validateEmail(email)) {
      req.flash('error', invalidEmail)
      return res.redirect('/login')
    }
    User.findOne({ email : email }).exec(function (err, user) {
      console.log(user)
      if (err) { 
        req.flash('error', err)
        return res.redirect('back')
      }
      if (user == null) {
        mail('invitation-request', { 
          to : email,
          subject : inviteRequestedSubject
        }, function (err, message) {
          if (err) {
            console.error(err, 'message', message)
            req.flash('error', err.message)
            // return res.redirect('back')
          }
          user = new User()
          user.email = email
          user.created = new Date()
          user.save(function (err) {
            return renderInvitePage(req, res, user)
          })
        })
      } else {
        return renderInvitePage(req, res, user)
      }
    })
  }, 
  inviteExtras : function (req, res) {
    User.findOne({ email : req.body.email }, function (error, user) {
      if (!user) {
        console.warning(savingError)
        req.flash('message', savingError)
        return renderInvitePage(req, res, user)
      }
      if (!error) {
        user.merge(req.body).save(function (err) {
          if (!err) {
            mail('invitation', {
              to : user.name + '<' + user.email + '>',
              subject : inviteSubject,
              url : settings.url + '/invite/' + user.inviteCoupon
            }, function (err, message) {
              if (err) {
                console.error(err, 'message', message)
                req.flash('error', err.message)
                // return res.redirect('back')
              }
              req.flash('modal', inviteSentModal[0])
              req.flash('modal', inviteSentModal[1])
              req.flash('modal', inviteSentModal[2])
              return renderInvitePage(req, res, user)
            })
          } else {
            req.flash('message', savingError)
            return renderInvitePage(req, res, user)
          }
        })
      } else {
        req.flash('message', savingError)
        return renderInvitePage(req, res, user)
      }
    })
  },
}

function renderInvitePage (req, res, user) {
  res.render('invite', {
    title : 'invite',
    headline : inviteStepOneHeadline,
    body : inviteStepOneMessage,
    headtype : 'nonav',
    user : user,
    modal : req.flash('modal')
  })
}
