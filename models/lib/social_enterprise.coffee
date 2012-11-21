mongoose = require("mongoose")
Schema = mongoose.Schema
ObjectId = Schema.ObjectId
collection_name = "mw_se"
opportunitySchema = new Schema(
  title: String
  city: String
  country: String
  details: String
  start: Date
  end: Date
  deadline: Date
  professions: [String]
  min_experience: Number
  field:
    type: String
    enum: ["management", "development", "technical", "education"]

  skills: [String]
  languages: [String]
  impact: String
  room_board: Boolean
  compensation: Boolean
  benefits: String
  learn: String
  placement_partner: Boolean
  post_engagement: Boolean
  created: Date
  modified:
    type: Date
    default: Date.now()
)
socialEnterpriseSchema = new Schema(
  name: String
  rep_id: ObjectId
  city: String
  country: String
  type:
    type: String
    enum: ["profit", "non-profit", "hybrid", "other"]

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

  links: {}
  industry: String
  partner_relations: String
  partner_org_relation: String
  introduction: String
  impact: String
  conduct: String
  video: String
  opportunities: [opportunitySchema]
)
socialEnterpriseSchema.methods.interpretSize = interpretSize = ->
  size = ""
  switch Number(@size)
    when 1
      size =
        title: "Small"
        desc: "1-10 employees"
    when 2
      size =
        title: "Medium"
        desc: "10-100 employees"
    when 3
      size =
        title: "Large Company"
        desc: "100+ employees"
    else
      size =
        title: "Startup"
        desc: "no employees"
  size

socialEnterpriseSchema.methods.interpretStatus = interpretStatus = ->
  totalOpps = @opportunities.length
  status = ""
  if totalOpps >= 1
    title = (if (totalOpps > 1) then "Experteering Opportunities Available" else "Experteering Opportunity Available")
    status =
      label: title
      class: "on"
      total: totalOpps
  else
    status =
      label: "No Opportunities Available Right Now"
      class: "off"
      total: 0
  status

socialEnterpriseSchema.method.recommendations = recommendations = () ->
  console.log userId
  recomendations: 2


# socialEnterpriseSchema.statics.createOpportunity = function createOpportunity(oppData) {
# 	console.log('User::findOrCreateFacebookUser()');	
# 	
# 	SocialEnterprise.update({'opportunities._id':oppData._id}, {upsert: true, multi:false}, function(err, numAffected){
# 		
# 	});
# });
SocialEnterprise = mongoose.model(collection_name, socialEnterpriseSchema)
module.exports = SocialEnterprise
