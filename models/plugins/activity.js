var mongoose = require('mongoose')

module.exports = function (schema, opts) {

  schema.method('findActivities', function () {
    return mongoose.model('activity').find({ account : this._id })
  })

  schema.method('saveActivity', function (type, peer, callback) {
    var Activity = mongoose.model('activity')
    new Activity({ 
      account : this._id,
      peer : peer._id,
      type : type
    }).save(callback)
  })

}
