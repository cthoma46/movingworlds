var settings = process.settings
var _ = require('underscore')
var crypto = require('crypto')
var mongoose = require('mongoose')
var moment = require('moment')
var Lang = require('../../lang') 
var stripe = require('stripe')(settings.apiKeys.stripe.secret)
var AccountSchema = new mongoose.Schema({
  model : { 
    type : String, 
    required : true, 
    default : 'account',
    enum : [ 'account', 'experteer', 'organization' ],
    set : function (val) {
      var Model = mongoose.model(val)
      if (Model) {
        return val
      } else {
        throw new Error(val + ' is not a valid account type')
      }
    }
  }
}, { discriminatorKey : 'model' })

/**
 * Add properties required for authentication 
 * 
 */

AccountSchema.add({
  hash : String,
  // salt : String,
  email : {
    type : String,
    match : /^[\w\.%\+\-]+@(?:[A-Z0-9\-]+\.)+(?:[A-Z]{2,6})$/i,
    unique : true
  },
})

/**
 * Personal properties
 * 
 */

AccountSchema.add({
  firstname : { type : String, default : '' },
  lastname : { type : String, default : '' },
  city : { type : String, default : '' },
  country : { type : String, default : '' },
  gender : { type : String, enum : [ 'male', 'female' ] },
  birthday : Date,
  agree : Boolean,
  conduct : Boolean,
  plan : { type : Number, default : 0 },
  activity : { type : Array, default : [] }
})

AccountSchema.virtual('age').get(function () {
  if (!this.birthday) {
    return null
  }
  var today = new Date() 
  var birthDate = this.birthday 
  var age = today.getFullYear() - birthDate.getFullYear() 
  var m = today.getMonth() - birthDate.getMonth() 
  if (m < 0 || (m == 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
})

AccountSchema.virtual('url').get(function () {
  return '/profile/' + this.id
})

AccountSchema.virtual('created').get(function (val) {
  return moment(val).format('MM/DD/YYYY')
})

/**
 * Invite properties
 * 
 */

AccountSchema.add({
  inviteDate : { 
    type : Date, 
    default : function () { return Date.now() } 
  },
  inviteCoupon : {
    type : String,
    default : function () { return crypto.randomBytes(10).toString('hex') }
  }
})

AccountSchema.add({
  industry : { type : String, default : '' },
  headline : { type : String, default : '' },
  description : { type : String, default : '' },
  avatar : { type : String },
  linksUrl : { type : String, default : '' },
  linksTwitter : { type : String, default : '' },
  linksLinkedin : { type : String, default : '' },
  linksFacebook : { type : String, default : '' }
})


/**
 * Properties not displayed but used for marketing
 * 
 */

AccountSchema.add({
  recommendedBy : String
})

/**
 * Properties for charging credit cards with Stripe
 * 
 */

AccountSchema.add({ 
  stripeId : String,
  stripeCharges : [ mongoose.Schema.Types.Mixed ],
})

AccountSchema.method('findActivities', function () {
  return mongoose.model('activity').find({ account : this._id })
})

AccountSchema.method('saveActivity', function (type, peer, callback) {
  var Activity = mongoose.model('activity')
  new Activity({ 
    account : this._id,
    peer : peer._id,
    type : type
  }).save(callback)
})

/**
 * Add the account as a customer at stripe and associate the card token
 * or if this account has already been added to stripe then do nothing
 * 
 */

AccountSchema.method('getStripeId', function (stripeToken, callback) {
  if (typeof stripeToken !== 'string') throw new Error('stripeToken required')
  var account = this
  if (account.stripeId) {
    return callback(account.stripeId)
  }
  stripe
    .customers
    .create({ card : stripeToken, email : account.email }, function (e, res) {
      if (e) {
        return callback(e)
      }
      account.stripeId = res.id
      return callback(null, res.id)
    })
  ;
})

AccountSchema.method('charge', function (options, callback) {
  if (!options.cents) throw new Error('options.cents is required')
  if (!options.stripeToken) throw new Error('options.stripeToken is required')
  var account = this
  account.plan = options.cents
  account.getStripeId(options.stripeToken, function (err, stripeId) {
    if (err) {
      return callback(err)
    }    
    var params = { 
      amount : options.cents, 
      currency : 'usd', 
      customer : stripeId
    }
    stripe
      .charges
      .create(params, function (error, response) {
        if (error) {
          return callback(error)
        }
        if (response.paid === true) {
          account.stripeCharges = account.stripeCharges || []
          account.stripeCharges.push(response)
          account.markModified('stripeCharges')
          return callback()
        }
        return callback(new Error('Sorry, please try again or contact us'))
      })
    ;
  })
})

// AccountSchema.virtual('status').get(function () { 
//   var incompleteStatus = { 
//     key : 'off', 
//     title : 'Incomplete account', 
//     description : ''
//   }
//   return incompleteStatus
// })

AccountSchema.method('setupBasicComplete', function () { 
  return (this.hash !== undefined
    && this.firstname !== undefined
    && this.lastname !== undefined
    && this.industry !== undefined
    && this.city !== undefined
    && this.country !== undefined)
})

/**
 * Throw an error when trying to save a property not in the schema
 *
 */

// AccountSchema.set({ strict : 'throw' })

/**
 * Set the collection explicitly
 *
 */

AccountSchema.set({ collection : 'accounts' })

/**
 * Use getters/virtuals when casting to a native Object or to JSON
 *
 */

AccountSchema.set('toJSON', { getters : true, virtuals : true })

AccountSchema.set('toObject', { getters : true, virtuals : true })

module.exports = AccountSchema
