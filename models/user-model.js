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

module.exports = userModel