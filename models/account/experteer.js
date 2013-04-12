var mongoose = require('mongoose')
var troop = require('mongoose-troop')
var Lang = require('../../lang') 
var AccountSchema = require('./account')
var moment = require('moment')

var ExpertSchema = AccountSchema.extend({
  linkedinId : String,
  experienceYears : Number,
  experteerStart : { 
    type : Date, 
    get : function (val) { 
      return moment(val).format('MM/DD/YYYY')
    } 
  },
  experteerEnd : { 
    type : Date, 
    get : function (val) { 
      return moment(val).format('MM/DD/YYYY')
    } 
  },
  experteerCompensation : String,     // profile
  experteerSupportArea : String,      // profile -- was industry
  experteerMotivation : String        // profile
}, { 
  discriminatorKey : 'model', 
  collection : 'accounts'
})

// 
// convert usa,england,canada to [ 'usa', 'england', 'canada' ] 
// 
function stringToArray (val) {
  if (!Array.isArray(val)) {
    return val.split(',')
  }
  return val
}

ExpertSchema.add({
  supportArea : { type : [ String ], set : stringToArray },
  interests : { type : [ String ], set : stringToArray },
  languages : { type : [ String ], set : stringToArray },
  skills : { type : [ String ], set : stringToArray },
  visited : { type : [ String ], set : stringToArray }
})

/**
 * Add object types 
 * 
 */

ExpertSchema.add({
  experteerCountries : { type : [ String ] },
  experteerEnvironment : { type : [ String ] },
  experteerImpact : { type : [ String ] },
  employment :  [ mongoose.Schema.Types.Mixed ],
  education : [ mongoose.Schema.Types.Mixed ]
})


/**
 * Status indicating experteering availability
 * - returns `key`, `title`, `description` properties
 * 
 * @return {Object}
 */

ExpertSchema.add({ 
  experteerStatus : { 
    type : String,
    enum : Object.keys(Lang.en.Experteer.Statuses)
  }
})

/**
 * Ensure certain defaults exist before saving
 * 
 */

ExpertSchema.pre('save', function (next, done) {

  // 
  // employment list defaults
  // 
  if (this.employment === undefined || this.employment.length === 0) { 
    this.employment = [
      {
        employer : '',
        city : '',
        position : '',
        current : false
      }
    ]
  } 

  // 
  // education list defaults
  // 
  if (this.education === undefined || this.education.length === 0) { 
    this.education = [
      {
        school : '',
        major : '',
        degree : '',
        start : '',
        end : ''
      }
    ]
  } 

  if (this.experteerStatus === undefined) { 
    this.experteerStatus = 'on'
  } 
  if (this.experteerCountries === undefined) { 
    this.experteerCountries = []
  } 
  if (this.experteerEnvironment === undefined) { 
    this.experteerEnvironment = []
  } 
  if (this.experteerImpact === undefined) { 
    this.experteerImpact = []
  } 
  if (this.supportArea === undefined) { 
    this.supportArea = []
  } 
  if (this.interests === undefined) { 
    this.interests = []
  } 
  if (this.languages === undefined) { 
    this.languages = []
  } 
  if (this.skills === undefined) { 
    this.skills = []
  } 
  if (this.visited === undefined) { 
    this.visited = []
  } 
  next()
})

ExpertSchema.virtual('name').get(function () {
  return this.firstname + ' ' + this.lastname
})

ExpertSchema.virtual('status').get(function () { 
  return Lang.en.Experteer.Statuses[this.experteerStatus]
})

/**
 * Check is the profile is considered completely registered
 * 
 */

ExpertSchema.method('setupComplete', function () {
  return (this.setupBasicComplete() 
    && this.setupPersonalComplete() 
    && this.setupHistoryComplete() 
    && this.setupBillingComplete())
})

ExpertSchema.method('setupPersonalComplete', function () { 
  return (this.headline !== undefined
    && this.description !== undefined
    && this.languages !== undefined
    && this.experteerStart !== undefined
    && this.experteerEnd !== undefined)
})

ExpertSchema.method('setupHistoryComplete', function () { 
  return (this.education !== undefined
    && this.employment !== undefined
    && this.education.length > 0
    && this.employment.length > 0
    && this.employment[0].employer.length > 0)
})

ExpertSchema.method('setupBillingComplete', function () { 
  return ((this.plan > 0) || (this.stripeCharges !== undefined
    && this.stripeCharges.length > 0))
})

module.exports = ExpertSchema

ExpertSchema.statics.upsertLinkedInaccount = function (data, email, callback) {
  this
    .findOne({ $or : [ { linkedinId : data.id, email : email } ] })
    .exec(function (err, account) {
      if (err || !account) {
        return callback(new Error('Moving Worlds is an invite only community'))
      }
      return addData(account, callback)
    })
  ;

  function addData (account, callback) {
    console.log('Found existing account. Linkedin ID: ', account.linkedinId, ' Email: ' + email)
    if (account.linkedinId) {
      console.log('User already synced linkedIn account')
      return callback(null, account)
    } 
    console.log('Syncing linkedin data with existing account')
    account.linkedinId = data.id

    // name and basic info
    account.firstname = account.firstname || data.firstName
    account.lastname = account.lastname || data.lastName
    account.headline = data.headline
    account.description = data.summary
    account.industry = data.industry

    // location 
    if (typeof data.location !== 'undefined') {
      account.city = account.city || data.location.name
      account.country = account.country || data.location.country.code.toUpperCase()
    }

    // avatar 
    account.avatar = account.avatar || data.pictureUrl

    // birthday 
    if (data.dateOfBirth) {
      account.birthday = account.birthday || new Date(data.dateOfBirth.year, data.dateOfBirth.month, data.dateOfBirth.day)
    }

    // skills 
    account.skills = account.skills || []
    for (var skill in data.skills.values) {
      account.skills.push(skill.skill.name)
    }

    // interests 
    account.interests = account.interests || []
    for (var interest in data.interests.split(',')) {
      account.interests.push(interest)
    }

    // languages 
    account.languages = account.languages || []
    for (var lang in data.languages.values) {
      account.languages.push(lang.language.name)
    }

    // website url 
    if (data.memberUrlResources._total > 0) {
      account.linksUrl = data.memberUrlResources.values[0].url
    }

    // twitter url 
    if (data.twitterAccounts._total > 0) {
      account.linksTwitter = 'http://www.twitter.com/' 
        + data.twitterAccounts.values[0].providerAccountName
    }

    // linkedin url 
    account.linksLinkedin = data.publicProfileUrl

    // employment 
    account.employment = account.employment || []

    for (var position in data.positions.values) {
      if (typeof position.startDate !== 'undefined') {
        var start = new Date(position.startDate.year, position.startDate.month, 1)
      }
      if (typeof position.endDate !== 'undefined') {
        var end = new Date(position.endDate.year, position.endDate.month, 1)
      }
      account.employment.push({
        employer : position.company.name,
        position : position.title,
        current : position.isCurrent,
        start : start,
        end : end
      })
    }

    // employment 
    account.education = account.education || []
    for (var education in data.educations.values) {
      if (typeof education.startDate.year !== 'undefined' && typeof education.startDate.month !== 'undefined') {
        var start = new Date(education.startDate.year, education.startDate.month, 1)
      }
      if (typeof education.endDate.year !== 'undefined' && typeof education.endDate.month !== 'undefined') {
        var end = new Date(education.endDate.year, education.endDate.month, 1)
      }

      account.education.push({
        school : education.schoolName,
        major : education.fieldOfStudy,
        degree : education.degree,
        start : start,
        end : end
      })
    }

    account.save(function (err) {
      callback(err, account)
    })

  }

}
