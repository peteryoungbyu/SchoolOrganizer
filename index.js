//Loads environment variables from a .env file into your Node app.
require('dotenv').config();

//Imports the Express library, which helps you easily build web servers in Node.js.
//Express simplifies routing, handling requests, and sending responses.
const express = require("express");

//Imports a library that lets you store session data on the server.
//Sessions can remember information about a user between requests, like login status.
const session = require("express-session");

//Imports Node’s built-in path module for working with file and folder paths.
let path = require("path");

// Allows you to read the body of incoming HTTP requests and makes that data available on req.body
let bodyParser = require("body-parser");

//Creates an Express application instance.
//This app is what you use to define routes, middleware, and start the server.
let app = express();

// Use EJS for the web pages - requires a views folder and all files are .ejs
app.set("view engine", "ejs");

// process.env.PORT is when you deploy and 3000 is for test
const port = process.env.PORT || 3000;


//Sets up a session
app.use(
    session(
        {
    secret: process.env.SESSION_SECRET || 'fallback-secret-key',
    resave: false,
    saveUninitialized: false,
        }
    )
);

// Imports the knex library and establishes the connection to the database
const knex = require("knex")({
    client: "pg",
    connection: {
        host : process.env.DB_HOST,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_NAME,
        port : process.env.DB_PORT  
    }
});


//Allows the server to access static files in the public folder such as the image I added
app.use(express.static('public'));


//Middleware that parses incoming form data and makes it available on req.body.
//extended: true allows parsing of complex data like nested objects.
app.use(express.urlencoded({extended: true}));


app.use((req, res, next) => {
    next();
});


app.get('/', (req, res) => {
    const showAll = req.query.showAll === '1' || req.query.showAll === 'true';

    let query = knex('assignment')
        .innerJoin('class', 'class.classcode', 'assignment.classcode')
        .select(
            'class.classcode',
            'class.classname',
            'class.teacher',
            'assignment.assignid',
            'assignment.assignmentname',
            'assignment.duedate',
            'assignment.assigntype',
            'assignment.done'
        );

    if (!showAll) {
        query = query.where('assignment.done', false);
    }

    query.orderBy('assignment.duedate', 'asc')
        .then(rows => {
            res.render('index', { schooldata: rows, showAll });
        })
        .catch(err => {
            console.error('Error fetching assignments:', err);
            res.status(500).send('Error fetching assignments');
        });
});


app.post('/complete', (req, res) => {
    // 1. Find the specific assignment first
    knex('assignment')
        .where('assignid', req.body.assignid)
        .first()
        .then(row => {
            // 2. Update it to the OPPOSITE of what it currently is (!row.done)
            return knex('assignment')
                .where('assignid', req.body.assignid)
                .update({ done: !row.done });
        })
        .then(() => {
            // 3. Reload the page
            res.redirect('/');
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error updating assignment');
        });
});


// Add a new assignment
app.post('/add-assignment', (req, res) => {
    const { classcode, assignmentname, assigntype, duedate } = req.body;

    // If "Other" is selected, store NULL for classcode to satisfy FK
    const classcodeToInsert = (classcode === 'Other') ? null : classcode;

    // Basic validation: required fields
    if (!assignmentname || !duedate) {
        return res.status(400).send('Assignment Name and Due Date are required');
    }

    knex('assignment')
        .insert({
            classcode: classcodeToInsert,
            assignmentname,
            duedate,       // Postgres can cast 'YYYY-MM-DD' to timestamp (midnight)
            assigntype
        })
        .then(() => {
            res.redirect('/');
        })
        .catch(err => {
            console.error('Error adding assignment:', err);
            res.status(500).send('Error adding assignment');
        });
});




















app.listen(port, () => {
    console.log("The server is listening");
});