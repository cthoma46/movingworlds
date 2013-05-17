var mongoose = require('mongoose')
var stripe = require('stripe')(process.settings.apiKeys.stripe.secret)

module.exports = function (schema, opts) {

  /**
   * Properties for charging credit cards with Stripe
   * 
   */

  schema.add({ 
    stripeId : String,
    stripeCharges : [ mongoose.Schema.Types.Mixed ],
  })


  /**
   * Add the account as a customer at stripe and associate the card token
   * or if this account has already been added to stripe then do nothing
   * 
   */

  schema.method('getStripeId', function (stripeToken, callback) {
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

  schema.method('charge', function (options, callback) {
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

}

