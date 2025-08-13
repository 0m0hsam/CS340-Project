// Example using a pool query

const pool = require('../database/index.js');

//get all vehicles classification using pool query
exports.getClassifications = async () => {
  try {
    const result = await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
    return result.rows;
  } catch (error) {
    console.error("Error fetching vehicle classifications:", error);
    throw error;
  }
};


exports.getInventoryByClassificationId = async (classification_id) => {
  try {
    const data = await pool.query(
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
    const data = await pool.query(
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


//Creating new classification
exports.createNewClassification = async function(classification_name) {
  try {
    const sql = `
      INSERT INTO classification (classification_name)
      VALUES ($1)
      RETURNING classification_id
    `;
    const result = await pool.query(sql, [classification_name]);
    console.log(result)
    return result.rows[0]; // or true/false depending on your logic
  } catch (err) {
    throw err;
  }
};


// exports.registerAccount = async function(firstname, lastname, email, password) {
//   try {
//     const sql = `
//       INSERT INTO account (account_firstname, 
//       account_lastname, account_email, account_password)
//       VALUES ($1, $2, $3, $4)
//       RETURNING account_id
//     `;
//     const result = await database.query(sql, [firstname, lastname, email, password]);
//     return result.rows[0]; // or true/false depending on your logic
//   } catch (err) {
//     throw err;
//   }
// };


exports.createNewInventory = async function(
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
){

  try {
    const sql = `
      INSERT INTO inventory (
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
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING inv_id
    `;
    const result = await pool.query(sql, [       
       inv_make,
       inv_model,
       inv_year,
       inv_description,
       inv_image,
       inv_thumbnail,
       inv_price,
       inv_miles,
       inv_color,
      classification_id]);
    console.log(result)
    return result.rows[0]; // or true/false depending on your logic
  } catch (err) {
    throw err;
  }
};


/* ***************************
 *  Update Inventory Data
 * ************************** */
 exports.updateInventory= async function(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}



/* **********************
 *   Check for existing value
 * ********************* */
exports.checkExistingValue = async function (classification_name){
  try {
    const sql = "SELECT * FROM classification WHERE classification_name  = $1"
    const result = await pool.query(sql, [classification_name])
    return result.rows[0]
  } catch (errors) {
    return errors.message
  }
}




exports.checkExistingMaker = async function (inv_make){
  try {
    const sql = "SELECT * FROM inventory WHERE inv_make  = $1"
    const result = await pool.query(sql, [inv_make])
    return result.rows[0]
  } catch (errors) {
    return errors.message
  }
}