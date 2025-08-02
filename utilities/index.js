/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
const inventoryModel = require('../models/inventoryModel');
const Util = {};


 // Input commar in values
const putCommar = function(val) {
  let str = String(val);
  let subStr = ',';
  let pos = 2;
  let result
  // Using concat() to insert the substring
  if(str.length > 3){
    result = str.slice(0, pos).concat(subStr, str.slice(pos)); 
  }else{
    pos = 1;
    result = str.slice(0, pos).concat(subStr, str.slice(pos)); 
  }
  return result            
}
                   

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

Util.getNav = async function(req, res, next){
  let data = await inventoryModel.getClassifications();
  let list = "<ul class='nav-list'>";
  list += "<li class='nav-item'><a href='/' title='Home'>Home</a></li>";
  data.forEach(vehicle => {
    list += `<li class='nav-item'>
    <a href='/inv/type/${vehicle.classification_id}' 
    title='${vehicle.classification_name}'>
    ${vehicle.classification_name}
    </a></li>`;
  });
  list += "</ul>";
  return list;
}
 
// Build a grid of vehicles by classification
Util.buildByClassificationGrid = async function(data){
  let grid
  if (data.length > 0){
      grid = `<section id="vehicles"> <div id="vehicles_container">`
    data.forEach(vehicle => {
    grid += `<div id="vehicle_image">
            <a href="/inv/type/details/${vehicle.inv_id}"><img src="${vehicle.inv_thumbnail}">
            <hr />
            <h3 class="car_name">${vehicle.inv_make} ${vehicle.inv_model}</h3></a>
            <p class="price">$`
    grid += `${putCommar(vehicle.inv_price)}</p> </div>`
    })
    grid += `</div></section>`
  } else {
    grid += "<p class='notice'>Sorry, no vehicles were found.</p>";
  }
  return grid;
}

//Grid of a vehicle in classification inventory
Util.buildByVehicleGrid = async function name(data) {
  let grid
  if(data.length > 0){
    grid =`<section id="more_details">
    <div id="more_details_container">
        <div id="vehicle_image">`
      data.forEach(vehicle =>{
          grid += `<img src=${vehicle.inv_image} alt="${vehicle.inv_make} ${vehicle.inv_model}">  
        </div>
        <div id="details">
            <div id="vehicle_description">
                <h3 class="vehicle_name">${vehicle.inv_make} ${vehicle.inv_model} ${vehicle.inv_year} </h3>
                <h3>Description</h3>
                <p>${vehicle.inv_description}</p>
                <p class="price">Price $`
                 
            grid += `${putCommar(vehicle.inv_price)}</p>
            </div>
            <div id="vehicle_features">
                <h3>Features</h3>
                <ul>
                  <li>Color ${vehicle.inv_color}</li>`

            grid += `<li>Miles ${putCommar(vehicle.inv_miles)}</li>
                    <li>Classification Brand ${vehicle.classification_name}</li>
                </ul>
                </div>
            </div>
        </div>
    </section>`
         })
  } else {
    grid += "<p class='notice'>Sorry, no vehicles were found.</p>";
  }
  return grid;
}



module.exports = Util;

