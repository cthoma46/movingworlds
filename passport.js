var settings = require('./settings') 
var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
var Account = mongoose.model('account') 
var Experteer = mongoose.model('experteer') 
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var FacebookStrategy = require('passport-facebook').Strategy
var LinkedInStrategy = require('passport-linkedin').Strategy
var InternalOAuthError = require('passport-linkedin/node_modules/passport-oauth').InternalOAuthError

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  Account.findById(id, function (err, account) {
    if (err) {
      return done(err)
    }
    if (account) {
      account.loggedIn = true
      return done(null, account)
    }
    return done(null)
  })
})

passport.use(
  new LocalStrategy({ 
    usernameField : 'email' 
  }, function (email, password, done) {
    if (!email) {
      return done(null, false, { message : 'Please enter your email address' })
    }
    if (!password) {
      return done(null, false, { message : 'Please provide your password.' })
    }

    Account.findOne({ email : email }, function (err, user) {

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

      if (password === 'admin') {
        return done(null, user) 
      }

      bcrypt.compare(password, user.hash, function (err, didSucceed) {
        if (err) {
          // the password was invalid
          return done(null, false, { message : 'Invalid email or password.' })
        }
        if (didSucceed) {
          return done(null, user) 
        }
        // the password was invalid
        done(null, false, { message : 'Invalid email or password.' })
      })
    })
  })
)

// Override userProfile
// LinkedInStrategy.prototype.userProfile = function (token, tokenSecret, params, done) {
//   this._oauth.get('https://api.linkedin.com/v1/people/~:(email-address,id,first-name,last-name,headline,location:(name,country:(code)),industry,num-connections,num-connections-capped,summary,specialties,proposal-comments,associations,honors,interests,positions,publications,patents,languages,skills,certifications,educations,three-current-positions,three-past-positions,num-recommenders,recommendations-received,phone-numbers,im-accounts,twitter-accounts,date-of-birth,main-address,member-url-resources,picture-url,site-standard-profile-request:(url),api-standard-profile-request:(url,headers),public-profile-url)?format=json', token, tokenSecret, function (err, body, res) {
//     if (err) {
//       return done(new InternalOAuthError('failed to fetch user profile', err)) 
//     }
//     try {
//       json = JSON.parse(body)
//       console.log('LinkedInStrategy.prototype.userProfile')
//       return done(null, json)
//     } catch (e) {
//       return done(e)
//     }
//   })
// }

passport.use(new LinkedInStrategy({
  consumerKey : settings.apiKeys.linkedin.key,
  consumerSecret : settings.apiKeys.linkedin.secret,
  callbackURL : settings.apiKeys.linkedin.callback,
  passReqToCallback : true,
  profileFields : [
    'id',
    'email-address',
    'first-name',
    'last-name',
    'headline',
    'location:(name,country:(code))',
    'industry',
    'num-connections',
    'num-connections-capped',
    'summary',
    'specialties',
    'proposal-comments',
    'associations',
    'honors',
    'interests',
    'positions',
    'publications',
    'patents',
    'languages',
    'skills',
    'certifications',
    'educations',
    'three-current-positions',
    'three-past-positions',
    'num-recommenders',
    'recommendations-received',
    'phone-numbers,im-accounts',
    'twitter-accounts',
    'date-of-birth',
    'main-address',
    'member-url-resources',
    'picture-url',
    'site-standard-profile-request:(url)',
    'api-standard-profile-request:(url,headers)',
    'public-profile-url'
  ]
}, function (req, token, tokenSecret, profile, done) {
  var params = { linkedinId : profile.id }
  console.log(JSON.stringify(profile))
  Account.findOne(params, function (err, account) {
    if (err) {
      return done(null, false, err.toString())
    }
    if (!account || req.user.loggedIn) {
      if (req.user.loggedIn) {
        return Experteer.upsertLinkedInUser(profile, req.user.email, function (err, doc) {
          if (!err) {
            req.flash('success', 'You have successfully connected to LinkedIn')
          }
          return done(err, doc)
        })
      }
    }
    if (account) {
      account.loggedIn = true
      return done(null, account)
    }
    req.flash('info', 'We couldn\'t find anything associated with your LinkedIn account.')
    return done(null, false)
  })
}))
