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
// const knex = require("knex")({
//     client: "pg",
//     connection: {
//         host : process.env.DB_HOST || "localhost",
//         user : process.env.DB_USER || "postgres",
//         password : process.env.DB_PASSWORD || "admin",
//         database : process.env.DB_NAME || "",
//         port : process.env.DB_PORT || 5432  
//     }
// });


//Allows the server to access static files in the public folder such as the image I added
app.use(express.static('public'));


//Middleware that parses incoming form data and makes it available on req.body.
//extended: true allows parsing of complex data like nested objects.
app.use(express.urlencoded({extended: true}));