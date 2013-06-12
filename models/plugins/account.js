var _ = require('underscore')
var mongoose = require('mongoose')

module.exports = function (schema, opts) {

  schema.add({
    firstname :       { type : String, default : '' },
    lastname :        { type : String, default : '' },
    city :            { type : String, default : '' },
    country :         { type : String, default : '' },
    gender :          { type : String, enum : [ 'male', 'female' ] },
    birthday :        { type : Date, get : _.dateFormat },
    agree :           { type : Boolean },
    conduct :         { type : Boolean },
    plan :            { type : String, default : 0 },
    activity :        { type : Array, default : [] },
    industry :        { type : String, default : '' },
    headline :        { type : String, default : '' },
    description :     { type : String, default : '' },
    avatar :          { type : String },
    linksUrl :        { type : String, default : '' },
    linksTwitter :    { type : String, default : '' },
    linksLinkedin :   { type : String, default : '' },
    linksFacebook :   { type : String, default : '' },
    inviteDate :      { type : Date, default : Date.now },
    inviteCoupon :    { type : String, default : _.randomString },
    recommendedBy :   { type : String },
    published :       { type : Boolean, default : false },
    featured :        { type : Boolean, default : false },
  })

  schema
    .path('loggedIn')

  schema
    .virtual('age')
    .get(function (val) {
      if (!this.birthday) {
        return null
      }
      var today = new Date() 
      var birthDate = new Date(this.birthday)
      var age = today.getFullYear() - birthDate.getFullYear() 
      var m = today.getMonth() - birthDate.getMonth() 
      if (m < 0 || (m == 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      return age
    })

  schema
    .virtual('url')
    .get(function () {
      return '/profile/' + this.id
    })

  schema
    .virtual('created')
    .get(_.dateFormat)

  schema.add({
    model : { 
      type : String, 
      required : true, 
      default : 'account',
      enum : [ 'account', 'experteer', 'organization' ],
      set : function (val) {
        var Model = mongoose.model(val)
        if (Model) {
          return val
        } else {
          throw new Error(val + ' is not a valid account type')
        }
      }
    },
    hash : String,
    email : {
      type : String,
      match : /^[\w\.%\+\-]+@(?:[A-Z0-9\-]+\.)+(?:[A-Z]{2,6})$/i,
      unique : true
    }
  })

}
