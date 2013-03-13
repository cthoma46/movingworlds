User = require('../models').User
Organization = require('../models').Organization

module.exports = [

    path: '/search'
    type: 'GET'
    login: 'all'
    action: (req, res) ->
      search_str = req.query['search']
      searchReg = new RegExp(search_str, ['i'])
      search_message = 'Results'

      # find users
      User.find(
        $or: [
          first_name: searchReg
        , last_name: searchReg
        , city: searchReg
        , country: searchReg
        , professions: searchReg
        , industry: searchReg
        ]
      ,
        _id: 1
        type: 1
        first_name: 1
        last_name: 1
        city: 1
        country: 1
        status: 1
        birthday: 1
        avatar: 1
        verified: 1
        professions: 1
      )
      .where('type')
      .equals('experteer')
      .sort
        status: 1
        professions: 1
        country: 1
      .exec (err, users) ->

        # find organizations
        Organization.find(
          $or: [
            name: searchReg
          ,
            city: searchReg
          ,
            country: searchReg
          ,
            'opportunities.title': searchReg
          ,
            'opportunities.profession': searchReg
          ,
            'opportunities.details': searchReg
          ,
            'opportunities.field': searchReg
          ,
            'opportunities.skills': searchReg
          ]
        ,
          _id: 1
          name: 1
          type: 1
          avatar: 1
          city: 1
          country: 1
          size: 1
          industry: 1
          registered: 1
          'opportunities.title': 1
          'opportunities.field': 1
        ).sort
          status: 1
          country: 1
        .exec (err, orgs) ->

          # render search resulst
          if err
            search_message = 'Ooops, There was a problem with your search'
          else
            results = users.concat(orgs)
            search_message = (if (results.length > 0) then 'There are ' + results.length + ' results for:' else 'There are no results for:')

          res.render 'search',
            title: 'Search'
            headtype: 'loggedin'
            message: search_message or ''
            search_str: search_str
            search_result: results
            opp_index: 0
]

