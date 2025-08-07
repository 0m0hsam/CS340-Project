// const inventoryModel = require("../models/inventoryModel");
const utilities = require("../utilities")
const accountModel = require('../models/account-model')
const acctController = {}

acctController.buildLogin = async function(req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null // No error
    })
  } catch (err) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login - Error",
      nav,
      errors: err.message // Pass error message to view
    })
  }
}

//Build Regitration Form
acctController.buildRegistration = async function(req,res,next){
    let nav = await utilities.getNav()
    res.render("account/registration", {
        title:"Registration",
        nav,
        errors: null
    })
}


//Process Registration
acctController.registerAccount= async function(req, res, next) {
    try {
      let nav = await utilities.getNav();
      const {account_firstname, account_lastname, account_email, account_password} = req.body

      const regResult = await accountModel.registerAccount(
          account_firstname, 
          account_lastname, 
          account_email, 
          account_password
      )

      if (regResult){
          req.flash(
              "notice",
              `Congratulation, you\`re registered successfully ${account_firstname}. Please log in`
          )
          res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null
          } )
      }
    } catch (errors) {
      let nav = await utilities.getNav();
      res.status(500).render("account/registration", {
        title: "Registration - Error",
        nav,
        errors: errors.message // Pass error as a string
      });
    }
}


// acctController.validatePassword = function(password){
//   const minLength = 8;
//   const hasUppercase = /[A-Z]/.test(password);
//   const hasLowercase = /[a-z]/.test(password);
//   const hasNumber = /[0-9]/.test(password);
//   const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

//   if (password.length < minLength) {
//     return "Password must be at least " + minLength + " characters long.";
//   }
//   if (!hasUppercase) {
//     return "Password must contain at least one uppercase letter.";
//   }
//   if (!hasLowercase) {
//     return "Password must contain at least one lowercase letter.";
//   }
//   if (!hasNumber) {
//     return "Password must contain at least one number.";
//   }
//   if (!hasSpecialChar) {
//     return "Password must contain at least one special character.";
//   }
//   return ""; // Empty string indicates valid password
// }

module.exports = acctController;