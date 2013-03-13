mongoose = require('mongoose')
User = require('./movingworlds').User
Schema = mongoose.Schema
ObjectId = Schema.ObjectId

opportunitySchema = new Schema(
  name: String
  city: String
  country: String
  details: String
  start: Date
  end: Date
  deadline: Date
  min_experience: Number
  area_support: [String]
  skills: [String]
  languages: [String]
  desired_result: String
  impact: String
  accomodation: String
  accomodation_desc: String
  compensation: String
  benefits: String
  learn: String
  created: Date
  modified:
    type: Date
    default: Date.now()
)

organizationSchema = new Schema(
  name: String
  rep_id:
    type: ObjectId
    ref: 'user'
  representative_type: String
  city: String
  country: String
  type:
    type: String
    enum: ['profit', 'profit-org', 'non-profit', 'cooperative', 'educational', 'research_institute', 'government_agency', 'other']
  size: Number
  avatar: String
  created: Date
  modified:
    type: Date
    default: Date.now()

  registered:
    is_registered:
      type: Boolean
      default: false
    location: String
    year: String

  url: String
  industry: String
  description: String
  conduct: Boolean
  video: String
  opportunities: [opportunitySchema]
)

organizationSchema.methods.interpretSize = interpretSize = ->
  size = ''
  switch Number(@size)
    when 1
      size =
        title: 'Startup'
        desc: '2 - 5 persons'
    when 2
      size =
        title: 'Small organization'
        desc: '5 - 10 persons'
    when 3
      size =
        title: 'Medium sized organization'
        desc: '10 - 100 persons'
    when 4
      size =
        title: 'Large organization'
        desc: '100+ persons'
    else
      size =
        title: 'Startup'
        desc: 'founder(s) only'
  size

organizationSchema.methods.interpretType = interpretType = ->
  types =
    'profit': 'For profit company'
    'profit-org': 'For profit Organization'
    'non-profit': 'Non-profit Organization / NGO'
    'cooperative': 'Cooperative'
    'educational': 'Educational Institute'
    'research_institute': 'Research Institute'
    'government_agency': 'Government Agency'
    'other': 'Other'

  types[@type]

organizationSchema.methods.interpretRepType = interpretRepType = ->
  types =
    'founder': '(co) Founder'
    'director': 'Director'
    'manager': 'Manager'
    'employee': 'Employee'
    'legal_rep': 'Legal representative'
    'other': 'Other'
  types[@representative_type]

organizationSchema.methods.interpretStatus = interpretStatus = ->
  totalOpps = @opportunities.length
  status = ''
  if totalOpps >= 1
    title = (if (totalOpps > 1) then 'Experteering Opportunities Available' else 'Experteering Opportunity Available')
    status =
      label: title
      class: 'on'
      total: totalOpps
  else
    status =
      label: 'No Opportunities Available Right Now'
      class: 'off'
      total: 0
  status

Organization = mongoose.model('organization', organizationSchema)
module.exports = Organization
