var troop = require('mongoose-troop')

module.exports = function (schema, opts) {
  var paths = Object.keys(schema.paths)
  opts = opts || {}
  opts.excluded = opts.excluded || []
  paths = paths.filter(function (path) {
    return (String(schema.paths[path].instance) === 'String'
      && opts.excluded.indexOf(schema.paths[path]) === -1)
  })
  opts.source = paths
  opts.naturalize = true

  /**
   * Search for the provided keywords and return a query cursor 
   * 
   */
  schema.statics.search = function (q) {
    return this.find({ keywords : { $in : this.extractKeywords(q) } })
  }
  schema.plugin(troop.keywords, opts)
}
