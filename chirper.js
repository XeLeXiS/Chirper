const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mysql = require('mysql')

require('dotenv').config()

const port = process.env.CHIRPER_PORT

const connection = mysql.createConnection({
    host     : process.env.CHIRPER_DB_HOST,
    user     : process.env.CHIRPER_DB_USER,
    password : process.env.CHIRPER_DB_PASS,
    database : process.env.CHIRPER_DB_NAME
})

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true}))
app.set('view engine', 'ejs')

app.get('/', (_, response) => {
    connection.query('SELECT * FROM chirps;', (error, results) => {
        if (error) throw error
        response.render('index', { 'chirps' : results })
    })
})
app.post('/', (request, response) => {
    const content = request.body.content
    connection.query("INSERT INTO chirps SET ?;", { 'content' : content }, error => {
        if (error) throw error
        response.writeHead(302, {
            'Location': '/'
        });
        response.end();
    })
})

app.listen(port, () => console.log(`The Chirper server is listening on port ${port}.`))
