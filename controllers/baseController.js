// controllers/baseController.js
const utilities = require("../utilities/");
const baseController = {};

baseController.buildHome = async function (req, res){
  const nav = await utilities.getNav();
  res.render("index", { title: "Home", nav });
  req.flash("notice", "This is a flash message.")
}


baseController.errorView = async function (req, res){
  const nav = await utilities.getNav();
  res.status(500).render("../views/errors/error", { 
    title: "Server Error 500", 
    nav
  });
}

module.exports = baseController;