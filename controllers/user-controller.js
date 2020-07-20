

const path = require('path'),
    userService = require(path.join(__dirname, '..', 'services','user-service'))

var userController = () => { }

userController.index = function(req, res) {
    userService.createTable(function(err) {
        if(err) res.send(err)
            else res.status(200).send('Init Test OK! \nTabla Users creada')
    })
}

userController.getUser = function (req, res) {
    let dni = req.params.dni
    userService.getUser(dni, function(err, user) {
        if(err) res.send(err)
            else res.status(200).json(user)
    })
}

userController.getUsers = function (req, res) {
    let filters = req.query
    if(!filters) {
        getAllUsers(res)
    } else {
        getUsers(filters, res)
    }
}

function getAllUsers (res) {
    userService.getAllUsers(function (err, users) {
        if(err) res.send(err)
            else res.status(200).json(users)
    })
}

function getUsers (filters, res) {
    userService.getUsers(filters, function(err, users) {
        if(err) res.send(err)
            else res.status(200).json(users)
    })
}

userController.saveUser = function(req, res) {
    let userKeys = req.body
    
    userService.saveUser(userKeys, function (err, dni) {
        if(err) res.send(err)
            else res.status(200).send(`User con dni ${dni} insertado con éxito`)
    })
}

userController.updateUser = function (req, res) {
    let dni = req.params.dni
    let userKeys = req.body
    userService.updateUser(dni, userKeys, function (err) {
        if(err) res.send(err)
            else res.status(200).send(`User con dni ${dni} actualizado con éxito`) 
    })
}

userController.deleteUser = function (req, res) {
    let dni = req.params.dni
    userService.deleteUser(dni, function(err) {
        if(err) res.send(err)
            else res.status(200).send(`User con dni ${dni} eliminado con éxito`)
    })
}
module.exports = userController