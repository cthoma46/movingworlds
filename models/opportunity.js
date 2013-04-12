var mongoose = require('mongoose')
var moment = require('moment')

var OpportunitySchema = new mongoose.Schema({
  model : { 
    type : String, 
    required : true, 
    default : 'opportunity'
  },
  name : { 
    type : String, 
    default : '' 
  },
  city : { 
    type : String, 
    default : '' 
  },
  country : { 
    type : String, 
    default : '' 
  },
  description : { 
    type : String, 
    default : '' 
  },
  start : { 
    type : Date, 
    get : function (val) { 
      return moment(val).format('MM/DD/YYYY')
    },
    default : Date.now  
  },
  end : { 
    type : Date, 
    get : function (val) { 
      return moment(val).format('MM/DD/YYYY')
    },
    default : Date.now  
  },
  deadline : { 
    type : Date, 
    get : function (val) { 
      return moment(val).format('MM/DD/YYYY')
    },
    default : Date.now  
  },
  minExperience : { 
    type : Number, 
    default : 0 
  },
  supportArea : { 
    type : [ String ], 
    default : [] 
  },
  skills : { 
    type : [ String ], 
    default : [] 
  },
  languages : { 
    type : [ String ], 
    default : [] 
  },
  desiredResult : { 
    type : String, 
    default : '' 
  },
  impact : { 
    type : String, 
    default : '' 
  },
  accomodation : { 
    type : String, 
    default : '' 
  },
  accomodationDescription : { 
    type : String, 
    default : '' 
  },
  compensation : { 
    type : String, 
    default : '' 
  },
  benefits : { 
    type : String, 
    default : '' 
  },
  learn : { 
    type : String, 
    default : '' 
  },
}, { discriminatorKey : 'model' })

OpportunitySchema.add({
  organization : { 
    type : mongoose.Schema.Types.ObjectId, 
    ref : 'organization', 
    required : true 
  }
})

OpportunitySchema.virtual('url').get(function () {
  var org = typeof this.organization.id === 'undefined' 
    ? this.organization 
    : this.organization.id 
  return '/profile/' + org + '/' + this.id
})

OpportunitySchema.set({ collection : 'opportunities' })

OpportunitySchema.set({ strict : 'throw' })

module.exports = OpportunitySchema
