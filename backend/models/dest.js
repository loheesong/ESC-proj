const db = require('./db')
const FuzzySet = require('fuzzyset')

const fuzzy = FuzzySet()
const table_name = "destinations"

// Load all term into FuzzySet for fuzzy find 
async function load_fuzzy(fuzzy) {
    let sql = `select term from ${table_name}`

    try {
        const [rows, fieldDefs] = await db.cnx.query(sql)
        for (const row of rows) {
            fuzzy.add(row.term)
        }
    } catch (error) {
        console.log("Failed to findOne");
    }
}
load_fuzzy(fuzzy)

/**
 * Partial string match for given substring, return num_res number of results 
 * @param {string} substring 
 * @param {number} num_res defaults to 5 if left empty 
 * @returns Array of cities (string)
 */
async function partial_city(substring, num_res = 5) {
    // return nothing when there is no query 
    if (substring === "") return []

    // restrict to only finding cities 
    let sql = `select term, uid from ${table_name} where type='city' and term like '%${substring}%' limit ${num_res}`

    try {
        const [rows, fieldDefs] = await db.cnx.query(sql)
        return rows
    } catch (error) {
        console.log("Failed to partial find city");
    }
}

/**
 * Fuzzy searching with Fuzzyset
 * @param {string} substring 
 * @param {number} num_res 
 */
async function fuzzy_city(substring, num_res) {
    // return nothing when there is no query 
    if (substring === "") { return [] }

    let res = fuzzy.get(substring)
    if (res === null) { return [] }

    let out = [] 
    
    try {
        for (let i=0; i<Math.min(5,res.length); i++) {
            substring = res[i][1]
            let sql = `select term, uid from ${table_name} where term='${substring}' limit 1`
            let [row, fieldDefs] = await db.cnx.query(sql)
            out.push(row[0])
        }
        return out
    } catch (error) {
        console.log(error);
        console.log("Failed to fuzzy find city");
    }
}

module.exports = {fuzzy_city, partial_city}