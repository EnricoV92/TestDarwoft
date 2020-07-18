const path = require('path'),
    userService = require(path.join(__dirname, '..', 'services','user-service'))

var userController = () => { }

userController.index = function(req, res) {
    userService.createTable(function() {
        res.status(200).send('Init Test OK! \nTabla Users Creada')
    })
}

module.exports = userController