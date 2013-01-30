User = require("../models").User
moment = require("moment")
ObjectId = require("mongoose").Types.ObjectId

module.exports = [
		path: "/experteer/:id"
		type: "GET"
		action:	(req, res) ->
			user = req.user
			if user?
				id = req.params.id
				User.findById id, (err, doc) ->
					throw err if err

					res.render "experteer",
					title: doc.first_name + " " + doc.last_name + " Profile"
					user: user
					experteer: doc
					moment: moment
					mine: user.id == id
			else
				res.redirect "/login"
	,
		path: "/experteer/update"
		type: "POST"
		action: (req, res) ->
			console.log(req.body)
			user = req.user
			User.update
        _id: ObjectId(user.id)
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