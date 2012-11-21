module.exports = [

    path: "/settings"
    type: "GET"
    login: 'all'
    action: (req, res) ->
    	res.render "settings",
				title: "settings"
				headtype: "loggedin"

]