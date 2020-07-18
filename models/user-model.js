const path = require('path'),
    sqlite3 = require('sqlite3').verbose()

var userModel = () => {}

userModel.createTable = function (cb){
    let db = new sqlite3.Database(path.join(__dirname, '..','db','test.db'), function(err) {
        if(err) console.log(err.message)
    })
    db.run('CREATE TABLE IF NOT EXISTS Users (Dni PRIMARY KEY, Name text, Lastname text, Birthday text)')
    db.close(function (err){
        if(err) console.log(err.message)
        cb()
    })
}

userModel.saveUser = function (user, cb) {
    let db = new sqlite3.Database(path.join(__dirname, '..','db','test.db'), function(err) {
        if(err) console.log(err.message)
    })
    
    db.run('INSERT INTO Users (Dni, Name, Lastname, Birthday) VALUES (?, ?, ?, datetime(?))', user)

    db.close(function (err) {
        if(err) cb(err.message)
        cb(null, null, user[0])
    })
}

userModel.updateUser = function (userData, cb) {
    let db = new sqlite3.Database(path.join(__dirname, '..','db','test.db'), function(err) {
        if(err) console.log(err.message)
    })

    db.run('UPDATE Users SET Name = $name, Lastname = $lastname, Birthday = $birthday WHERE Dni = $dni', {
        $dni: userData.dni,
        $name: userData.name,
        $lastname: userData.lastname,
        $birthday: userData.birthday
    })

    db.close(function (err) {
        if(err) cb(err.message)
        cb(null, null, userData['dni'])
    })
}

module.exports = userModel