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
  let classification_id = req.params.classification_id
  let classificationList= await utilities.buildClassificationList(classification_id)
      res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      error: null,
      classificationList,
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
      const classificationList = await utilities.buildClassificationList()
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
            errors: null,
            classificationList
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
          let classificationList = await utilities.buildClassificationList()
          req.flash(
              "notice",
              `You have successfully created a new inventory ${inv_make} ${inv_model} vehicle`
          )
          res.status(201).render("./inventory/management", {
            title: "Created - Inventory Management",
            nav,
            errors: null,
            classificationList
          } )
      }
    } catch (errors) {
      let nav = await utilities.getNav();
      let dropdown = await utilities.buildClassificationList()
      res.status(500).render("./inventory/add_inventory", {
        title: "Add New Inventory",     
        nav,
        dropdown,
        errors: null
      });
    }
}



//Build update inventory view
invCont.buildUpdateInventory = async function(req, res){
  let nav = await utilities.getNav();
  let dropdown = await utilities.buildClassificationList()
  res.render("./inventory/update_inventory",{
    title: "Update Inventory",
    nav,
    dropdown,
    errors: null
  });
}



/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let dropdown = await utilities.buildClassificationList()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await inventoryModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/update_inventory", {
    title: "Edit " + itemName,
    nav,
    dropdown,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
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
    })
  }
}



/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await inventoryModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await inventoryModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

module.exports = invCont;