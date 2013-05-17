var _ = require('underscore')
var mongoose = require('mongoose')
var plugins = require('./plugins')
var $oid = mongoose.Schema.Types.ObjectId

var OpportunitySchema = new mongoose.Schema({
  start :           { type : Date,   default : Date.now, get : _.dateFormat },
  end :             { type : Date,   default : Date.now, get : _.dateFormat },
  deadline :        { type : Date,   default : Date.now, get : _.dateFormat },
  model :           { type : String, default : 'opportunity' },
  name :            { type : String, default : '' },
  city :            { type : String, default : '' },
  country :         { type : String, default : '' },
  description :     { type : String, default : '' },
  experienceYears : { type : Number, default : 0 },
  supportArea :     { type : [ String ], default : [] },
  skills :          { type : [ String ], default : [] },
  languages :       { type : [ String ], default : [] },
  desiredResult :   { type : String, default : '' },
  impact :          { type : String, default : '' },
  accomodation :    { type : String, default : '' },
  accomodationDescription : { type : String, default : '' },
  compensation :    { type : String, default : '' },
  benefits :        { type : String, default : '' },
  learn :           { type : String, default : '' },
  organization :    { type : $oid, ref : 'organization', required : true }
}, { 
  strict : 'throw', 
  collection : 'opportunities',
  discriminatorKey : 'model',
  toJSON : { getters : true, virtuals : true },
  toObject : { getters : true, virtuals : true } 
})

OpportunitySchema
  .plugin(plugins.search, { excluded : [ '_id' ] })
  .plugin(plugins.incompleteFields)
  .plugin(plugins.discriminatorKey)

OpportunitySchema.virtual('url').get(function () {
  var org = typeof this.organization.id === 'undefined' 
    ? this.organization 
    : this.organization.id 
  return '/profile/' + org + '/' + this.id
})

module.exports = OpportunitySchema
