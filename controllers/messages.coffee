# Step = require('step')
# Organization = require('../models').Organization
# User = require('../models').User
# Message = require('../models').Message

module.exports = [

    # path: '/message'
    # type: 'POST'
    # action: (req, res) ->
    #   to = (req.body.to).split(',')
    #   i = 0

    #   while i < to.length
    #     User.findById to[i], (err, usr) ->
          
    #       #TODO: send notification to user
    #       message = new Message()
    #       message.to = new Object()
    #       message.to.userId = usr._id
    #       message.to.fullName = usr.first_name + ' ' + usr.last_name
    #       message.to.avatar = usr.avatar
    #       message.to.type = usr.type
    #       message.to.verified = usr.verified
    #       message.to.email = usr.email
    #       message.from = new Object()
    #       message.from.userId = req.user._id
    #       message.from.fullName = req.user.first_name + ' ' + req.user.last_name
    #       message.from.avatar = req.user.avatar
    #       message.from.type = req.user.type
    #       message.from.verified = req.user.verified
    #       message.from.email = req.user.email
    #       message.subject = req.body.subject
    #       message.body = req.body.body
          
    #       message.save (err) ->
    #         if err
    #           req.flash 'error', err
    #         else
    #           req.flash 'success', 'Your message has been sent'
    #         res.redirect '/landing'  if i is to.length
    #     i++

]