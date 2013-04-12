;(function () {

  _.extend(Backbone.Model.prototype, {
    validate : function (attrs) {
      var schema = this.schema || {} 
      var attrs = this.attributes

      for (var key in schema) {
        var attr = attrs[key]
        var field = schema[key]
        var type = typeof field === 'object' ? field.type : field
        var enum = field.enum
        var validators = field.validators || []

        if (field.required && !attr) {
          return '`' + key + '` is required.'
        }

        if (!attr) {
          continue
        }

        if (enum && !_.contains(enum, attr)) {
          return '`' + key + '` must be one of ' + enum.join(', ')
        }

        if (_.isString(type) && typeof attr !== type) {
          return '`' + key + '` must be a ' + type
        }

        if (_.isFunction(type) && attr.constructor !== type) {
          return '`' + key + '` must be a ' + type.prototype.constructor.name
        }

        for (var i = validators.length; i--) {
          var error = validators[i].call(this, attr)
          if (error) {
            return error
          }
        }

        delete attrs[key]
      }

      // schema is always strict
      if (_.size(attrs)) {
        return _.keys(attrs).join(', ') + ' are not in the schema'
      }
    }
  });

}());

// var User = Backbone.Model.extend({

//   schema : {
//     nickname : String,
//     username : { type: String, required: true },
//     joined : Date
//   }

//   // All your other normal Backbone.Model code...

// })
