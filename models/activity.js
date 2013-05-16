var mongoose = require('mongoose')
var moment = require('moment')

var ActivitySchema = new mongoose.Schema({
  account : { 
    type : mongoose.Schema.Types.ObjectId, 
    required : true,
    ref : 'account'
  },
  peer : { 
    type : mongoose.Schema.Types.ObjectId, 
    required : true,
    ref : 'account'
  },
  type : { 
    type : String,
    required : true
  },
  created : { 
    type : Date,
    get : function (val) {
      return moment(val).format('MM/DD/YYYY')
    }
  }
})

module.exports = ActivitySchema
