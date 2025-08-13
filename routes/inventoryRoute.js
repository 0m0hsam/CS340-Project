const express = require("express")
const router = new express.Router()
const invController = require("../controllers/inventoryController")
const formValidation = require("../utilities/inventory-validation")
const utilities = require("../utilities/")

//Router for inventory by classification
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/type/details/:vehicleId", invController.buildByVehicleId);
router.get("/",
    utilities.checkLogin, 
    utilities.checkAdmin,
    utilities.checkJWTToken, 
    utilities.handleErrors(invController.buildManagement));
    
router.get("/new-classification", invController.buildNewClassification);
//router.post("/new-classification", invController.createClassification);
router.post("/new-classification", formValidation.classificationRules(), formValidation.checkClassificationData, utilities.handleErrors(invController.createClassification));
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
router.get("/add_inventory", invController.buildAddInventory)
//router.post("/add_inventory", invController.createInventory)
router.post("/add_inventory", formValidation.inventoryRules(), formValidation.checkInventoryData, utilities.handleErrors(invController.createInventory))
router.get("/edit/:inventoryId", utilities.handleErrors(invController.buildUpdateInventory));
router.post("/update/", utilities.handleErrors(invController.updateInventory))

module.exports = router;