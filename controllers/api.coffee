utils = require("../models").utils

getSearchFields = (fields, searchReg) ->
	searchFields = new Array()
	fields = fields.split(splitRegExp)
	i = 0

	while i < fields.length
		fieldsObj = new Object()
		fieldsObj[fields[i]] = searchReg
		searchFields.push fieldsObj
		i++
	searchFields


splitRegExp = new RegExp(/,|:|\|/)
excludedFields = ["password", "signup_date", "agree", "notify", "email"]

module.exports = [

		path: "/api"
		type: "GET"
		action:	(req, res, next) ->
			res.render "api",
				title: "Moving Worlds API"
				body: "This is the documentation for MovingWorlds API"
				headtype: "nonav"
	,

		path: "/api/user/:id?"
		type: "GET"
		action: (req, res, next) ->
			User = require("../models").User
			query = new Object()
			id = req.params.id
			search = req.query["search"]
			if id
				query["_id"] = id
			else if search
				searchReg = (if (search) then new RegExp(req.query["search"].split(splitRegExp).join("|"), ["i"]) else "")
				searchFields = [
					first_name: searchReg
				,
					last_name: searchReg
				,
					city: searchReg
				,
					country: searchReg
				,
					professions: searchReg
				,
					industry: searchReg
				]
				if req.query["fields"]
					searchFields = []
					searchFields = getSearchFields(req.query["fields"], searchReg)
				query = $or: searchFields
			else
				query = {}
			User.find(query, (err, doc) ->
				result = (if err then err else doc)
				res.json result
			).sort
				status: 1
				"employment.title": 1
				country: 1
	,

		path: "/api/experteer/:id?"
		type: "GET"
		action:(req, res, next) ->
			User = require("../models").User
			query = new Object()
			id = req.params.id
			search = req.query["search"]
			if id
				query["_id"] = id
			else if search
				searchReg = (if (search) then new RegExp(req.query["search"].split(splitRegExp).join("|"), ["i"]) else "")
				searchFields = [
					first_name: searchReg
				,
					last_name: searchReg
				,
					city: searchReg
				,
					country: searchReg
				,
					professions: searchReg
				,
					industry: searchReg
				]
				if req.query["fields"]
					searchFields = []
					searchFields = getSearchFields(req.query["fields"], searchReg)
				query = $or: searchFields
			else
				query = {}
			User.find(query, (err, doc) ->
				result = (if err then err else doc)
				res.json result
			).where("type").equals("experteer").sort
				status: 1
				"employment.title": 1
				country: 1
	,

		path: "/api/social_enterprise/:id?"
		type: "GET"
		action: (req, res, next) ->
			SE = require("../models").SocialEnterprise
			query = new Object()
			id = req.params.id
			search = req.query["search"]
			if id
				query["_id"] = id
			else if search
				searchReg = (if (search) then new RegExp(req.query["search"].split(splitRegExp).join("|"), ["i"]) else "")
				searchFields = [
					name: searchReg
				,
					city: searchReg
				,
					country: searchReg
				,
					"opportunities.title": searchReg
				,
					"opportunities.profession": searchReg
				,
					"opportunities.details": searchReg
				,
					"opportunities.field": searchReg
				,
					"opportunities.skills": searchReg
				]
				if req.query["fields"]
					searchFields = []
					searchFields = getSearchFields(req.query["fields"], searchReg)
				query = $or: searchFields
			else
				query = {}
			SE.find(query, (err, doc) ->
				result = (if err then err else doc)
				res.json doc
			).sort
				status: 1
				country: 1
	,
		path: "/api/messages/:id"
		type: "DELETE"
		action: (req, res, next) ->
			Message = require("../models").Message
			Message.findById req.params.id, (err, msg) ->
				if not err and msg
					msg.remove (err, msg) ->
						res.json "SUCCESS"  unless err

				else
					res.json "ERROR"

	# ,
	# 	path: "/api/page/:slug?"
	# 	type: "GET"
	# 	action: (req, res, next) ->
	# 		Page = require("../models").Page
	# 		query = new Object()
	# 		slug = req.params.slug
	# 		Page.findOne
	# 			slug: slug
	# 		, (err, page) ->
	# 			result = (if err then err else page)
	# 			res.json result
	,
		path: "/api/recommendations/:limit?"
		type: "GET"
		login: "all"
		action: (req, res, next) ->
			id = req.user._id
			type = utils.capitalize(req.user.type)
			limit = req.params.limit or 2
			if type? and type is "Representative" or type is "Experteer"
				Recomender = require('../models')[type]
				Recomender.schema.statics.recommendations id, limit, (err, recommendations) ->
					res.json recommendations
			else
				res.redirect "Sorry there are no recommendations for you."
]

