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
]