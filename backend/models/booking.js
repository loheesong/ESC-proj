const db = require("./db");

const table_name = "bookings";
// TODO: change this once integrate users
const json_type_format = {
  hotel_name: "string",
  room_name: "string",
  location: "string",
  price: "string",
  checkin_date: "string",
  checkout_date: "string",
  book_date: "string",
  room_img_src: "string", 
  message: "string",
  userID: "number",
  name: "string",
  cardNumber: "string",
  expiryDate: "string",
  cvv: "string",
};

/** define db schema here, creates table if it doesnt exist
 * TODO: will need to change once integrate users
 */
async function sync() {
  let sql = `create table if not exists ${table_name} (
        booking_id int not null AUTO_INCREMENT, 
        hotel_name varchar(255) not null,  
        room_name varchar(255) not null,
        location varchar(255) not null,  
        price varchar(255) not null,  
        checkin_date varchar(255) not null,  
        checkout_date varchar(255) not null,
        book_date varchar(255) not null,
        room_img_src varchar(255) not null,
        message varchar(255) not null,  
        userID int not null,
        name varchar(255) not null,
        cardNumber varchar(255) not null,
        expiryDate varchar(255) not null,
        cvv varchar(255) not null,
        primary key (booking_id)
    )`;
  try {
    db.cnx.query(sql);
  } catch (error) {
    console.error("database connection failed. " + error);
    throw error;
  }
}

/**
 * Validate details_json, then create row in bookings table
 * @param {JSON} details_json
 * @returns
 */
async function create_booking(details_json) {
  if (!validate_input(details_json)) {
    console.error("Invalid input:", details_json);
    return false;
  }

  console.log("Validated input:", details_json);
  let sql = `INSERT INTO ${table_name} (hotel_name, room_name, location, price, checkin_date, checkout_date, book_date, room_img_src, message, userID, name, cardNumber, expiryDate, cvv)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  try {
    await db.cnx.query(sql, Object.values(details_json));
    console.log("Successfully created booking");
    return true;
  } catch (error) {
    console.error("Failed to create booking:", error);
    return false;
  }
}


/**
 * TODO will need to change this once integrate user
 * @param {*} user_id
 * @returns
 */
async function get_bookings_by_userid(user_id) {
  let sql = `select * from ${table_name} where userid=${user_id.user}`;
  console.log(sql);
  try {
    const [rows, fieldDefs] = await db.cnx.query(sql);
    return rows;
  } catch (error) {
    console.log("Failed to get_bookings_by_userid");
    return false;
  }
}

/** Delete 1 booking by booking_id
 * @param {number} booking_id
 */
async function delete_by_bookingid(booking_id) {
  let sql = `DELETE FROM ${table_name} WHERE booking_id = ?`;

  try {
      const [rows, fieldDefs] = await db.cnx.query(sql, [booking_id]);
      if (rows.affectedRows === 0) {
        console.log("bookingid not found");
        return false;
      }
      console.log("Successfully deleted booking");
      return true;
    } catch (error) {
      console.log("Failed to delete booking:", error);
      return false; // Adding this line to handle the catch case as well.
  }
}


// helper method for inserting rows
function validate_input(json) {
  console.log("Validating...");
  for (const key in json_type_format) {
    if (!json.hasOwnProperty(key)) {
      console.error(`Missing key: ${key}`);
      return false;
    }
    
    const expectedType = json_type_format[key];
    const actualType = typeof json[key];
    
    if (expectedType !== actualType) {
      console.error(`Type mismatch for key: ${key}. Expected ${expectedType}, got ${actualType}`);
      return false;
    }
  }
  return true;
}

module.exports = {
  sync,
  validate_input,
  create_booking,
  get_bookings_by_userid,
  delete_by_bookingid,
};
