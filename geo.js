
var request = require('request')
  , cacheGeoCode = {}

function setupGeo (opts) {
  opts = opts || {}
  opts.timeout = opts.timeout || process.env.geocodeTimeout || 2500

  return function geo (keywords, callback) {
    if (cacheGeoCode[keywords]) {
      return callback(null, cacheGeoCode[keywords])
    }
    var params = { 
      timeout : opts.timeout, 
      url : 'http://maps.googleapis.com/maps/api/geocode/json?'
        +'address='+keywords
        +'&sensor=false'
    }
    request(params, function (error, response, body) {
      if (!error) {
        try {
          var data = JSON.parse(body)
        } catch (err) {
          console.error(err, body)
          return callback(err)
        } finally {
          data.statusCode = response.statusCode
          cacheGeoCode[keywords] = data
          return callback(null, data)
        }
      } else {
        return callback(error)
      }
    })
  }
}

module.exports = setupGeo
