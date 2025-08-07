const express = require("express")
const router = new express.Router()
const invController = require("../controllers/inventoryController")
const formValidation = require("../utilities/inventory-validation")
const utilities = require("../utilities/")

//Router for inventory by classification
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/type/details/:vehicleId", invController.buildByVehicleId);
router.get("/", invController.buildManagement);
router.get("/new-classification", invController.buildNewClassification);
router.post("/new-classification", invController.createClassification);
// router.post("/new-classification", formValidation.classificationRules(), formValidation.checkClassificationData, utilities.handleErrors(invController.createClassification));
router.get("/add_inventory", invController.buildAddInventory)
router.post("/add_inventory", invController.createInventory)
// router.post("/add_inventory", formValidation.inventoryRules(), formValidation.checkInventoryData, utilities.handleErrors(invController.createInventory))

module.exports = router;