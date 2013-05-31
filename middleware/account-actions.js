var _ = require('underscore')
var mongoose = require('mongoose')
var Account = mongoose.model('account') 
// var Opportunity = mongoose.model('opportunity') 
var bcrypt = require('bcrypt')
var fs = require('fs')
var mail = require('../mail')
var geo = require('../geo')()
var account = {}

account.getFeaturedData = function (req, res, next) {
  Account
    .find({ featured : true })
    .select('city country description model avatar industry')
    .exec(function (err, docs) {
      if (err) {
        console.error(err)
        return next()
      }
      var ii = docs.length + 1
      docs = docs.map(function (doc) { 
        var obj = {
          description : doc.description,
          video_id : "xlV6LS3vc7M",
          image : doc.avatar || "/images/icn_avatar_organization.png",
          h4 : doc.model,
          h3 : doc.city + ', ' + doc.country,
          h2 : doc.industry,
          y : "240",
          x : "740",
          type : doc.model.slice(0,3),
          city : doc.city,
          country : doc.country
        } 
        geo(doc.city + ', ' + doc.country, function (err, data) {
          if (err) {
            console.error(err)
          }
          // our frontend map is about 1100 x 500
          obj.location = data.results[0].geometry.location
          obj.x = (180 - obj.location.lng) / 360
          obj.x = 1 - obj.x
          obj.y = (90 - obj.location.lat) / 180
          obj.x = String(Math.round(obj.x * 1160)+1)
          obj.y = String(Math.round(obj.y * 600)+1)

          console.log(obj)
          then()
        })
        return obj
      })
      then()
      function then () {
        if (!--ii) {
          res.locals({ featuredOpportunities : docs })
          return next()
        }
      }
    })
  ;
}

account.searchPage = function (req, res, next) {
  req.query.filter = req.query.filter || {}
  var searchRequest = module.exports.searchRequest
  searchRequest(req, res, function () {
    req.params.count = true
    res.locals({ query : req.query })
    res.locals({ filter : req.query.filter })
    searchRequest(req, res, next)
  })
}

account.feature = function (req, res, next) {
  req.user.featured = true
  next()
}

account.unfeature = function (req, res, next) {
  req.user.featured = false
  next()
}

account.publish = function (req, res, next) {
  req.user.published = true
  next()
}

account.unpublish = function (req, res, next) {
  req.user.published = false
  next()
}

account.save = function (req, res, next) {
  // handle avatar upload
  if (req.files) {
    req.body.avatar = saveAvatar(req.files, req.user)
  }
  req.user.merge(req.body)
  req.user.save(function (error) {
    if (error) {
      console.error(error)
      req.flash('error', 'An account with that email already exists.')
      return res.redirect(req.body.next || 'back')
    }
    return res.redirect(req.body.next || 'back')
  })
}

account.searchRequest = function (req, res, next) {
  var query = _.clone(req.query)
  var params = req.params 
  if (!params.model) {
    if (req.user.model === 'organization') {
      params.model = 'experteer'  
    } else {
      params.model = 'opportunity'  
    }
  }
  var modelName = params.model
  query.filter = query.filter || {}
  query.limit = query.limit || 10
  query.page = query.page || 1
  // pre search
  Object.keys(query.filter).forEach(function (key) {
    if (query.filter[key].length) {
      query.q = query.q + ' ' + query.filter[key]      
    }
  })
  // search
  var db = mongoose.model(modelName)
    .search((!!query.q) ? query.q : params.model)
    .where('model').equals(params.model)
  // post search filter
  Object.keys(query.filter).forEach(function (key) {
    if (query.filter[key].length) {
      db.where(key).equals(query.filter[key])
    }
  })
  db.where('published').equals(true)
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

account.defaults = function (req, res, next) {
  req.user.addDefaults()
  return next()
}

account.password = function (req, res, next) {
  if (!req.body.password && !req.body.confirm) {
    return next()
  }
  if (req.body.password !== req.body.confirm) {
    req.flash('error', 'Your passwords did not match')
    return res.redirect('back')
  }
  req.user.hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
  return next()
}

// account.opportunity = function (req, res, next) {
//   req.user.opportunityUpsert(req.body.opportunity, function (err) {
//     if (err) {
//       return next(err)
//     }
//     return res.redirect(req.body.next || '/profile/' 
//       + req.user.id + '/' 
//       + req.body.opportunity._id) 
//   })
// }

account.experteer = function (req, res, next) { 
  console.log('setup.experteer.basic', req.user.model)
  req.user.model = 'experteer'
  next()
}

account.organization = function (req, res, next) { 
  console.log('setup.organization.basic', req.user.model)
  req.user.model = 'organization'
  next()
}

// account.opportunityDelete = function (req, res, next) { 
//   req.user.opportunityRemove(req.params.id, function (error) {
//     if (error) { 
//       console.error(error)
//       return next(error)
//     }
//     return res.redirect('/landing')
//   })
// }

account.intro = function (req, res, next) {
  // req.user.id wants to contact req.params._id
  Account.findById(req.params._id, function (error, doc) {
    if (error || !doc) {
      return err(error, 'Oops, something went wrong. Please contact us.')
    }
    doc.addDefaults()
    return contactRequest(req.user, doc)
  })
  function contactRequest (user, contact) {
    var params = {
      subject : user.name + ', you requested an intro with ' + contact.name,
      to : user.name + '<' + user.email + '>',
      userProfile : user.url,
      userName : user.name,
      contactProfile : contact.url,
      contactName : contact.name
    }
    mail('intro-notification', params, function (error, result) {
      if (error) {
       return err(error, 'Oops, something went wrong. Contact us.')
      }
      user.saveActivity('intro', contact, function (err) {
        if (err) {
         return err(err, 'Oops, something went wrong. Contact us.')
        }
        return success(result, 'The Moving Worlds team will be in touch soon.')
      })
    })
  }
  function err (error, msg) {
    console.error(error, msg)
    req.flash('error', msg)
    return res.redirect('back')
  }
  function success (result, msg) {
    console.notice(result, msg)
    req.flash('success', msg)
    return res.redirect('back')
  }
}

account.charge = function (req, res, next) {
  var params = {
    cents : req.body.cents || 9900,
    stripeToken : req.body.stripeToken
  }
  req.user.charge(params, function (error, response) {
    console.log('Stripe Response', error, response)
    if (error) {
      req.flash('error', error.toString())
      return res.redirect('back')
    }
    req.user.save(function (err) {
      if (err) {
        console.error('Stripe processed CC but it wasnt saved locally.')
      }
      req.flash('success', 'Payment processed successfully')
      return res.redirect('/landing')
    })
  })
}

account.charge.basic = function (req, res, next) {
  req.body.cents = 9900
  next()
}

account.charge.premium = function (req, res, next) {
  req.body.cents = 19900
  next()
}

account.charge.plus = function (req, res, next) {
  req.body.cents = 69900
  next()
}


function saveAvatar (files, user) {
  if (files && files.avatar && files.avatar.length > 0) {
    var file = fs.readFileSync(files.avatar.path)
    var fileName = user._id + '.' + files.avatar.type.split('/')[1]
    var path = __dirname + '/../public/avatars/' + fileName
    fs.writeFileSync(path, file)
    return '/avatars/' + fileName
  }
}

module.exports = account
