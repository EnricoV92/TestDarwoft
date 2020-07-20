const path = require('path'),
    userModel = require(path.join(__dirname, '..', 'models','user-model'))

var userService = () => {}

userService.createTable = function(cb) {
    userModel.createTable(cb)
}

userService.getUser = function (dni, cb) {
    userModel.getUser(dni, cb)
}

userService.getAllUsers = function (cb) {
    userModel.getAllUsers(cb)
}

userService.getUsers = function (filters, cb) {
    let notValidDates = []

    if(filters['dateLesser']) {
        if(!validateDateFormat(filters['dateLesser'])) {
            notValidDates.push('dateLesser')
        }
    }
    if(filters['dateBigger']) {
        if(!validateDateFormat(filters['dateBigger'])) {
            notValidDates.push('dateBigger')
        }
    }
    if(filters['betweenDates']) {
        console.log(filters['betweenDates'])
        if(filters['betweenDates']['dateInf']) {
            if(!validateDateFormat(filters['betweenDates']['dateInf'])) {
                notValidDates.push('dateInf')
            }
        }
        if(filters['betweenDates']['dateSup']) {
            if(!validateDateFormat(filters['betweenDates']['dateSup'])) {
                notValidDates.push('dateSup')
            }
        }
    }
    if(!notValidDates.length) {
        userModel.getUsers(filters, cb)
    } else {
        let err = 'El formato de fecha ' + notValidDates.join(', ') + ' es incorrecto'
        cb(err)
    }
    
}

userService.saveUser = function (userKeys, cb) {
    let userData = []
    let requiredKeys = []

        if(userKeys['dni'] !== "") {
            userData.push(userKeys['dni'])
        } else {
            requiredKeys.push('dni')
        }

        if(userKeys['name'] !== "") {
            userData.push(userKeys['name'])
        } else {
            requiredKeys.push('name')
        }

        if(userKeys['lastname'] !== "") {
            userData.push(userKeys['lastname'])
        } else {
            requiredKeys.push('lastname')
        }

        if(userKeys['birthday'] == "" ) {
            requiredKeys.push('birthday')
        }  

        if(!requiredKeys.length) {
            if(validateDateFormat(userKeys['birthday'])) {
                userData.push(userKeys['birthday'])
                userModel.saveUser(userData, cb)
            } else {
                let err = 'El formato fecha de Birthday es incorrecto' 
                cb(err)
            }
        } else { 
            let err = 'El campo ' + requiredKeys.join(', ') + ' es requerido'
            cb(err)
        }
    } 
        
userService.updateUser = function (dni, userKeys, cb) {
    if(dni == userKeys['dni']) {
        if(userKeys['birthday'] && !validateDateFormat(userKeys['birthday'])){
            let err = 'El formato fecha de Birthday es incorrecto'
            cb(err)
        } else {
            userModel.updateUser(dni, userKeys, cb)
        }   
    } else {
        let err = 'No se pudo actualizar el User'
        cb(err)
    }
    
}

userService.deleteUser = function (dni, cb) {
    userModel.deleteUser(dni, cb)
}

function validateDateFormat(date) {
    let dateFormat = /^(19|20)\d{2}[\-](0[1-9]|1[0-2])[\-](0[1-9]|[1-2][0-9]|3[01])$/
    return dateFormat.test(date)

}
module.exports = userService