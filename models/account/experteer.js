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
  if (this.employment === undefined ) { 
    this.employment = [];
  } 

  // 
  // education list defaults
  // 
  if (this.education === undefined) { 
    this.education = [];
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
    && this.description.length > 0 
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
