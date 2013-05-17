var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Model = mongoose.Model
var oldInit = Model.prototype.init

Model.prototype.init = function (doc, query, fn) {
  var self = this
  var key = this.schema.options['discriminatorKey']
  if (key) {
    var type = doc[key]
    var newFn = function () { 
      process.nextTick(function () { 
        fn.apply(this, arguments) 
      }) 
    }
    var obj = oldInit.call(this, doc, query, newFn);
    // set the documents prototype to that model
    var model = mongoose.models[type]
    if (model) {
      obj.__proto__ = model.prototype
    }
    obj._registerHooks()
    return obj
  } else {
    // no discriminatorKey, just call the original init
    return oldInit.apply(this, arguments);
  }
}

module.exports = function (schema, opts) {
  var key = schema.options.discriminatorKey
  if (key) {
    var discriminatorField = {}
    discriminatorField[key] = { type : String }
    schema.add(discriminatorField)
    schema.pre('save', function (next) {
      if (typeof this[key] === 'undefined' || !this[key].length) {
        this[key] = this.constructor.modelName;
      }
      console.log('save', this[key])
      next()
    })
  }
}
