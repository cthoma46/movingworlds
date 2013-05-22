var mongoose = require('mongoose')

module.exports = function (schema, opts) {

  schema.virtual('completion').get(function () {
    var model = this
    var total = 0
    var count = 0
    var paths = Object.keys(schema.paths)
    paths = paths.filter(function (path) {
      if (Array.isArray(schema.paths[path].options.type)) {
        return schema.paths[path].options.type[0].name === 'String'
      }
      return schema.paths[path].options.type.name === 'String'
    })
    total = paths.length
    paths = paths.filter(function (path) {
      if (Array.isArray(model[path])) {
        if (model[path].length >= 1) {
          return model[path][0].length >= 1
        }
        return false
      }
      return model[path] && model[path].length >= 1
    })
    count = paths.length
    return Math.round( (count / total) * 100 ) / 100
  })

  schema.virtual('incomplete').get(function () {
    var model = this
    var paths = Object.keys(schema.paths)
    paths = paths.filter(function (path) {
      if (Array.isArray(schema.paths[path].options.type)) {
        return schema.paths[path].options.type[0].name === 'String'
      }
      return schema.paths[path].options.type.name === 'String'
    })
    paths = paths.filter(function (path) {
      if (Array.isArray(model[path])) {
        if (model[path].length) {
          return model[path][0].length < 1
        }
        return true
      }
      return !model[path] || model[path].length < 1
    })
    return paths
  })

}
