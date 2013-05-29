var mongoose = require('mongoose')
var Opportunity = mongoose.model('opportunity')

module.exports = {

  create : function (req, res, next) { 
    res.locals({ title : 'Setup Opportunities' })
    res.locals({ opportunity : new Opportunity() })
    return next()
  },

  read : function (req, res, next) { 
    Opportunity.findById(req.params.id, function (err, doc) {
      if (err) {
        req.flash('error', err)
        return res.redirect('back')
      }
      res.locals({ title : 'Edit Opportunity' })
      res.locals({ opportunity : doc })
      return next()
    })
  },

  edit : function (req, res, next) {
    req.user.opportunityUpsert(req.body.opportunity, function (err) {
      if (err) {
        return next(err)
      }
      return res.redirect(req.body.next || '/profile/' 
        + req.user.id + '/' 
        + req.body.opportunity._id) 
    })
  },

  delete : function (req, res, next) { 
    req.user.opportunityRemove(req.params.id, function (error) {
      if (error) { 
        console.error(error)
        return next(error)
      }
      return res.redirect('/landing')
    })
  },

}

