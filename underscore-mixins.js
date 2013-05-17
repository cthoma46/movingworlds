var _ = require('underscore')
var moment = require('moment')
var crypto = require('crypto')

_.mixin({
  dateFormat : function (val) {
    return moment(val).format('MM/DD/YYYY')
  },

  /**
   * Converts delimited list to array.
   * 
   * @param {String} str
   * @param {String} delimiter
   * @return {Array}
   */
  stringToArray : function (val) {
    if (!Array.isArray(val)) {
      return val.split(',')
    }
    return val
  },

  randomString : function () { 
    return crypto.randomBytes(10).toString('hex') 
  },

  validateEmail : function (email) {
    var regex = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    return regex.test(email)
  },

  /**
   * Capitalizes the first letter of string
   *
   * @param {String} str
   * @return {String}
   */
  capitalize : function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  },

  /**
   * Creates a URL friendly String.
   * 
   * @param {String} str
   * @return {String}
   */
  slugify : function (str) {
    str = str.replace(/^\s+|\s+$/g, "") 
    str = str.toLowerCase()
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;"
    var to = "aaaaeeeeiiiioooouuuunc------"
    var i = 0
    var l = from.length
    while (i < l) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i))
      i++
    }
    str = str.replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-")
    return str
  },

})
