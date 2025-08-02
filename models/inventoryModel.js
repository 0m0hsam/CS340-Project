// Example using a database query

const database = require('../database/database.js');

//get all vehicles classification using pool query
exports.getClassifications = async () => {
  try {
    const result = await database.query("SELECT * FROM public.classification ORDER BY classification_name");
    return result.rows;
  } catch (error) {
    console.error("Error fetching vehicle classifications:", error);
    throw error;
  }
};


exports.getInventoryByClassificationId = async (classification_id) => {
  try {
    const data = await database.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    // console.log(data.rows);
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error" + error);
    return [];
  }
};


exports.getInventoryByVehicleId = async (vehicle_id) => {
  try {
    const data = await database.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id 
      WHERE i.inv_id = $1`,
      [vehicle_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error" + error);
    return [];
  }
};

