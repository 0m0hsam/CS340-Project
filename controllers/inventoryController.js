const inventoryModel = require("../models/inventoryModel");
const utilities = require("../utilities")
const invCont = {}

invCont.buildByClassificationId = async function(req, res, next) {
  const classificationId = req.params.classificationId;
  const data = await inventoryModel.getInventoryByClassificationId(classificationId);
  const grid = await utilities.buildByClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0]?.classification_name || "";
  res.render("./inventory/classification", {
    title: `${className} Vehicle`,
    nav,
    grid,
  });
};


invCont.buildByVehicleId = async function (req, res) {
  const vehicleId = req.params.vehicleId;
  const data = await inventoryModel.getInventoryByVehicleId(vehicleId);
  const grid = await utilities.buildByVehicleGrid(data);
  let nav= await utilities.getNav();
  const className = data[0]?.inv_make || "";
  res.render("./inventory/more_details", {
    title: `${className}`,
    nav,
    grid,
  })

}




module.exports = invCont;