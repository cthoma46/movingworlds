require('rconsole')
var mongoose = require('mongoose')
require('mongoose-schema-extend')
var troop = require('mongoose-troop')

mongoose.plugin(troop.timestamp)
mongoose.plugin(troop.merge)
mongoose.plugin(troop.pagination)
mongoose.plugin(function (schema) {
  var opts = {}
  var paths = Object.keys(schema.paths)
  
  paths = paths.filter(function (path) {
    return String(schema.paths[path].instance) === 'String'
  })

  opts.source = paths
  opts.naturalize = true

  schema.statics.search = function (q) {
    console.log('search', q, this.extractKeywords(q)) 
    return this.find({ keywords : { $in : this.extractKeywords(q) } })
  }

  schema.plugin(troop.keywords, opts)
})

var AccountSchema = require('./account/account')
var ExperteerSchema = require('./account/experteer')
var OrganizationSchema = require('./account/organization')
var ActivitySchema = require('./activity')
var OpportunitySchema = require('./opportunity')
var PageSchema = require('./page')

exports.Account = mongoose.model('account', AccountSchema)
exports.Experteer = mongoose.model('experteer', ExperteerSchema)
exports.Organization = mongoose.model('organization', OrganizationSchema)
exports.ActivitySchema = mongoose.model('activity', ActivitySchema)
exports.Opportunity = mongoose.model('opportunity', OpportunitySchema)
exports.Page = mongoose.model('page', PageSchema)
