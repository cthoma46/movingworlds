module.exports = [

	  path: '/finalization'
	  type: 'GET'
	  action: (req, res) -> 
	  	res.render 'finalization',
				title: 'Finalization'

]