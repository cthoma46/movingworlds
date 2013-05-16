var Account = require('../models').Account 
var Organization = require('../models').Organization
var moment = require('moment')
var ObjectId = require('mongoose').Types.ObjectId
var utile = require('utile')
var Lang = require('../lang')

module.exports = [
  {
    path : '/profile/:_id/:opportunityId?',
    type : 'GET',
    action : function (req, res) {
      
      Account.findById(req.params._id, function (error, account) { 
        if (error || !account) {
          console.error(error)
          req.flash('error', 'Oops')
          return res.redirect('back')
        }

        getIntroDate(req.user, req.params._id, function (err, introDate) {
          res.locals({ introDate : introDate })
          if (account.model === 'organization') {
            account
            .opportunityList()
            .populate('organization')
            .exec(function (err, docs) {
              var opp_id = 0
              account.opportunities = docs

              account.opportunities.forEach(function (opportunity, i) {
                if (opportunity.id === req.params.opportunityId) {
                  opp_id = i
                }

              })              

              render(account, opp_id)
            })
          } else {
            render(account)
          }
        })

      })

      function render (account, opp_id) {
        res.render('private/profile', {
          title : 'MovingWorlds Profile - ' + account.name,
          experteer : account,
          org : account,
          account : account,
          moment : moment,
          opp_id: opp_id || 0,
          countryList : Lang.en.Countries,
          regionList : Lang.en.Regions
        })
      }

    }
  }
]


function getIntroDate (account, peerId, callback) {
  if (!account) {
    return callback()
  }
  account
    .findActivities()
    .where('peer').equals(peerId)
    .where('type').equals('intro')
    .exec(function (err, docs) {
      if (err) {
        console.error(err, docs)
        return callback(err)
      }
      if (!docs.length) {
        return callback()
      }
      return callback(null, docs[0].created)
    })
  ;
}