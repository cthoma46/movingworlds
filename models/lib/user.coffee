mongoose = require("mongoose")
Schema = mongoose.Schema
ObjectId = Schema.ObjectId
utils = require("./utils")
util = require("util")
collection_name = "mw_users"

educationSchema = new Schema(
  school: String
  major: [String]
  degree: String
  start: Date
  end: Date
)
employmentSchema = new Schema(
  title: String
  start: Date
  end: Date
  is_current: Boolean
  employer: String
  city: String
  country: String
)
userSchema = new Schema(
  type:
    type: String
    enum: ["invitee", "experteer", "representative", "admin"]
    default: "invitee"

  created:
    type: Date
    default: Date.now()

  modified: Date
  recommended_by: String
  first_name: String
  last_name: String
  email:
    type: String
    validate: /^[\w\.%\+\-]+@(?:[A-Z0-9\-]+\.)+(?:[A-Z]{2,6})$/i
    unique: true

  invite:
    coupon:
      type: String
      default: utils.generatorGUID

    invited_by: ObjectId
    invite_date:
      type: Date
      default: Date.now()

  birthday: Date
  hash: String
  salt: String
  city: String
  country: String
  gender:
    type: String
    enum: ["male", "female"]

  agree: Boolean
  notify: Boolean
  skills: [String]
  interests: [String]
  lived: [String]
  visited: [String]
  languages: [String]
  support_type:
    type: String
    enum: ["management", "technical"]

  avatar: String
  connections:
    linkedin:
      id: String
      username: String
      link: String

    facebook:
      id: String
      username: String
      link: String

  verified: {}
  friends: [ObjectId]
  links: {}
  bio: String
  status:
    type: Number
    default: 0

  professions: [String]
  industry: String
  career_started: Number
  employment: [employmentSchema]
  education: [educationSchema]
  profile:
    availability:
      start: Date
      end: Date

    value: Number
    video: String
    field:
      type: String
      enum: ["management", "development", "technical", "education"]

    countries: [String]
    industry: [String]
    goals: [String]
    motivation: String
)
userSchema.methods.fullName = fullName = ->
  @first_name + " " + @last_name

userSchema.methods.interpretStatus = interpretStatus = ->
  status =
    label: "Status Unavailable"
    class: "off"

  
  # console.log(this.status);
  switch Number(@status)
    when 0
      status.label = "Not Currently Seeking Experteering Opportunity"
      status.class = "off"
    when 1
      status.label = "Seeking Experteering Opportunity"
      status.class = "on"
    when 2
      status.label = "Currently Experteering"
      status.class = "off"
  status

userSchema.methods.age = age = ->
  return null  unless @birthday
  today = new Date()
  birthDate = @birthday
  age = today.getFullYear() - birthDate.getFullYear()
  m = today.getMonth() - birthDate.getMonth()
  age--  if m < 0 or (m is 0 and today.getDate() < birthDate.getDate())
  age


userSchema.statics.authenticate = authenticate = (email, password, callback) ->
  @findOne
    email: email
  , (err, user) ->
    if not user or err
      callback null, "could not find user with email: " + email
      return
    if user.password is password
      callback user, "Welcome back " + user.fullName()
      return
    else
      callback null, "Your password is incorrect"
      return
    callback null, "There was a problem logging in"


userSchema.statics.upsertFacebookUser = upsertFacebookUser = (fbUserData, callback) ->
  console.log "User::findOrCreateFacebookUser()"
  User.findOne
    "connections.id": fbUserData.id
  , (err, user) ->
    if err
      callback err
    else if user
      console.log "found existing user"
      callback user
    else
      console.log "creating new user"
      user = new User()
      user.type = "invitee"
      user.first_name = fbUserData.first_name or ""
      user.last_name = fbUserData.last_name or ""
      user.email = fbUserData.email or null
      user.gender = fbUserData.gender or ""
      user.birthday = new Date(fbUserData.birthday) or ""
      user.city = (if (fbUserData.localation) then fbUserData.localation.name else "")
      user.country = (if (fbUserData.locale) then fbUserData.locale.split("_")[1] else "")
      user.interests = fbUserData.interested_in or new Array()
      user.languages = (if (typeof user.languages is "undefined") then new Array() else user.languages)
      for lang of fbUserData.languages
        user.languages.push lang.name
      user.connections.facebook.id = fbUserData.id
      user.connections.facebook.link = fbUserData.link
      user.connections.facebook.username = fbUserData.username
      user.avatar = (if (fbUserData.cover) then fbUserData.cover[0].source else "")
      user.links = (if (typeof user.links is "undefined") then new Object() else user.links)
      user.links["facebook"] = fbUserData.link
      user.links["url"] = fbUserData.website
      user.bio = fbUserData.bio
      
      # user.professions  = fbUserData.headline;
      # user.industry  = fbUserData.industry;
      user.employment = (if (typeof user.employment is "undefined") then new Array() else user.employment)
      for i of fbUserData.work
        user.employment.push
          title: fbUserData.work[i].position
          start: new Date(fbUserData.work[i].start_date)
          end: new Date(fbUserData.work[i].endDate)
          
          # ,	is_current : fbUserData.work[i]
          employer: fbUserData.work[i].employer
          city: fbUserData.work[i].location

      user.education = (if (typeof user.education is "undefined") then new Array() else user.education)
      for i of fbUserData.education
        user.education.push
          school: fbUserData.education[i].school.name
          major: fbUserData.education[i].concentration
          degree: fbUserData.education[i].degree
          
          # ,	start : start
          end: fbUserData.education[i].year

      user.save (err) ->
        callback user  unless err
        callback err



userSchema.statics.upsertLikedInUser = upsertLikedInUser = (linkedInUserData, email, callback) ->
  
  # console.log( util.inspect(linkedInUserData, true, 10) );
  User.findOne
    $or: [
      "connections.linkedin.id": linkedInUserData.id
    ,
      email: email
    ]
  , (err, user) ->
    if err or not user
      
      # console.log('Could not find user', err, user);
      callback new Error("Moving Worlds is an invite only community")
    else if user
      console.log "found existing user. Linkedin ID: ", user.connections.linkedin.id, " Email: " + email
      if user.connections.linkedin.id
        console.log "user already synced linkedIn account"
        callback null, user
      else
        console.log "Syncing linkedin data with existing user"
        
        # var user = new User()
        user.connections.linkedin.id = linkedInUserData.id
        user.connections.linkedin.link = linkedInUserData.publicProfileUrl
        user.first_name = user.first_name or linkedInUserData.firstName
        user.last_name = user.last_name or linkedInUserData.lastName
        if typeof linkedInUserData.location isnt "undefined"
          user.city = user.city or linkedInUserData.location.name
          user.country = user.country or linkedInUserData.location.country.code
        user.avatar = user.avatar or linkedInUserData.pictureUrl
        user.birthday = user.birthday or new Date(linkedInUserData.dateOfBirth.year, linkedInUserData.dateOfBirth.month, linkedInUserData.dateOfBirth.day)  if linkedInUserData.dateOfBirth
        user.skills = user.skills or new Array()
        for skill of linkedInUserData.skills
          user.skills.push skill.skill
        user.interests = user.interests or new Array()
        for interest of linkedInUserData.interests.split(",")
          user.interests.push interest
        user.languages = user.languages or new Array()
        for lang of linkedInUserData.languages
          user.languages.push lang
        user.links = user.links or new Object()
        user.links["twitter"] = linkedInUserData.primaryTwitterAccount
        user.links["linkedin"] = linkedinkedInUserData.publicProfileUrl
        user.bio = user.bio or linkedInUserData.summary
        
        # user.professions  = user.professions || linkedInUserData.headline;
        user.industry = user.industry or linkedInUserData.industry
        user.employment = user.employment or new Array()
        for i of linkedInUserData.positions.values
          start = (if (typeof linkedInUserData.positions.values[i].startDate isnt "undefined") then new Date(linkedInUserData.positions.values[i].startDate.year, linkedInUserData.positions.values[i].startDate.month, 1) else null)
          end = (if (typeof linkedInUserData.positions.values[i].endDate isnt "undefined") then new Date(linkedInUserData.positions.values[i].endDate.year, linkedInUserData.positions.values[i].endDate.month, 1) else null)
          user.employment.push
            title: linkedInUserData.positions.values[i].title
            start: start
            end: end
            is_current: linkedInUserData.positions.values[i].isCurrent
            employer: linkedInUserData.positions.values[i].company.name

        user.education = user.education or new Array()
        for i of linkedInUserData.educations.values
          start = (if (typeof linkedInUserData.educations.values[i].startDate.year isnt "undefined" and typeof linkedInUserData.educations.values[i].startDate.month isnt "undefined") then new Date(linkedInUserData.educations.values[i].startDate.year, linkedInUserData.educations.values[i].startDate.month, 1) else null)
          end = (if (typeof linkedInUserData.educations.values[i].endDate.year isnt "undefined" and typeof linkedInUserData.educations.values[i].endDate.month isnt "undefined") then new Date(linkedInUserData.educations.values[i].endDate.year, linkedInUserData.educations.values[i].endDate.month, 1) else null)
          user.education.push
            school: linkedInUserData.educations.values[i].schoolName
            major: linkedInUserData.educations.values[i].fieldOfStudy
            degree: linkedInUserData.educations.values[i].degree
            start: start
            end: end

        user.save (err) ->
          return callback(null, user)  unless err
          callback err

    else
      callback new Error("Moving Worlds is an invite only community")


userSchema.statics.findOrCreateGoogleUser = findOrCreateGoogleUser = (fbUserData, callback) ->
  callback()

userSchema.statics.search = search = (name, callback) ->
  @where("name", new RegExp(name, "i")).run callback

User = mongoose.model(collection_name, userSchema)
module.exports = User
