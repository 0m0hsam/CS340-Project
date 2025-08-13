const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
require("dotenv").config()
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


//Process login request
acctController.accountLogin = async function(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (account_password == accountData.account_password) {
      console.log(accountData.account_type)
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", " Error 2 Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}


//Build Account Loggedin view
acctController.buildAccountLoggedin =async function(req, res){
        let userData = await accountModel.getAccountByEmail(res.locals.accountData.account_email)
        let nav = await utilities.getNav()
        res.render("./account/account_loggedin", {
        title:"",
        nav,
        errors: null,
        account_id: userData.account_id
    })
}


//process logout
acctController.logout = async function(req, res){ 
    const accountData = await accountModel.getAccountByEmail(res.locals.accountData.account_email)
    delete accountData
    req.flash("notice", "You have successfully logged out.")
    res.clearCookie("jwt")
    res.redirect("/account/login")
}



//Build edit account view
acctController.buildEditAccount = async function(req, res){
    let userData = await accountModel.getAccountByEmail(res.locals.accountData.account_email)
    let nav = await utilities.getNav()
    res.render("account/edit", {
        title: "Edit Account",
        nav,
        errors: null,
        account_firstname: userData.account_firstname,
        account_lastname: userData.account_lastname,
        account_email: userData.account_email,
        account_id: userData.account_id
    })
}


/* ***************************
 *  Update User Data
 * ************************** */
acctController.updateUserInfo = async function (req, res, next) {
  let nav = await utilities.getNav() 
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id,
    account_type,
  } = req.body
  let updatedAccountType = account_type;
  let updateCode ="" ;
  if (req.body.upgrade_code === "1010" ) {
    updatedAccountType = req.body.account_type;
    updateCode = req.body.upgrade_code;
  }
  const updateResult = await accountModel.updateUserData(
    account_firstname,
    account_lastname,
    account_email,
    account_id,
    updatedAccountType
  )

  if (updateResult && updateCode === "1010" ) {
    req.flash("notice", `${updateResult.account_firstname} your account information was updated and upgraded successfully! Please login to see changes`)
    res.redirect("/account/login")
  } else if (updateResult) {
    req.flash("notice", `${updateResult.account_firstname} your account information was updated successfully!`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/edit", {
    title: "Edit Error",
    nav,
    errors: null,
    account_firstname,
    account_lastname,
    account_email,
    account_id

    })
  }
}


/* ***************************
 *  Update User Password
 * ************************** */
acctController.updatePassword = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
    account_id
  } = req.body
  const updateResult = await accountModel.updateUserPassword(
    account_password,
    account_id
  )

  if (updateResult) {
    req.flash("notice", `${updateResult.account_firstname} your password update was successful!`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the password update failed.")
    res.status(501).render("account/edit", {
    title: "Edit Error",
    nav,
    errors: null,
    account_firstname,
    account_lastname,
    account_email,
    account_id
    })
  }
}



module.exports = acctController;