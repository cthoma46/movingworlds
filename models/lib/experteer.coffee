User = require("./user")
_ = require("underscore")

class Experteer extends User

	###
	# for some reason you have to call this like:
	# User.schema.statics.recommendations
	###
	@schema.statics.recommendations = (id, limit, callback) ->
		SE = require("./social_enterprise")
		User.findById id, (err, user) ->
			# console.log id, user.profile, user.professions, user.skills
			SE.find(
				$or: [
						country: user.profile.countries
					,
						"opportunities.professions": "user.professions"
					,
						"opportunities.skills": "user.skills"
					]
				).exec (err, ses) ->
				ses = _.shuffle ses
				list = []

				if ses.length > limit
					while limit > 0
						limit--
						list.push(ses.pop())
				else
					list = ses

				callback(err, list)



module.exports = Experteer