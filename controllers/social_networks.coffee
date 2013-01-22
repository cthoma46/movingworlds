passport = require("passport")

module.exports = (app) ->

  app.get "/auth/linkedin", passport.authenticate('linkedin'), (req, res) ->
    console.log "LinkedIn: ", req.url

  # The request will be redirected to LinkedIn for authentication, so this function will not be called.
  app.get "/auth/linkedin/callback", passport.authenticate("linkedin", failureRedirect: "/login"), (req, res) ->
    console.log "LinkedIn Success"
    req.flash "error", "You have successfully connected to LinkedIn"
    res.redirect req.session.redirect or "/landing"