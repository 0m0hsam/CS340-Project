const inventoryModel = require("../models/inventoryModel");
const utilities = require("../utilities")
const invCont = {}

invCont.buildByClassificationId = async function(req, res, next) {
  try {
    const classificationId = req.params.classificationId;
    const data = await inventoryModel.getInventoryByClassificationId(classificationId);
    const grid = await utilities.buildByClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0]?.classification_name || "";
    res.render("./inventory/classification", {
      title: `${className} Vehicle`,
      nav,
      grid,
      error: null // No error
    });
  } catch (err) {
    let nav = await utilities.getNav();
    res.render("./inventory/classification", {
      title: "Error",
      nav,
      grid: "",
      error: err.message // Pass error message to view
    });
  }
};

invCont.buildByVehicleId = async function (req, res, next) {
  try {
    const vehicleId = req.params.vehicleId;
    const data = await inventoryModel.getInventoryByVehicleId(vehicleId);
    const grid = await utilities.buildByVehicleGrid(data);
    let nav = await utilities.getNav();
    const className = data[0]?.inv_make || "";
    res.render("./inventory/more_details", {
      title: `${className}`,
      nav,
      grid,
      error: null
    });
  } catch (err) {
    let nav = await utilities.getNav();
    res.render("./inventory/more_details", {
      title: "Error",
      nav,
      grid: "",
      error: err.message
    });
  }
};

//Build Iventory Management view
invCont.buildManagement = async function(req, res){
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    error: null
  })
}


//Build new classification view
invCont.buildNewClassification =async function(req,res){
  let nav = await utilities.getNav();
  res.render("./inventory/new-classification", {
    title: "New Classification",
    nav,
    errors: null
  })
} 


//Process New Classification
invCont.createClassification = async function(req, res, next) {
    try {
      let nav = await utilities.getNav();
      const classification_name = req.body.classification_name

      const regResult = await inventoryModel.createNewClassification(classification_name)

      console.log(regResult)
      if (regResult){
          req.flash(
              "notice",
              `You have successfully created a new ${classification_name} classification kindly update with new vehicle`
          )
          res.status(201).render("inventory/management", {
            title: "Created - Inventory Management",
            nav,
            errors: null
          } )
      }
    } catch (errors) {
      let nav = await utilities.getNav();
      res.status(500).render("inventory/new-classification", {
        title: "New Classification - Error",
        nav,
        errors: errors.message // Pass error as a string
      });
    }
}



//Process new inventory
invCont.buildAddInventory = async function(req, res){
  let nav = await utilities.getNav();
  let dropdown = await utilities.buildClassificationList()
  res.render("./inventory/add_inventory",{
    title: "Add New Inventory",
    nav,
    dropdown,
    errors: null
  });
}


//Create new inventory
invCont.createInventory = async function(req, res, next){

    try {
      let nav = await utilities.getNav();
      const {      
       inv_make,
       inv_model,
       inv_year,
       inv_description,
       inv_image,
       inv_thumbnail,
       inv_price,
       inv_miles,
       inv_color,
      classification_id} = req.body

      console.log(classification_id); // Output should show all fields with values
      console.log(inv_color); // Output should show all fields with values

      const regResult = await inventoryModel.createNewInventory(
       inv_make,
       inv_model,
       inv_year,
       inv_description,
       inv_image,
       inv_thumbnail,
       inv_price,
       inv_miles,
       inv_color,
       classification_id
      )
  
      if (regResult){
          req.flash(
              "notice",
              `You have successfully created a new inventory ${inv_make} ${inv_model} vehicle`
          )
          res.status(201).render("./inventory/management", {
            title: "Created - Inventory Management",
            nav,
            errors: null
          } )
      }
    } catch (errors) {
      let nav = await utilities.getNav();
      let dropdown = await utilities.buildClassificationList();
      res.status(500).render("./inventory/add_inventory", {
        title: "Add New Inventory",     
        nav,
        dropdown,
        errors: errors.message // Pass error as a string
      });
    }
}

module.exports = invCont;