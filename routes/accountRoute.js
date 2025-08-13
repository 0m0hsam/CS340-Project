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
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(acctController.accountLogin)
)

route.get("/",utilities.checkLogin, utilities.handleErrors(acctController.buildAccountLoggedin))

//edit account
route.get("/edit",utilities.checkLogin, utilities.handleErrors(acctController.buildEditAccount));
route.post("/edit", 
  regValidate.editRules(),
  regValidate.checkEditData,
  utilities.handleErrors(acctController.updateUserInfo))

  //password update
route.post("/edit_password", 
  regValidate.editPasswordRules(),
  regValidate.checkEditPassword,
  utilities.handleErrors(acctController.updatePassword))

  //logout
  route.get("/logout", utilities.handleErrors(acctController.logout))

module.exports = route;
