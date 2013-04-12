
User = require('../models').Account
mail = require('../mail')
settings = require('../settings')
utils = require('../utils')

renderInvitePage = (req, res, user) ->
  res.render 'invite',
    title: 'invite'
    headline: 'Thank you for your interest in MovingWorlds!'
    body: 'We\'ll review your invitation request and be in touch soon. You can speed up your invite process by telling us a little more about yourself.'
    headtype: 'nonav'
    user: user
    modal: req.flash('modal')


module.exports = [

    path: '/invite'
    type: 'POST'
    action: (req, res) ->
      email = req.body.email
      if not email or not utils.validateEmail(email)
        req.flash 'error', 'Please enter a valid email address'
        res.redirect '/login'
        return
      User.find(email: email).count().exec (err, total) ->
        unless err
          if total is 0

            mail('invitation-request',  
              to : email
              subject : 'You requested an invitation to MovingWorlds' 
            (err, message) ->

              console.log err, message

              user = new User()
              user.email = email
              user.created = new Date()

              console.log('/invite', user)

              user.save (err) ->
                console.log('user saved', user)
                renderInvitePage req, res, user


            )

            # mail = new Mail(email, 'You requested an invitation to MovingWorlds')
            # file = './views/email_templates/invitation_request.html'
            # mail.sendHTML file

          else
            console.log('You\'ve already requested an invite.')
            req.flash 'warning', 'You\'ve already requested an invite.'
            res.redirect 'back'
  ,

    path: '/invite_extras'
    type: 'POST'
    action: (req, res) ->
      # email = req.body.email or req.body.invite_email
      # update =
      #   firstname: req.body.firstName
      #   lastname: req.body.lastName
      #   recommendedBy: req.body.recommendedBy
      #   type: req.body.type

      console.log('invite_extras', req.body.email, req.body)
      User.findOne email: req.body.email, (error, user) ->
        if !user
          console.log('could not find that user', req.body.email)
          req.flash 'message', 'There was a problem saving your information.'
          renderInvitePage req, res, user
        unless error
          user.merge(req.body).save (err) ->
            unless err
              setupUrl = settings.url + '/invite/' + user.inviteCoupon
              mail('invitation',  
                to : user.name + '<' + user.email + '>'
                subject : 'Your invitation from MovingWorlds'
                url : setupUrl
              )

              # file = './views/email_templates/invitation.html'
              # mail = new Mail(user.fullName + '<' + user.email + '>', 'Your invitation from MovingWorlds')
              # mail.sendHTML file,
              #   url: setupUrl

              req.flash 'modal', 'Thank you for your interest'
              req.flash 'modal', 'We have sent you an email with your personal invitation code. Please follow it\'s instructions to sign up to MovingWorlds.'
              req.flash 'modal', '<nav class="socials"><ul><li><a href="http://www.facebook.com/movingworlds" class="facebook">Facebook</a></li><li><a href="http://twitter.com/experteering" class="twitter">Twitter</a></li><li><a href="http://plus.google.com/u/0/108922624586110967899/posts" class="googleplus">Google+</a></li><li><a href="http://www.linkedin.com/company/movingworlds" class="linkedin">LinkedIn</a></li></ul></nav><p class="clear"><a href="/blog" class="movingforward">Moving Forward</a></p>'
              renderInvitePage req, res, user
            else
              console.log('something...', err, req.body.email, user)
              req.flash 'message', 'There was a problem saving your information.'
              renderInvitePage req, res, user
        else
          console.log('something...', error, email, user)
          req.flash 'message', 'There was a problem saving your information.'
          renderInvitePage req, res, user
]