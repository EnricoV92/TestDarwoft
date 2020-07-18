const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    port = (process.env.PORT || 3000),
    userRouter = require(path.join(__dirname, 'routes', 'user-router'))

var app = express()
app 
    .set('port', port)

    .use(bodyParser.urlencoded({
        extended: false
    }))
    .use(bodyParser.json())
    .use(userRouter)
    .use(error404)
    
    .listen(app.get('port'), function () {
        console.log(`Escuchando en el puerto ${app.get('port')} `)
    })

function error404 (req, res) {
    error = 'URL no encontrada'
    res.status(404).send(error)
}

module.exports = app