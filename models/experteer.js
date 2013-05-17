var _ = require('underscore')
var mongoose = require('mongoose')
var plugins = require('./plugins')
var Lang = require('../lang') 
var $mixed = mongoose.Schema.Types.Mixed
var statusKeys = Object.keys(Lang.en.Experteer.Statuses)

var Experteer = new mongoose.Schema({
  linkedinId :              { type : String },
  experienceYears :         { type : Number },
  experteerStart :          { type : Date, get : _.dateFormat },
  experteerEnd :            { type : Date, get : _.dateFormat },
  experteerCompensation :   { type : String }, 
  experteerMotivation :     { type : String },
  supportArea :             { type : [ String ], default : [] },
  interests :               { type : [ String ], default : [] },
  languages :               { type : [ String ], default : [] },
  skills :                  { type : [ String ], default : [] },
  visited :                 { type : [ String ], default : [] },
  employment :              { type : [ $mixed ], default : [] },
  education :               { type : [ $mixed ], default : [] },
  experteerCountries :      { type : [ String ], default : [] },
  experteerEnvironment :    { type : [ String ], default : [] },
  experteerImpact :         { type : [ String ], default : [] },
  experteerStatus : { type : String, enum : statusKeys, default : 'on' }
}, { 
  strict : 'throw', 
  collection : 'accounts', 
  discriminatorKey : 'model',
  toJSON : { getters : true, virtuals : true },
  toObject : { getters : true, virtuals : true }
})

Experteer.path('supportArea').set(_.stringToArray)
Experteer.path('interests').set(_.stringToArray)
Experteer.path('languages').set(_.stringToArray)
Experteer.path('skills').set(_.stringToArray)
Experteer.path('visited').set(_.stringToArray)

Experteer.virtual('name').get(function () {
  return this.firstname + ' ' + this.lastname
})

Experteer.virtual('status').get(function () { 
  return Lang.en.Experteer.Statuses[this.experteerStatus]
})

Experteer
  .plugin(plugins.account)
  .plugin(plugins.activity)
  .plugin(plugins.search, { excluded : [ '_id' ] })
  .plugin(plugins.linkedin)
  .plugin(plugins.stripe)
  .plugin(plugins.incompleteFields)
  .plugin(plugins.discriminatorKey)

module.exports = Experteer
