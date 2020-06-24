const helper = require("../helper");
const keys = require("../keys");
const fetch = require("node-fetch");

function getUserRecord(username) {
  console.log(`<=== airtable/getUserRecord.js ===>`);
  const url = `https://api.airtable.com/v0/${keys.airtable_base_twitch}/User?api_key=${keys.airtable_api_key}&filterByFormula=AND(Username%3D"${encodeURIComponent(username)}")`;
  //console.log(`FULL PATH ${url}`);
  const options = {method: "GET"};

  return fetch(url, options)
    .then((res) => res.json())
    .then((r) => r.records[0]);
}

module.exports = getUserRecord;
