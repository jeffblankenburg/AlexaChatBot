var Airtable = require('airtable');
var keys = require("../keys.js");

function updateScore(user, currency) {
    var airtable = new Airtable({ apiKey: keys.airtable_api_key }).base(keys.airtable_base_twitch);
    return new Promise((resolve, reject) => {
        airtable('User').update(user.fields.RecordId, {
            "Currency": currency
          }, function(err, record) {
            if (err) {
              console.error(err);
              return;
            }
            resolve(record);
          });
    });
}

module.exports = updateScore;