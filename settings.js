var fs = require('fs')

module.exports = JSON.parse(fs.readFileSync('/opt/movingworlds/movingworlds.json'))
