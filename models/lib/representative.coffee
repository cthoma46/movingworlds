User = require("./user")

class Representative extends User

	@schema.statics.recommendations = recommendations = (id, limit, callback) ->
		callback()

module.exports = Representative