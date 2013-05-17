// var _ = require('underscore')
var mongoose = require('mongoose')
var plugins = require('./plugins')
var Lang = require('../lang') 

var Admin = new mongoose.Schema({
}, { 
  strict : 'throw', 
  collection : 'accounts', 
  discriminatorKey : 'model',
  toJSON : { getters : true, virtuals : true },
  toObject : { getters : true, virtuals : true }
})

Admin
  .plugin(plugins.account)
  .plugin(plugins.discriminatorKey)

Admin.method('assume', function (account) {

})

module.exports = Admin
