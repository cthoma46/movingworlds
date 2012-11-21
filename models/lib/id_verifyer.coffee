###
#
# EXPERIMENTAL
#
###

IdVerifyer = (id) ->
  self = this
  photoId = id
util = require("util")
exec = require("child_process").exec
emitter = require("events")
photoId = undefined
IdVerifyer::__defineGetter__ "photoId", ->
  photoId

IdVerifyer::__defineSetter__ "photoId", (val) ->
  photoId = val

IdVerifyer::verify = (name) ->
  command = @getCommand()
  result = undefined
  exec command, (error, stdout, stderr) ->
    
    # var result = stdout.replace(/(\r\n|\n|\r|\s+(?= ))/gm,"");
    # console.log(stdout);
    img = new Image()
    img.onload = ->
      console.log "image loaded"

    img.src = photoId
    valid = stdout.search(new RegExp(name, "i")) > 0
    emitter.emit event, valid
    console.log error  if error isnt null


IdVerifyer::getCommand = ->
  ext = photoId.split(".").pop()
  command = undefined
  switch ext
    when "jpg"
      command = "djpeg -greyscale -pnm " + photoId + " | ocrad --filter=letters_only"
    when "jpeg"
      command = "djpeg -greyscale -pnm " + photoId + " | ocrad  --filter=letters_only"
    when "png"
      command = "pngtopnm " + photoId + " | ocrad  --filter=letters_only"
    when "pdf"
      command = "gs -sPAPERSIZE=a4 -sDEVICE=pnmraw -r300 -dNOPAUSE -dBATCH -sOutputFile=- -q " + photoId + " | ocrad  --filter=letters_only"
    else
      command = "ocrad  --filter=letters_only " + photoId
  command

module.exports = IdVerifyer

# ID = require('./id_verifyer');
# var id = new ID('~/Desktop/id.jpg');
# id.verify();
