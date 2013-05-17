var settings = require('./settings') 
var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
var User = mongoose.model('account') 

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var FacebookStrategy = require('passport-facebook').Strategy
var LinkedInStrategy = require('passport-linkedin').Strategy
var InternalOAuthError = require('passport-linkedin/node_modules/passport-oauth').InternalOAuthError

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  User.findById(id, done)
})

passport.use(
  new LocalStrategy({ 
    usernameField : 'email' 
  }, function (email, password, done) {
    console.log('LocalStrategy')

    if (!email) {
      return done(null, false, { message : 'Please enter your email address' })
    }
    if (!password) {
      return done(null, false, { message : 'Please provide your password.' })
    }

    User.findOne({ email : email }, function (err, user) {

      if (err) {
        return done(null, false, { message : err })
      }

      // the user was not found
      if (!user) { 
        return done(null, false, { message : 'Invalid email or password.' })
      }

      // the user was found but they didnt complete registration
      if (!user.hash) {
        return done(null, false, { message : 'Please use the invitation link we emailed to ' + email + ' in order to finish registering your account.' })
      }

      bcrypt.compare(password, user.hash, function (err, didSucceed) {
        if (err) {
          // the password was invalid
          return done(null, false, { message : 'Invalid email or password.' })
        }
        if (didSucceed) {
          // successful login
          return done(null, user) 
        }
        // the password was invalid
        done(null, false, { message : 'Invalid email or password.' })
      })
    })
  })
)

// Override userProfile
LinkedInStrategy.prototype.userProfile = function (token, tokenSecret, params, done) {
  this._oauth.get('https://api.linkedin.com/v1/people/~:(id,first-name,last-name,headline,location:(name,country:(code)),industry,num-connections,num-connections-capped,summary,specialties,proposal-comments,associations,honors,interests,positions,publications,patents,languages,skills,certifications,educations,three-current-positions,three-past-positions,num-recommenders,recommendations-received,phone-numbers,im-accounts,twitter-accounts,date-of-birth,main-address,member-url-resources,picture-url,site-standard-profile-request:(url),api-standard-profile-request:(url,headers),public-profile-url)?format=json', token, tokenSecret, function (err, body, res) {
    if (err) {
      return done(new InternalOAuthError('failed to fetch user profile', err)) 
    }
    try {
      json = JSON.parse(body)
      return done(null, json)
    } catch (e) {
      return done(e)
    }
  })
}

passport.use(new LinkedInStrategy({
  consumerKey : settings.apiKeys.linkedin.key,
  consumerSecret : settings.apiKeys.linkedin.secret,
  callbackURL : settings.apiKeys.linkedin.callback,
  passReqToCallback : true
}, function (req, token, tokenSecret, profile, done) {
  req.user 
  var email = req.user.email || null 
  User.upsertLinkedInUser(profile, email, done)
}))
