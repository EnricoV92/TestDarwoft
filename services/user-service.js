const path = require('path'),
    userModel = require(path.join(__dirname, '..', 'models','user-model'))

var userService = () => {}

userService.createTable = function(cb) {
    userModel.createTable(cb)
}

module.exports = userService