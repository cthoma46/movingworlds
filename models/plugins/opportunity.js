var mongoose = require('mongoose')

module.exports = function (schema, opts) {

  /**
   * Return a list of all opportunities
   * 
   */
  schema.method('opportunityList', function (next) {
    return mongoose.model('opportunity').find({ organization : this._id })
  })

  /**
   * Add new or edit an existing opportunity
   * 
   */
  schema.method('opportunityUpsert', function (params, next) {
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
  schema.method('opportunityRemove', function (_id, next) {
    return mongoose.model('opportunity').findByIdAndRemove(_id, next)
  })

}
