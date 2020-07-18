const path = require('path'),
    userModel = require(path.join(__dirname, '..', 'models','user-model'))

var userService = () => {}

userService.createTable = function(cb) {
    userModel.createTable(cb)
}

userService.saveUser = function (dni, name, lastname, birthday, cb) {
    let user = []
    if(dni !== null || dni !== "") {
        user.push(dni)
    } else {
        cb(null, 'dni')
    }
    if(name !== null || name !== "") {
        user.push(name)
    } else {
        cb(null, 'name')
    }
    if(lastname !== null || lastname !== "") {
        user.push(lastname)
    } else {
        cb(null, 'lastname')
    }
    if(birthday !== null || birthday !== "") {
        user.push(birthday) 
    } else  {
        cb(null, 'birthday')
    }
    userModel.saveUser(user, cb)       
}

userService.updateUser = function (user, cb) {
    if(user['dni'] == null || user['dni'] == "") {
        cb(null, 'dni')
    }
    userModel.updateUser(user, cb)
}

module.exports = userService