
#!
# * MovingWorlds - utils
# * Copyright(c) 2012 Jonah Werre <jonah@movingworlds.org>
# * GNU
#

###
Capitalizes the first letter of string

@param {String} str
@return {String}
###
exports.capitalize = (str) ->
  return str.charAt(0).toUpperCase() + str.slice(1);


###
Converts delimited list to array.

@param {String} str
@param {String} delimiter
@return {Array}
###
exports.stringToArray = (str, delimiter) ->
  # console.log "stringToArray: ", str
  str = String(str)
  delimiter = ","  unless delimiter
  array = str.split(delimiter)
  # console.log "stringToArray: newArray:", array
  (if (array.length > 1) then array else array[0])


###
subtract pram from the current year

@param {Number} num
@return {Number}
###
exports.yearsAgo = (num) ->
  date = new Date()
  date.getFullYear() - num


###
Validated an email address

@param {Sting} email
@return {Boolean}
###
exports.validateEmail = (email) ->
  re = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
  re.test email


###
Escape single quotes in `str`.

@param {String} str
@return {String}
###
exports.escape = (str) ->
  str.replace /'/g, "\\'"


###
Creates a URL friendly String.

@param {String} str
@return {String}
###
exports.slugify = (str) ->
  str = str.replace(/^\s+|\s+$/g, "") # trim
  str = str.toLowerCase()
  
  # remove accents, swap ñ for n, etc
  from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;"
  to = "aaaaeeeeiiiioooouuuunc------"
  i = 0
  l = from.length

  while i < l
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i))
    i++
  # remove invalid chars
  # collapse whitespace and replace by -
  str = str.replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-") # collapse dashes
  str


###
Creates a  globally-unique identifier GUID

@return {String}
###
exports.generatorGUID = ->
  S4 = ->
    (((1 + Math.random()) * 0x10000) | 0).toString(16).substring 1

  S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()
