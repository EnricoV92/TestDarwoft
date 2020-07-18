const express = require('express'),
    path = require('path'),
    userController = require(path.join(__dirname, '..', 'controllers', 'user-controller'))
    
var router = express.Router()
router
    .get('/', userController.index)
    .get('/user/:dni', userController.getUser)
    .get('/users', userController.getAllUsers)

    .post('/user', userController.saveUser)
    .put('/user', userController.updateUser)
    .delete('/user')
module.exports = router
