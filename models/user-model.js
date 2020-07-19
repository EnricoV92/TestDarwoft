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

userModel.getUser = function (dni, cb) {
    let user = {}
    let db = new sqlite3.Database(path.join(__dirname, '..','db','test.db'), function(err) {
        if(err) console.log(err.message)
    })

    let sql = `SELECT Dni dni, Name name, Lastname lastname, Birthday birthday
                FROM Users
                WHERE Dni = ? `
    
    db.get(sql, [dni], function (err, row) {
        if(err) cb(err)
        user = row
    })

    db.close(function (err) {
        if(err) cb(err.message)
        cb(null, user) 
    })
}

userModel.getAllUsers = function (cb) {
    let users = {}
    let db = new sqlite3.Database(path.join(__dirname, '..','db','test.db'), function(err) {
        if(err) console.log(err.message)
    })

    let sql = `SELECT Dni dni, Name name, Lastname lastname, Birthday birthday
                FROM Users
                ORDER BY Dni `

    db.all(sql, [], function(err, rows) {
        if(err) cb(err.message)
        users = rows
    })
            
    db.close(function (err) {
        if(err) cb(err.message)
        cb(null, users)
    })
}

userModel.getUsers = function(filter, cb) {
    let conditions = buildConditions(filter)
    let db = new sqlite3.Database(path.join(__dirname, '..','db','test.db'), function(err) {
        if(err) console.log(err.message)
    })
    let sql = `SELECT Dni dni, Name name, Lastname lastname, Birthday birthday 
                FROM  Users WHERE ` + conditions['where']
    
    console.log (sql)
    db.all(sql, conditions['values'], function(err, rows) {
        if(err) cb(err.message)
        users = rows
    })  
    
    db.close(function(err) {
        if(err) cb(err.message)
        cb(null, users)
    })
}

function buildConditions (filter) {
    let conditions = []
    let values = []

    if (filter['dateLesser']) {
        conditions.push('Birthday < datetime(?)')
        values.push(filter['dateLesser'])
    }

    if(filter['dateBigger']) {
        conditions.push('Birthday > datetime(?)')
        values.push(filter['dateBigger'])
    }

    if(filter['pattName']) {
        conditions.push('name LIKE ?')
        values.push('%' + filter['pattName'] + '%')
    }

    if(filter['pattLastname']) {
        conditions.push('lastname LIKE ?')
        values.push('%' + filter['pattLastname'] + '%')
    }

    if(filter['betweenDates']) {
        if(filter['betweenDates']['dateInf'] && filter['betweenDates']['dateSup']) {
            conditions.push('Birthday BETWEEN ? AND ?')
            values.push(filter['betweenDates']['dateInf'], filter['betweenDates']['dateSup'] )
        }
    }


    return {
        where : conditions.length ? conditions.join(' OR ') : ' 1 ',
        values : values
    }
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