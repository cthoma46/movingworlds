Organization = require('../models').Organization
moment = require('moment')

module.exports = [

    path: '/organization/:id/:opp?'
    type: 'GET'
    login: 'all'
    action: (req, res, next) ->
      opp = (if not req.params.opp then 0 else req.params.opp)
      console.log('/organization/:id/:opp?', req.params)
      Organization
        .findById(req.params.id)
        .populate('rep_id')
        .exec (err, doc) ->
          if err 
            return next() 
          res.render 'organization',
            title: doc.name + ' Profile'
            org: doc
            opp_id: req.params.opp
            moment: moment
]
