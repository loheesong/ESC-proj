const db = require('./db')

const table_name = "destinations"

async function findOne() { 
    sql = `select * from ${table_name} limit 1`

    try {
        const [rows, fieldDefs] = await db.cnx.query(sql)
        return rows 
    } catch (error) {
        console.log("Failed to findOne");
    }
}

/**
 * Partial string match for given substring, return num_res number of results 
 * @param {string} substring 
 * @param {number} num_res 
 * @returns Array of cities (string)
 */
async function fuzzy_city(substring, num_res) {
    // return nothing when there is no query 
    if (substring === "") {
        return []
    }

    // restrict to only finding cities 
    sql = `select term, uid from ${table_name} where type='city' and term like '%${substring}%' limit ${num_res}`

    try {
        const [rows, fieldDefs] = await db.cnx.query(sql)
        return rows
    } catch (error) {
        console.log("Failed to fuzzy find city");
    }
}
module.exports = {findOne, fuzzy_city}