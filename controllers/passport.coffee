settings = require("../models").SETTINGS
bcrypt = require("bcrypt")
User = require("../models").User

# , utils = require('util')
passport = require("passport")
LocalStrategy = require("passport-local").Strategy
FacebookStrategy = require("passport-facebook").Strategy
LinkedInStrategy = require("passport-linkedin").Strategy
InternalOAuthError = require("passport-linkedin/node_modules/passport-oauth").InternalOAuthError


passport.serializeUser (user, done) ->
  done null, user.id

passport.deserializeUser (id, done) ->
  User.findById id, (err, user) ->
    done err, user



#/////////////////////////////////////////
#             PASSWORD                  //
#/////////////////////////////////////////
passport.use new LocalStrategy( usernameField: "email", (email, password, done) ->

  unless email
    return done null, false, message: "Please enter your email address"
  unless password
    return done null, false, message: "please provide a password"

  User.findOne email: email, (err, user) ->

    if err
      return done null, false, message: err

    unless user
      return done null, false, message: "User with email <" + email + "> does not exist."

    # if(!user.type || user.type == 'invitee'){
    # 	return done(null, false, { message:'MovingWorlds is an invite only site.'});
    # }
    bcrypt.compare password, user.hash, (err, didSucceed) ->
      if err
        return done(null, false,
          message: "Invalid password."
        )
      return done(null, user)  if didSucceed
      done null, false,
        message: "Invalid password."



)

#/////////////////////////////////////////
#             FACEBOOK                  //
#/////////////////////////////////////////

# passport.use( new FacebookStrategy({
#     clientID: (app.settings.env === 'development') ? settings.apiKeys.facebook.devKey : settings.apiKeys.facebook.key,
#     clientSecret: (app.settings.env === 'development') ? settings.apiKeys.facebook.devSecret : settings.apiKeys.facebook.secret,
#     callbackURL: settings.url+"/auth/facebook/callback"
#   }
# , function(accessToken, refreshToken, profile, done) {
#     User.upsertFacebookUser(..., function (err, user) {
#       if (err) { return done(err); }
#       done(null, user);
#     });
#   }

# process.nextTick(function () {
#   return done(null, profile);
# });

# ));

# app.get('/auth/facebook',
#   	passport.authenticate('facebook'
# 	, {
# 			successRedirect: 'back'
# 		,	failureRedirect: '/login'
# 		}
# ));

#///////////////////////////////////////////
#             LINKEDIN                   //
#/////////////////////////////////////////

# Override userProfile
LinkedInStrategy::userProfile = (token, tokenSecret, params, done) ->
  @_oauth.get "https://api.linkedin.com/v1/people/~:(id,first-name,last-name,headline,location:(name,country:(code)),industry,num-connections,num-connections-capped,summary,specialties,proposal-comments,associations,honors,interests,positions,publications,patents,languages,skills,certifications,educations,three-current-positions,three-past-positions,num-recommenders,recommendations-received,phone-numbers,im-accounts,twitter-accounts,date-of-birth,main-address,member-url-resources,picture-url,site-standard-profile-request:(url),api-standard-profile-request:(url,headers),public-profile-url)?format=json", token, tokenSecret, (err, body, res) ->
    return done(new InternalOAuthError("failed to fetch user profile", err))  if err
    try
      json = JSON.parse(body)
      done null, json
    catch e
      done e

passport.use new LinkedInStrategy(
  consumerKey: settings.apiKeys.linkedin.key
  consumerSecret: settings.apiKeys.linkedin.secret
  callbackURL: settings.apiKeys.linkedin.callback
  passReqToCallback: true
, (req, token, tokenSecret, profile, done) ->
  email = (if (typeof req.user isnt "undefined") then req.user.email else null)
  User.upsertLinkedInUser profile, email, (err, user) ->
    return done(err)  if err
    done err, user

)

#/////////////////////////////////////////
#             GOOGLE                    //
#/////////////////////////////////////////
