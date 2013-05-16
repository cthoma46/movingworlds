var mongoose = require('mongoose')
var troop = require('mongoose-troop')
var Lang = require('../../lang') 
var AccountSchema = require('./account')

var OrganizationSchema = AccountSchema.extend({
  orgName : String,
  orgPosition : String,
  orgRegistered : { type : String, default : 'no' },
  orgRegisteredLocation : String,
  orgRegisteredYear : String
}, { 
  discriminatorKey : 'model', 
  collection : 'accounts' 
})

OrganizationSchema.add({ 

  /**
   * Position in the organization that the user of this account holds
   * 
   * @return {String}
   */
  orgPosition : { 
    type : String,
    enum : Object.keys(Lang.en.Organization.Positions)
  },

  /**
   * Size of the Organization
   * - returns `key`, `title`, `description` properties
   *
   * @return {Object}
   */
  orgSize : { 
    type : String,
    enum : Object.keys(Lang.en.Organization.Sizes)
  },

  /**
   * Status or availability of Opportunities
   * - returns `key`, `title`, `description` properties
   * 
   * @return {Object}
   */
  orgStatus : { 
    type : String,
    enum : Object.keys(Lang.en.Organization.Statuses)
  },

  /**
   * Type of organization
   * 
   * @return {String}
   */
  orgType : { 
    type : String,
    enum : Object.keys(Lang.en.Organization.Types)
  }
})

OrganizationSchema.virtual('name').get(function () {
  return this.orgName
})

OrganizationSchema.virtual('position').get(function () { 
  return Lang.en.Organization.Positions[this.orgPosition]
})

OrganizationSchema.virtual('size').get(function () { 
  return Lang.en.Organization.Sizes[this.orgSize]
})

OrganizationSchema.virtual('status').get(function () { 
  return Lang.en.Organization.Statuses[this.orgStatus]
})

OrganizationSchema.virtual('type').get(function () { 
  return Lang.en.Organization.Types[this.orgType]
})

/**
 * Return a list of all opportunities
 * 
 */

OrganizationSchema.method('opportunityList', function (next) {
  return mongoose.model('opportunity').find({ organization : this._id })
})

/**
 * Add new or edit an existing opportunity
 * 
 */

OrganizationSchema.method('opportunityUpsert', function (params, next) {
  var Opportunity = mongoose.model('opportunity')
  var account = this
  var instance

  params.organization = params.organization || this._id
  
  Opportunity.findById(params._id).exec(function (err, doc) {
    if (err) {
      console.error(err)
      return next(err)
    } else if (doc) {
      instance = doc.merge(params)
      return then()
    } else {
      instance = new Opportunity(params)
      return then()
    }
  })

  function then () {
    instance.save(function (error) {
      if (error) {
        console.error(error)
        return next(error)
      }
      return account.save(next)
    })
  }
})

/**
 * Remove an opportunity
 * 
 */

OrganizationSchema.method('opportunityRemove', function (_id, next) {
  return mongoose.model('opportunity').findByIdAndRemove(_id, next)
})

/**
 * Ensure certain defaults exist before saving
 * 
 */

OrganizationSchema.pre('save', function (next) {
  if (this.orgRegistered === undefined) { 
    this.orgRegistered = 'earlyStartup'
  } 
  if (this.orgType === undefined) { 
    this.orgType = 'profit'
  }
  if (this.orgStatus === undefined) { 
    this.orgStatus = 'off'
  }
  if (this.orgSize === undefined) { 
    this.orgSize = 'earlyStartup'
  }
  next()
})

OrganizationSchema.pre('save', function (next) {
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

/**
 * Check is the profile is considered completely registered
 * 
 */
 
OrganizationSchema.method('setupComplete', function () { 
  return (this.hash !== undefined
    && this.setupBasicComplete() 
    && this.setupCompanyComplete() 
    && this.setupOpportunityComplete())
})

OrganizationSchema.method('setupCompanyComplete', function () { 
  return (this.orgName !== undefined
    && this.orgType !== undefined
    && this.orgSize !== undefined)
})

OrganizationSchema.method('setupOpportunityComplete', function () { 
  return (typeof this.orgStatus !== undefined
    && this.orgStatus === 'on')
})

OrganizationSchema.method('setupReviewComplete', function () { 
  return !!this.verified
})

module.exports = OrganizationSchema
