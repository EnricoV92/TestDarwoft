const path = require('path'),
    sqlite3 = require('sqlite3').verbose()

var userModel = () => {}

userModel.createTable = function (cb){
    let db = new sqlite3.Database(path.join(__dirname, '..','db','test.db'), function(err) {
        if(err) cb(err.message)
    })
    
    db.run('CREATE TABLE IF NOT EXISTS Users (Dni NOT NULL PRIMARY KEY, Name text, Lastname text, Birthday text)', 
        [], function(err) {
            if(err) cb(err.message)
    })
    db.close(function (err){
        if(err) cb(err.message)
            else cb(null)
    })
}

userModel.getUser = function (dni, cb) {
    let user = {}
    let db = new sqlite3.Database(path.join(__dirname, '..','db','test.db'), function(err) {
        if(err) cb(err.message)
    })

    let sql = `SELECT Dni dni, Name name, Lastname lastname, Birthday birthday
                FROM Users
                WHERE Dni = ? `
    
    db.get(sql, [dni], function (err, row) {
        if(err) cb(err.message)
            else user = row
    })
    db.close(function (err) {
        if(err) cb(err.message)
            else cb(null, user) 
    })
}

userModel.getAllUsers = function (cb) {
    let users = {}
    let db = new sqlite3.Database(path.join(__dirname, '..','db','test.db'), function(err) {
        if(err) cb(err.message)
    })

    let sql = `SELECT Dni dni, Name name, Lastname lastname, Birthday birthday
                FROM Users
                ORDER BY Dni `

    db.all(sql, [], function(err, rows) {
        if(err) cb(err.message)
            else users = rows
    })        
    db.close(function (err) {
        if(err) cb(err.message)
            else cb(null, users)
    })
}

userModel.getUsers = function(filters, cb) {
    let users = {}
    let conditions = buildGetUsersConditions(filters)
    let db = new sqlite3.Database(path.join(__dirname, '..','db','test.db'), function(err) {
        if(err) cb(err.message)
    })
    let sql = `SELECT Dni dni, Name name, Lastname lastname, Birthday birthday 
                FROM  Users 
                WHERE ` + conditions['where']
    
    db.all(sql, conditions['values'], function(err, rows) {
        if(err) cb(err.message)
            else users = rows
    })  
    db.close(function(err) {
        if(err) cb(err.message)
            else cb(null, users)
    })
}

// Conditions for combine filters 

function buildGetUsersConditions (filters) {
    let conditions = []
    let values = []

    if (filters['dateLesser']) {
        conditions.push('Birthday < datetime(?)')
        values.push(filters['dateLesser'])
    }

    if(filters['dateBigger']) {
        conditions.push('Birthday > datetime(?)')
        values.push(filters['dateBigger'])
    }

    if(filters['pattName']) {
        conditions.push('name LIKE ?')
        values.push('%' + filters['pattName'] + '%')
    }

    if(filters['pattLastname']) {
        conditions.push('lastname LIKE ?')
        values.push('%' + filters['pattLastname'] + '%')
    }

    if(filters['betweenDates']) {
        if(filters['betweenDates']['dateInf'] && filters['betweenDates']['dateSup']) {
            conditions.push('Birthday BETWEEN datetime(?) AND datetime(?)')
            values.push(filters['betweenDates']['dateInf'], filters['betweenDates']['dateSup'] )
        }
    }

    return {
        where : conditions.length ? conditions.join(' OR ') : ' 1 ',
        values : values
    }
}


userModel.saveUser = function (userData, cb) {
    let db = new sqlite3.Database(path.join(__dirname, '..','db','test.db'), function(err) {
        if(err) cb(err.message)
    })
    
    db.run('INSERT INTO Users (Dni, Name, Lastname, Birthday) VALUES (?, ?, ?, datetime(?))', userData, 
        function(err) {
            if(err) cb(err.message)
    })
    db.close(function (err) {
        if(err) cb(err.message)
            else cb(null, userData[0])
    })
}


userModel.updateUser = function (dni, userData, cb) {
    let updateKeys = buildUpdateUser(userData)
    let db = new sqlite3.Database(path.join(__dirname, '..','db','test.db'), function(err) {
        if(err) cb(err.message)
    })

    updateKeys['values'].push(dni)
    db.run('UPDATE Users SET '+ updateKeys['colums'] + ' WHERE Dni = ?', updateKeys['values'], 
        function(err) {
            if(err) cb(err.message)
    })
    db.close(function (err) {
        if(err) cb(err.message)
            else cb(null)
    })
}


function buildUpdateUser(userKeys) {
    let updateKeys = []
    let values = []

    if (userKeys['name']) {
        updateKeys.push('Name = ?')
        values.push(userKeys['name'])
    }

    if (userKeys['lastname']) {
        updateKeys.push('Lastname = ?')
        values.push(userKeys['lastname'])
    }

    if (userKeys['birthday']) {
        updateKeys.push('Birthday = datetime(?)')
        values.push(userKeys['birthday'])
    }

    return {
        colums: updateKeys.length ? updateKeys.join(', ') : '1',
        values : values
    }
}

userModel.deleteUser = function (dni, cb) {
    let db = new sqlite3.Database(path.join(__dirname, '..','db','test.db'), function(err) {
        if(err) cb(err.message)
    })
    
    db.run('DELETE FROM Users WHERE Dni = ?', [dni], function(err) {
        if(err) cb(err.message)
    })
    db.close(function(err) {
        if(err) cb(err.message)
            else cb(null)
    })
}

module.exports = userModel