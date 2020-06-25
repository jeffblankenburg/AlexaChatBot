var Airtable = require('airtable');
var keys = require("../keys.js");
const fetch = require("node-fetch");

async function updateUserScore(context, message, target) {
    console.log(`<=== airtable/updateUserScore.js ===>`);
    //DETERMINE IF USER IS ALREADY IN DATABASE.
    const url = `https://api.airtable.com/v0/${keys.airtable_base_twitch}/User?api_key=${keys.airtable_api_key}&filterByFormula=AND(Username%3D"${context.username.toLowerCase()}")`;
    //console.log(`FULL PATH ${url}`);
        //IF NO, INSERT THEM AND GET RECORDID
        //IF YES, GET RECORDID

    const options = {method: "GET"};

    //if (context.subscriber)
        
    return fetch(url, options)
    .then((res) => res.json())
    .then((r) => {
        if (r.records.length === 0) createUserRecord(context.username.toLowerCase());
        else updateScore(r.records[0]);
    });
}

function createUserRecord(username) {
    console.log(`CREATING NEW USER RECORD FOR ${username}`);
    var airtable = new Airtable({ apiKey: keys.airtable_api_key }).base(keys.airtable_base_twitch);
    return new Promise((resolve, reject) => {
      airtable("User").create({ Username: username, Currency: 1 }, function (err, record) {
        if (err) {
          console.error(err);
          return;
        }
        resolve(record);
      });
    });
  }

function updateScore(user) {
    var airtable = new Airtable({ apiKey: keys.airtable_api_key }).base(keys.airtable_base_twitch);
    return new Promise((resolve, reject) => {
        airtable('User').update(user.fields.RecordId, {
            "Currency": user.fields.Currency+1
          }, function(err, record) {
            if (err) {
              console.error(err);
              return;
            }
            //console.log("SCORE UPDATED");
          });
    });
}

module.exports = updateUserScore;