var Models = require('../models')

function Resource (model) {
  this.model = model
}

Resource.prototype = {

  create : function (req, res, next) { 
    console.log(req.body)
    console.log(req.query)
    new this.model(req.query)
      .save(function (err, doc) {
        res.json(err || doc)
      })
    ;
  },

  models : function (req, res, next) { 
    var conditions = { 
      // query : req.query || null, 
      page : req.query.page || null,
      limit : req.query.limit || null,
      fields : req.query.fields || null
    }
    delete req.query.page
    delete req.query.limit
    delete req.query.fields
    conditions.query = req.query
    try {
      this.model.paginate(conditions, function (err, docs) {
        res.json(err || docs)
      })
    } catch (error) {
      res.json(error.toString())
    }
  },

  read : function (req, res, next) { 
    this.model.findById(req.params._id)
      .exec(function (err, doc) {
        res.json(err || doc)
      })
    ;
  },

  delete : function (req, res, next) { 
    this.model.findByIdAndRemove(req.params._id)
      .exec(function (err, doc) {
        res.json(err || doc)
      })
    ;
  },

  update : function (req, res, next) { 
    this.model.findById(req.params._id).exec(function (error, doc) {
      if (error || !doc) {
        return res.json(error || new Error('Document not found'))
      }
      doc.merge(req.body)

      // console.log(doc.constructor.modelName, doc.__proto__.schema)

      doc.save(function (err) {
        res.json(err || doc)
      })
    })
  }

}

// organization should be able to create an opportunity
// experteer <-> organization should be able to create intros
// experteer should be able to search for opportunity/experteer/organization
// organization should be able to search for opportunity/experteer/organization

module.exports = function (app) {
  var accounts = new Resource(Models.Account)
  var opportunities = new Resource(Models.Opportunity)

  app.all('/api/:model/:_id?', hasContentType([ 'json' ]))


  app.post('/api/account', accounts.create.bind(accounts))
  app.get('/api/account', accounts.models.bind(accounts))
  app.get('/api/account/:_id', accounts.read.bind(accounts))
  app.put('/api/account/:_id', accounts.update.bind(accounts))
  app.delete('/api/account/:_id', accounts.delete.bind(accounts))


  // create an opportunity
  app.post('/api/opportunity', opportunities.create.bind(opportunities))
  
  // read a list of opportunities
  app.get('/api/opportunity', opportunities.models.bind(opportunities))
  
  // read an opportunity
  app.get('/api/opportunity/:_id', opportunities.read.bind(opportunities))
  
  // update an opportunity
  app.put('/api/opportunity/:_id', opportunities.update.bind(opportunities))

  // delete an opportunity
  app.delete('/api/opportunity/:_id', opportunities.delete.bind(opportunities))



// create an opportunity that belongs to an organization

// get all of the opportunities that belong to an organization

// delete an opportunity

// update an opportunity

}



/**
 * Returns a connect middleware function that checks if 
 * `req['content-type']` matches the provided types
 *
 * - Calls `next` on success
 * - Redirects to `/406` on failure
 *
 * ex: app.get('/some/json/route', hasContentType('json'), myRoute) 
 * ex: app.get('/api/route', hasContentType([ 'json', 'text' ]), myRoute) 
 * 
 * @param {String|Array} contentType
 * @return {Function} connect middleware function
 */

function hasContentType (contentType) {
  return function (req, res, next) {
    if (req.accepts(contentType) !== undefined) {
      next()
    } else {
      res.json({ 
        err : 'Content-Type ' + req.headers['content-type'] + ' not allowed.',
      }, 406)
    }
  }
}

/**
 * Returns a connect middleware function that checks if `param` in `req.params`
 * also exists in `hash`
 *
 * - Calls `next` on success
 * - Redirects to `/400` on failure
 *
 * ex: app.get('/:_type/:_id?', hasParamAsPropertyInHash('_type', models), cb) 
 *
 * @param {String} param
 * @param {Object} hash
 * @return {Function} connect middleware function
 */

function hasParamAsPropertyInHash (prop, hash) { 
  if (typeof prop !== 'string') {
    throw new Error('provide a String as the first argument, not ' + prop)
  }
  if (typeof hash !== 'object') {
    throw new Error('provide an Object as the first argument, not ' + hash)
  }
  return function (req, res, next) {
    if (hash.hasOwnProperty(req.params[prop])) {
      next()
    } else {
      res.json({ 
        err : 'Invalid ' + prop + ' value ' + req.params[prop],
        enum : Object.keys(hash)
      }, 400)
    }
  }
}

/**
 * Returns a connect middleware function that checks if `req.user.access` is
 * equivalent to `level`
 * 
 * - Calls `next` on success
 * - Redirects to `/403` on failure
 * 
 * ex: app.get('/:collection', hasAccess([ 'user', 'admin' ]), cb) 
 *
 * @param {String|Array} level
 * @return {Function} connect middleware function
 */

function hasAccess (level) {
  if (typeof level === 'string') {
    level = [ level ]
  }
  if (!Array.isArray(level)) {
    throw new Error('provide a String or Array, not ' + level)
  }
  return function (req, res, next) {
    if (level.indexof(req.user.access) !== -1) {
      next()
    } else {
      res.json({ err : 'Insufficient authentication.', code : 403 }, 403)
    }
  }
}









