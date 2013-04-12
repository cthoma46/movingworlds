var Models = require('../models')
var axx = require('./access-control')
var _ = require('underscore')

module.exports = function (app) {
  app.all('/search/:model/:page?', searchPage, renderSearch)
}

function searchPage (req, res, next) {
  req.query.filter = req.query.filter || {}
  var searchRequest = module.exports.searchRequest
  searchRequest(req, res, function () {
    req.params.count = true
    res.locals({ query : req.query })
    res.locals({ filter : req.query.filter })
    searchRequest(req, res, next)
  })
}

module.exports.searchRequest = function searchRequest (req, res, next) {
  var query = _.clone(req.query)
  var params = req.params 

  if (!params.model) {
    if (req.user.model === 'organization') {
      params.model = 'experteer'  
    } else {
      params.model = 'opportunity'  
    }
  }

  var modelName = params.model.charAt(0).toUpperCase() + params.model.slice(1)

  query.filter = query.filter || {}
  query.limit = query.limit || 10
  query.page = query.page || 1

  // if (!query.q) {
    // query.q = params.model
  // }
  
  console.log('query.q', query.q)

  // 
  // pre search
  // 
  Object.keys(query.filter).forEach(function (key) {
    if (query.filter[key].length) {
      query.q = query.q + ' ' + query.filter[key]      
    }
  })

  var db = Models[modelName]
    .search((!!query.q) ? query.q : params.model)
    .where('model').equals(params.model)

  //
  // post search filter
  // 
  Object.keys(query.filter).forEach(function (key) {
    if (query.filter[key].length) {
      db.where(key).equals(query.filter[key])
    }
  })

  db
    .skip(query.limit * (query.page - 1))
    .limit(query.limit)
    .populate('organization')

    if (params.count) {
      db.count()
    }

    db.exec(function (err, docs) {
      if (err || !docs) {
        console.error(err, docs)
        return next()
      }
      if (params.count) {
        var data = {
          page : Math.ceil(query.page),
          pages : Math.ceil(docs / query.limit),
          nextPage : false,
          previousPage : false
        }

        data.previousPage = data.page - 1
        data.nextPage = data.page + 1

        if (data.nextPage > data.pages) {
          data.nextPage = false
        }

        console.log(data)
        res.locals(data)
        return next()
  
      } else if (params.model === 'opportunity') {
        docs = docs.map(function (doc) {
          doc.model = 'organization'
          doc.size = doc.organization.size
          return doc
        })
      } 

      res.locals({ search_result : docs })
      return next()
    })
}

// function getSearchPages () {
//   var conditions = { 
//     // query : req.query || null, 
//     page : req.query.page || null,
//     limit : req.query.limit || null,
//     fields : req.query.fields || null
//   }
//   delete req.query.page
//   delete req.query.limit
//   delete req.query.fields
//   conditions.query = req.query
//   try {
//     this.model.paginate(conditions, function (err, docs) {
//       res.json(err || docs)
//     })
//   } catch (error) {
//     res.json(error.toString())
//   }
// }


// Models[modelName].paginate
//     page : 1,
//     pages : 1,
//     nextPage : false,
//     previousPage : false


function renderSearch (req, res) {
  res.render('private/search', {
    title : 'Search',
    headtype : 'loggedin',
    message : '',
    search_str : req.query.q,
    opp_index : 0,
    search : true
  })
}
