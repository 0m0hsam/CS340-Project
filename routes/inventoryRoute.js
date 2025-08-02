const express = require("express")
const router = new express.Router()
const invController = require("../controllers/inventoryController")

//Router for inventory by classification
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/type/details/:vehicleId", invController.buildByVehicleId);


module.exports = router;