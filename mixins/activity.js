
module.exports = {
  getActivity : function (req, res, next) {
    req.user
      .findActivities()
      .populate('peer')
      .populate('account')
      .exec(function (err, docs) {
        if (err) {
          console.error(err, docs)
          return next(err)
        }
        if (!docs.length) {
          return next()
        }
        req.user.activity = docs
        return next()
      })
    ;
  }
}
