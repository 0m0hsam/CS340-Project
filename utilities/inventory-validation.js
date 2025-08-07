const utilities = require("../utilities/")
const inventoryModel = require("../models/inventoryModel")
const { body, validationResult } = require("express-validator")
const validateInv = {}


  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validateInv.checkClassificationData = async (req, res, next) => {
  const {classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/new-classification", {
      errors,
      title: "Error - New Classification",
      nav,
      classification_name
    })
    return
  }
  next()
}


 validateInv.classificationRules = () => {
    return [
      // valid classification is required and cannot already exist in the database
      body("classification_name")
        .trim()
        .notEmpty()
        .isAlpha()
        .withMessage("Ahlapabet Character is only required.")
        .custom(async (classification_name) => {
          const nameExists = await inventoryModel.checkExistingValue(classification_name)
          if (nameExists){
            throw new Error(`Classification ${classification_name} exists. Please input one that has never existed`)
          }
        })
    ]
  }



  
//   /* ******************************
//  * Check inventory data and return errors or continue to registration
//  * ***************************** */
// validateInv.checkInventoryData = async (req, res, next) => {
//   const {
//        inv_make,
//        inv_model,
//        inv_year,
//        inv_description,
//        inv_image,
//        inv_thumbnail,
//        inv_price,
//        inv_miles,
//        inv_color,
//        classification_id} = req.body
//        console.log(req.body)
//   let errors = []
//   errors = validationResult(req)
//   if (!errors.isEmpty()) {
//     let nav = await utilities.getNav()
//     let dropdown = await utilities.buildClassificationList();
//     res.render("inventory/add_inventory", {
//       errors,
//       title: "Error - New Add Inventory",
//       nav,
//       dropdown,
//        inv_make,
//        inv_model,
//        inv_year,
//        inv_description,
//        inv_image,
//        inv_thumbnail,
//        inv_price,
//        inv_miles,
//        inv_color,
//        classification_id
//     })
//     return
//   }
//   next()
// }


//  validateInv.inventoryRules = () => {
//     return [
//             // inv_make is required and must be string
//             body("inv_make")
//               .trim()
//               .escape()
//               .notEmpty()
//               .withMessage("Ahlapabet Character is only required.")
//               .custom(async (inv_make) => {
//               const nameExists = await inventoryModel.checkExistingMaker(inv_make)
//                 if (nameExists){
//                   throw new Error(`Inventory exists. Please input one that has never existed`)
//                 }
//               }),

//             // inventory model is required and must be string
//             body("inv_model")
//               .trim()
//               .escape()
//               .notEmpty()
//               .isLength({ min: 2 })
//               .withMessage("Please provide a inventory model."), // on error this message is sent.
              
//                 // valid description is required and cannot already exist in the database
//             body("inv_description")
//               .notEmpty()
//               .isAlpha()
//               .withMessage("Please provide a inventory description."), 

                          
//             // // valid classification  is required
//             // body("classification_id")
//             //   .notEmpty()
//             //   .withMessage("Please provide a inventory classification."),
            
//               // valid image is required
//             body("inv_image")
//               .notEmpty()
//               .withMessage("Please provide a inventory Image."),

//               // valid image is required
//             body("inv_thumbnail")
//               .notEmpty()
//               .withMessage("Please provide a inventory thumbnai."),
            
//               // valid price is required
//             body("inv_price")
//               .notEmpty()
//               .isInt()
//               .withMessage("Please provide a inventory price."),

//               // valid year is required
//             body("inv_year")
//               .notEmpty()
//               .isDate()
//               .withMessage("Please provide a inventory year."),

//               // valid miles is required
//             body("inv_miles")
//               .notEmpty()
//               .isInt()
//               .withMessage("Please provide a inventory miles."),

//               // valid car color is required
//             body("inv_color")
//               .notEmpty()
//               .withMessage("Please provide a inventory color."),
//         ]
//   }

  module.exports = validateInv;