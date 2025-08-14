const database = require('../database/index.js');


exports.registerAccount = async function(firstname, lastname, email, password) {
  try {
    const sql = `
      INSERT INTO account (account_firstname, account_lastname, 
      account_email, account_password)
      VALUES ($1, $2, $3, $4)
      RETURNING account_id
    `;
    const result = await database.query(sql, [firstname, lastname, email, password]);
    return result.rows[0]; // or true/false depending on your logic
  } catch (err) {
    throw err;
  }
};


/* **********************
 *   Check for existing email
 * ********************* */
exports.checkExistingEmail = async function (account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1 "
    const email = await database.query(sql, [account_email])
    return email.rowCount
  } catch (errors) {
    return errors.message
  }
}


/* *****************************
* Return account data using email address
* ***************************** */
exports.getAccountByEmail= async function (account_email) {
  try {
    const result = await database.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}


/* ***************************
 *  Update User Data
 * ************************** */
exports.updateUserData = async function(account_firstname,account_lastname,account_email,account_id,account_type){
  try {
    const sql =
      "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3, account_type = $4  WHERE account_id = $5 RETURNING *"
    const data = await database.query(sql, [
    account_firstname,
    account_lastname,
    account_email,
    account_type,
    account_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}



/* ***************************
 *  Update User Password
 * ************************** */
exports.updateUserPassword= async function(account_password,account_id) {
  try {
    const sql =
      "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *"
    const data = await database.query(sql, [
    account_password,
    account_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}



 
