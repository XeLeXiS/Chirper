const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const Sequelize = require('sequelize')

require('dotenv').config()

const port = process.env.CHIRPER_PORT

// Database //

const sequelize = new Sequelize({
    'host'     : process.env.CHIRPER_DB_HOST,
    'port'     : process.env.CHIRPER_DB_PORT,
    'database' : process.env.CHIRPER_DB_NAME,
    'username' : process.env.CHIRPER_DB_USER,
    'password' : process.env.CHIRPER_DB_PASS,
    'dialect'  : 'mysql'
})

const User = sequelize.define('user', {
    'login' : {
        'type' : Sequelize.STRING,
        'allowNull' : false,
        'unique' : true
    },
    'password' : {
        'type' : Sequelize.STRING,
        'allowNull' : false
    }
});

const Chirp = sequelize.define('chirp', {
    'content' : {
        'type' : Sequelize.STRING,
        'allowNull' : false
    }
});

User.hasMany(Chirp)
Chirp.belongsTo(User)

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true}))
app.set('view engine', 'ejs')

app.get('/', (_, response) => {
    Chirp.findAll().then(chirps => {
        response.render('index', { 'chirps' : chirps })
    }).catch(error => {
        console.error(error)
        response.status(500).end('Internal Server Error')
    })
})
app.post('/', (request, response) => {
    Chirp.create({
        'content': request.body.content
    }).then(chirp => {
        response.redirect('/')
    }).catch(error => {
        console.error(error)
        response.status(500).end('Intertal Server Error')
    })
})

sequelize.sync().then(() => {
    return User.create({
        'login': 'user',
        'password': process.env.CHIRPER_TEST_USER_PASS
    })
}).then(() => {
    app.listen(port, () => console.log(`The Chirper server is listening on port ${port}.`))
});

