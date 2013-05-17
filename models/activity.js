var _ = require('underscore')
var mongoose = require('mongoose')
var $oid = mongoose.Schema.Types.ObjectId

var ActivitySchema = new mongoose.Schema({
  account :   { type : $oid, required : true, ref : 'account' },
  peer :      { type : $oid, required : true, ref : 'account' },
  type :      { type : String, required : true },
  created :   { type : Date, get : _.dateFormat }
}, {
  strict : 'throw', 
  collection : 'activities',
  discriminatorKey : 'model',
  toJSON : { getters : true, virtuals : true },
  toObject : { getters : true, virtuals : true }
})

module.exports = ActivitySchema
