var settings = require('./settings')
var email = require('emailjs')
var fs = require('fs')

settings.mail.to = 'tomblobaum@gmail.com'
settings.mail.cc = 'tomblobaum@gmail.com'
settings.mail.bcc = 'tomblobaum@gmail.com'

module.exports = function (name, params, callback) {
  var message = new Mail(params)
  message.template(name, function (error, html) {
    if (error) {
      return callback(error)
    }
    message.body = html
    message.send(callback)
  })
}

function Mail (params) {
  params = params || {}
  this.to = params.to || settings.mail.bcc
  this.subject = params.subject || ''
  this.body = params.body || ''
  this.params = params
  this.server = email.server.connect(settings.mail.sftp)
}

Mail.prototype.template = function (name, callback) {
  var params = this.params
  var filename = './views/emails/' + name + '.html'
  fs.readFile(filename, 'utf8', function (error, data) {
    if (error) {
      return callback(error)
    }
    for (var val in params) {
      data = data.replace(new RegExp('##' + val + '##', 'gim'), params[val])
    }
    callback(error, data)
  })
}

Mail.prototype.send = function (callback) {
  var params = this.params
  this.server.send({
    from : settings.mail.from,
    cc : settings.mail.cc,
    to : this.to,
    subject : this.subject,
    text : 'A message from MovingWorlds',
    attachment : [
      { data : this.body, alternative : true }
    ]
  }, callback)  
}

//
// example
//
// mail('invitation-request', { 
//   to : emailTo
//   subject : 'You requested an invitation to MovingWorlds' 
// })
