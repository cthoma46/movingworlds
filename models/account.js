//var _ = require('underscore')
//var crypto = require('crypto')
var mongoose = require('mongoose')
var plugins = require('./plugins')
//var Lang = require('../../lang') 

var Account = new mongoose.Schema({ 
}, { 
  strict : 'throw', 
  collection : 'accounts',
  discriminatorKey : 'model',
  toJSON : { getters : true, virtuals : true },
  toObject : { getters : true, virtuals : true }
})

Account
  .plugin(plugins.account)
  .plugin(plugins.activity)
  .plugin(plugins.search, { excluded : [ '_id' ] })
  .plugin(plugins.discriminatorKey)

module.exports = Account
