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
            mail = new Mail(email, "Thank you for your interest in MovingWorlds", "We are working as hard as we can to get you access to the Global Experteering Network. Stay tuned.")
            mail.send()
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
      , update,
        mulit: false
      , (err) ->
        unless err
          User.findOne
            email: email
          , (err, user) ->
            unless err
              subject = (if (user.type is "experteer") then "be an experteer" else "represent a social enterprise")
              registerUrl = settings.url + "/register/" + user.invite.coupon
              file = "./views/email_templates/welcome.html"
              mail = new Mail(user.fullName() + "<" + user.email + ">", "Invitation from MovingWorlds to " + subject)
              mail.sendHTML file,
                url: registerUrl

              req.flash "modal", "Thank you for your interest"
              req.flash "modal", "Your information has been submitted"
              req.flash "modal", "<p>We are working as hard as we can to get you access to the Global Experteering Network. Stay tuned. In the mean time consider telling your friends about us and check out our blog.</p><nav class=\"socials\"><ul><li><a href=\"http://www.facebook.com/movingworlds\" class=\"facebook\">Facebook</a></li><li><a href=\"http://twitter.com/markhoroszowski\" class=\"twitter\">Twitter</a></li><li><a href=\"http://plus.google.com/u/0/108922624586110967899/posts\" class=\"googleplus\">Google+</a></li><li><a href=\"http://www.linkedin.com/company/movingworlds\" class=\"linkedin\">LinkedIn</a></li></ul></nav><p class=\"clear\"><a href=\"/blog\" class=\"movingforward\">Moving Forward</a></p>"

              renderInvitePage req, res, user

        else
          req.flash "message", "There was a problem saving your information."
          renderInvitePage req, res, user
]



