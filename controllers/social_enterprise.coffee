SE = require("../models").SocialEnterprise
moment = require("moment")
ObjectId = require("mongoose").Types.ObjectId

module.exports = [

    path: "/social_enterprise/:id/:opp?"
    type: "GET"
    login: 'all'
    action: (req, res, next) ->
      opp = (if not req.params.opp then 0 else req.params.opp)
      SE.findById(req.params.id).populate('rep_id').exec (err, doc) ->
        next()  if err
        res.render "social_enterprise",
          title: doc.name + " Profile"
          se: doc
          opp_id: req.params.opp
          moment: moment
]