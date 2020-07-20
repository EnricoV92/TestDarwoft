const express = require('express'),
    path = require('path'),
    userController = require(path.join(__dirname, '..', 'controllers', 'user-controller'))
    
var router = express.Router()
router
    .get('/', userController.index)
    .get('/users/:dni', userController.getUser)
    .get('/users', userController.getUsers)
    
    .post('/users', userController.saveUser)
    .put('/users/:dni', userController.updateUser)
    .delete('/users/:dni', userController.deleteUser)
    
module.exports = router
