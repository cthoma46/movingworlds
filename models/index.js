require('rconsole')
var mongoose = require('mongoose')
var troop = require('mongoose-troop')
var plugins = require('./plugins')

mongoose.plugin(troop.timestamp)
mongoose.plugin(troop.merge)
mongoose.plugin(function (schema) {
  schema.method('addDefaults', function () {
    for (var key in schema.paths) {
      if (schema.paths[key].options.default && !this[key]) {
        console.log(schema.paths[key].options.default)
        this[key] = schema.paths[key].options.default 
      }
    }
    return this
  })
})
mongoose.plugin(troop.pagination)

mongoose.model('account',       require('./account'))
mongoose.model('experteer',     require('./experteer'))
mongoose.model('organization',  require('./organization'))
mongoose.model('activity',      require('./activity'))
mongoose.model('opportunity',   require('./opportunity'))
mongoose.model('page',          require('./page'))
