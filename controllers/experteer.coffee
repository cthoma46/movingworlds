User = require("../models").User
moment = require("moment")
ObjectId = require("mongoose").Types.ObjectId

module.exports = [
	  path: "/experteer/:id"
	  type: "GET"
	  action:	(req, res) ->
	  	user = req.user
		  id = req.params.id
		  User.findById id, (err, doc) ->
		    throw err  if err
		    res.render "experteer",
		      title: doc.first_name + " " + doc.last_name + " Profile"
		      experteer: doc
		      moment: moment
		      mine: user.id == id
	,
		path: "/experteer/update"
		type: "POST"
		action: (req, res) ->
			user = req.user
			User.update
        id: ObjectId(user.id)
      , req.body,
        multi: false
        upsert: true
      , (err, numAffected) ->
        unless err
          res.redirect "/experteer/" + user.id
        else
          req.flash "error", err
          res.redirect "/experteer/" + user.id
]