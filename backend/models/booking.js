const db = require('./db')

const table_name = "bookings"
// TODO: change this once integrate users 
const json_type_format = {
    hotel_id: "string",  
    room_name: "string",  
    price: "number",  
    checkin_date: Date,  
    checkout_date: Date,  
    message: "string",  
    user: "string"
}

/** define db schema here, creates table if it doesnt exist 
 * TODO: will need to change once integrate users 
*/ 
async function sync() {
    let sql = `create table if not exists ${table_name} (
        booking_id int not null AUTO_INCREMENT, 
        hotel_id varchar(255) not null,  
        room_name varchar(255) not null ,  
        price float(20) not null,  
        checkin_date date not null,  
        checkout_date date not null,  
        message varchar(255) not null,  
        user varchar(255) not null,
        primary key (booking_id)
    )`
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
    if (!validate_input(details_json)) {return}

    let sql = `insert into ${table_name} values (DEFAULT, ?, ?, ?, ?, ?, ?, ?)`

    try {
        const [rows, fieldDefs] = await db.cnx.query(sql,Object.values(details_json))
    } catch (error) {
        console.log("Failed to create booking");
    }
}

/**
 * TODO will need to change this once integrate user  
 * @param {*} user_id 
 * @returns 
 */
async function get_bookings_by_userid(user_id) {
    let sql = `select * from ${table_name} where user='${user_id}'`

    try {
        const [rows, fieldDefs] = await db.cnx.query(sql)
        return rows 
    } catch (error) {
        console.log("Failed to get_bookings_by_userid");
    }
}

/** Delete 1 booking by booking_id 
 * @param {number} booking_id 
 */
async function delete_by_bookingid(booking_id) {
    let sql = `delete from ${table_name} where booking_id='${booking_id}'`

    try {
        const [rows, fieldDefs] = await db.cnx.query(sql)
    } catch (error) {
        console.log("Failed to delete_by_bookingid");
    }
}

// helper method for inserting rows 
function validate_input(json) {
    for (const key in json_type_format) {
        // check valid keys 
        if (!json.hasOwnProperty(key)) { return false }

        // check valid values 
        try {
            // check value using typeof, then if false, try again using instanceof. If error, go catch 
            current_value_condition = (cond = (typeof json[key] === json_type_format[key])) ? cond : json[key] instanceof json_type_format[key]
        } catch (error) {
            current_value_condition = false
        }
        if (!current_value_condition) {return false}
    }
    return true
}

module.exports = {sync, create_booking, get_bookings_by_userid, delete_by_bookingid}