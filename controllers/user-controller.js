const path = require('path'),
    userService = require(path.join(__dirname, '..', 'services','user-service'))

var userController = () => { }

userController.index = function(req, res) {
    userService.createTable(function() {
        res.status(200).send('Init Test OK! \nTabla Users creada')
    })
}

userController.getUser = function (req, res) {
    let dni = req.params.dni
    userService.getUser(dni, function(err, user) {
        if(err) res.send(err)
        res.status(200).send(user)
    })
}

userController.getAllUsers = function (req, res) {
    userService.getAllUsers(function (err, users) {
        if(err) res.send(err)
        res.status(200).send(users)
    })
}

userController.saveUser = function(req, res) {
    let dni = req.body.dni
    let name = req.body.name
    let lastname = req.body.lastname
    let birthday = req.body.birthday

    userService.saveUser(dni, name, lastname, birthday, function (err, key, user) {
        if(key) res.status(503).send(`El campo ${key} es requerido`) 
        res.status(200).send(`User con dni ${user} insertado con éxito`)
    })
}

userController.updateUser = function (req, res) {
    let userData = req.body

    userService.updateUser(userData, function (err, key, dni) {
        if(key) res.status(503).send(`El campo ${key} es requerido`)
        res.status(200).send(`User con dni ${dni} actualizado con éxito`) 
    })
}

module.exports = userController