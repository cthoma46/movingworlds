// var _ = require('underscore')
var mongoose = require('mongoose')
var plugins = require('./plugins')
var Lang = require('../lang') 
var positionKeys = Object.keys(Lang.en.Organization.Positions)
var sizeKeys = Object.keys(Lang.en.Organization.Sizes)
var statusKeys = Object.keys(Lang.en.Organization.Statuses)
var typeKeys = Object.keys(Lang.en.Organization.Types)

var Organization = new mongoose.Schema({
  orgName :       { type : String },
  orgPosition :   { type : String },
  orgRegistered : { type : String, default : 'no' },
  orgRegisteredLocation : { type : String },
  orgRegisteredYear : { type : String },
  orgPosition :   { type : String, enum : positionKeys },
  orgSize :       { type : String, default : 'earlyStartup', enum : sizeKeys },
  orgStatus :     { type : String, default : 'off', enum : statusKeys },
  orgType :       { type : String, default : 'profit', enum : typeKeys }
}, { 
  strict : 'throw', 
  collection : 'accounts', 
  discriminatorKey : 'model',
  toJSON : { getters : true, virtuals : true },
  toObject : { getters : true, virtuals : true }
})

Organization
  .plugin(plugins.account)
  .plugin(plugins.activity)
  .plugin(plugins.search, { excluded : [ '_id' ] })
  .plugin(plugins.opportunity)
  .plugin(plugins.incompleteFields)
  .plugin(plugins.discriminatorKey)

Organization.virtual('name').get(function () {
  return this.orgName
})

/**
 * Position in the organization that the user of this account holds
 * @return {String}
 */
Organization.virtual('position').get(function () { 
  return Lang.en.Organization.Positions[this.orgPosition]
})

/**
 * Size of the Organization
 * - returns `key`, `title`, `description` properties
 * @return {Object}
 */
Organization.virtual('size').get(function () { 
  return Lang.en.Organization.Sizes[this.orgSize]
})

/**
 * Status or availability of Opportunities
 * - returns `key`, `title`, `description` properties
 * @return {Object}
 */
Organization.virtual('status').get(function () { 
  return Lang.en.Organization.Statuses[this.orgStatus]
})

/**
 * Type of organization
 * @return {String}
 */
Organization.virtual('type').get(function () { 
  return Lang.en.Organization.Types[this.orgType]
})

/**
 * Check is the profile is considered completely registered
 * 
 */
 
// Organization.method('setupComplete', function () { 
//   return (this.hash !== undefined
//     && this.setupBasicComplete() 
//     && this.setupCompanyComplete() 
//     && this.setupOpportunityComplete())
// })

// Organization.method('setupCompanyComplete', function () { 
//   return (this.orgName !== undefined
//     && this.orgType !== undefined
//     && this.orgSize !== undefined)
// })

// Organization.method('setupOpportunityComplete', function () { 
//   return (typeof this.orgStatus !== undefined
//     && this.orgStatus === 'on')
// })

// Organization.method('setupReviewComplete', function () { 
//   return !!this.verified
// })

Organization.pre('save', function (next) {
  var account = this
  account.opportunityList().exec(function (err, docs) {
    if (err || !docs) {
      account.orgStatus = 'off'
    } else {
      account.orgStatus = 'on'
    }
    next()
  })
})

module.exports = Organization
