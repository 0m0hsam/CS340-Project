const express = require("express")
const route = express.Router()
const utilities = require("../utilities/")
const acctController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')


route.get('/login', utilities.handleErrors(acctController.buildLogin));
route.get('/registration', utilities.handleErrors(acctController.buildRegistration));
// Process the registration data
route.post(
  "/registration",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(acctController.registerAccount)
)

// Process the login attempt
route.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)

module.exports = route;
