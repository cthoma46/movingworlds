# Organization = require('../models').Organization

module.exports = [

    # path: '/explore'
    # type: 'GET'
    # action: (req, res) ->
    #   search_str = req.query['search']
    #   searchReg = new RegExp(search_str, ['i'])
    #   search_message = 'Results'
    #   SE.find(
    #     $or: [
    #       name: searchReg
    #     , city: searchReg
    #     , country: searchReg
    #     , 'opportunities.title': searchReg
    #     , 'opportunities.profession': searchReg
    #     , 'opportunities.details': searchReg
    #     , 'opportunities.field': searchReg
    #     , 'opportunities.skills': searchReg
    #     ]
    #   ,
    #     _id: 1
    #     name: 1
    #     type: 1
    #     avatar: 1
    #     city: 1
    #     country: 1
    #     size: 1
    #     'opportunities.title': 1
    #     'opportunities.field': 1
    #   ).sort
    #     status: 1
    #     country: 1
    #   .exec (err, ses) ->

    #     if err
    #       search_message = 'Ooops, There was a problem with your search'

    #     else
    #       search_message = (if (ses.length > 0) then 'There are ' + ses.length + ' results for:' else 'There are no results for:')

    #     res.render 'explore',
    #       title: 'Explore'
    #       message: search_message
    #       search_str: search_str
    #       search_result: ses
    #       opp_index: 0

]