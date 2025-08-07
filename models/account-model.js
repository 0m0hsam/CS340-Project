const database = require('../database/index.js');


exports.registerAccount = async function(firstname, lastname, email, password) {
  try {
    const sql = `
      INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
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
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await database.query(sql, [account_email])
    return email.rowCount
  } catch (errors) {
    return errors.message
  }
}

