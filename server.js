/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements

 *************************/
const expressLayouts = require("express-ejs-layouts")
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const utilities = require("./utilities/")
const baseController = require("./controllers/baseController")
const database = require("./database/index.js")
const invRouter = require("./routes/inventoryRoute")
const invController = require("./controllers/inventoryController")
const session = require ("express-session")
const pool = require('./database/index.js')



/* ***********************
 * Middleware
 *************************/   
app.set("view engine","ejs")
app.use(expressLayouts)
app.set("layout","./layouts/layout")

app.use(session({
  store: new(require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))




// Inject nav into all views
// app.use(async (req, res, next) => {
//   try {
//     const nav = await utilities.getNav();
//     res.locals.nav = nav;
//     next();
//   } catch (err) {
//     res.locals.nav = "";
//     next();
//   }
// });



/* ***********************
 * Routes
 *************************/
app.use(static)
//Index route
// app.get("/", function(req, res){
//   res.render("index", {title: "Home"})
// })

app.get("/", utilities.handleErrors(baseController.buildHome))

// inventory routes
app.use("/inv", invRouter)
app.get("/inv/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
//app.get("inv/type/details/:vehicleId", utilities.handleErrors(invController.buildByVehicleId));


// Error Route
// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})



/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
//  *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server and database operation
 *************************/
database.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Test query failed:", err);
  } else {
    app.listen(port, () => {
      console.log(`Database Connected and app listening on ${host}:${port}`)
    })
  }
});


