User = require("../models").User
Mail = require("../models").Mail
settings = require("../models").SETTINGS
utils = require("../models").utils

renderInvitePage = (req, res, user) ->
  res.render "invite",
    title: "invite"
    headline: "Thank you for your interest in MovingWorlds!"
    body: "We'll review your invitation request and be in touch soon. You can speed up your invite process by telling us a little more about yourself."
    headtype: "nonav"
    newUser: user
    modal: req.flash('modal')


module.exports = [

    path: "/invite"
    type: "POST"
    action: (req, res) ->
      email = req.body.email
      if not email or not utils.validateEmail(email)
        req.flash "error", "Please enter a valid email address"
        res.redirect "/login"
        return
      User.find(email: email).count().exec (err, total) ->
        unless err
          if total is 0
            mail = new Mail(email, "You requested an invitation to MovingWorlds")
            file = "./views/email_templates/invitation_request.html"
            mail.sendHTML file

            user = new User()
            user.email = email
            user.created = new Date()
            user.save (err) ->
              renderInvitePage req, res, user

          else
            req.flash "warning", "You've already requested an invite."
            res.redirect "back"
  ,

    path: "/invite_extras"
    type: "POST"
    action: (req, res) ->
      email = req.body.email or req.body.invite_email
      update =
        first_name: req.body.first_name
        last_name: req.body.last_name
        recommended_by: req.body.recommended_by
        type: req.body.type

      User.update
        email: email
      , update
      , { multi: false }
      , (err) ->
        unless err
          User.findOne
            email: email
          , (err, user) ->
            unless err
              registerUrl = settings.url + "/register/" + user.invite.coupon
              file = "./views/email_templates/invitation.html"
              mail = new Mail(user.fullName() + "<" + user.email + ">", "Your invitation from MovingWorlds")
              mail.sendHTML file,
                url: registerUrl

              req.flash "modal", "Thank you for your interest"
              req.flash "modal", "We have sent you an email with your personal invitation code. Please follow it's instructions to sign up to MovingWorlds."
              req.flash "modal", "<nav class=\"socials\"><ul><li><a href=\"http://www.facebook.com/movingworlds\" class=\"facebook\">Facebook</a></li><li><a href=\"http://twitter.com/experteering\" class=\"twitter\">Twitter</a></li><li><a href=\"http://plus.google.com/u/0/108922624586110967899/posts\" class=\"googleplus\">Google+</a></li><li><a href=\"http://www.linkedin.com/company/movingworlds\" class=\"linkedin\">LinkedIn</a></li></ul></nav><p class=\"clear\"><a href=\"/blog\" class=\"movingforward\">Moving Forward</a></p>"

              renderInvitePage req, res, user

        else
          req.flash "message", "There was a problem saving your information."
          renderInvitePage req, res, user
]