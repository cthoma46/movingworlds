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
  schema.method('getStripeId', function (stripeToken, next) {
    if (typeof stripeToken !== 'string') {
      return next(new Error('stripeToken required'))
    } 
    var account = this
    var opts = { card : stripeToken, email : account.email }
    if (account.stripeId) {
      return next(null, account.stripeId)
    }
    stripe
      .customers
      .create(opts, function (err, res) {
        if (err) {
          return next(err)
        }
        account.stripeId = res.id
        return next(null, account.stripeId)
      })
    ;
  })

  schema.method('charge', function (options, next) {
    if (!options.cents) {
      return next(new Error('options.cents is required'))
    }
    if (!options.stripeToken) {
      return next(new Error('options.stripeToken is required'))
    }    
    var account = this
    account.plan = options.cents
    account.getStripeId(options.stripeToken, function (err, stripeId) {
      if (err) {
        return next(err)
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
            return next(error)
          }
          if (response.paid === true) {
            account.stripeCharges = account.stripeCharges || []
            account.stripeCharges.push(response)
            account.markModified('stripeCharges')
            return next()
          }
          return next(new Error('Sorry, please try again or contact us'))
        })
      ;
    })
  })

}

