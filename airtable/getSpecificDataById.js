const helper = require("../helper");
const fetch = require("node-fetch");
var keys = require("../keys.js");

async function getSpecificDataById(table, name) {
    console.log(`<=== airtable/getSpecificDataById.js ===>`);
    const url = `https://api.airtable.com/v0/${keys.airtable_base_data}/${table}?api_key=${keys.airtable_api_key}&filterByFormula=AND(IsDisabled%3DFALSE(),Name%3D"${encodeURIComponent(name)}")`;
    //console.log(`FULL PATH ${url}`);
    const options = {
      method: "GET",
    };
  
    return fetch(url, options)
      .then((res) => res.json())
      .then((r) => {
        const item = helper.getRandomItem(r.records);
        return item;
      });
  }
  
  module.exports = getSpecificDataById;