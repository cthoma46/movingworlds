settings = require('./movingworlds').SETTINGS.mail
email = require('emailjs')
fs = require('fs')

Mail = (to, subject, body) ->
  @to = to or ''
  @subject = subject or ''
  @body = body or ''
  @server = email.server.connect(settings.sftp)
  return

Mail::send = ->
  @server.send
    from: settings.from
    cc: settings.cc
    to: @to
    subject: @subject
    text: @body
  , (err, message) ->

# console.log(err || message);
Mail::sendHTML = (html, replace) ->
  _this = this
  fs.readFile html, 'utf8', (err, fd) ->

    console.warn 'ERROR locating email: ' + html, err  if err

    for value of replace
      fd = fd.replace(new RegExp('##' + value + '##', 'gim'), replace[value])


    message =
      from: settings.from
      cc: settings.cc
      to: _this.to
      subject: _this.subject
      text: 'A message from MovingWorlds'
      attachment: [
        data: fd
        alternative: true
      ]
    _this.server.send message, (err, message) ->
      # console.log err or message;

module.exports = Mail
