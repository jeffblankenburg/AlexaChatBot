const helper = require("../helper");
const fetch = require("node-fetch");
var keys = require("../keys.js");

async function getRandomSpeech(type) {
    console.log(`<=== airtable/getRandomSpeech.js ===>`);
    const url = `https://api.airtable.com/v0/${keys.airtable_base_data}/Speech?api_key=${keys.airtable_api_key}&filterByFormula=AND(IsDisabled%3DFALSE(),SpeechType%3D"${type.toUpperCase()}")`;
    //console.log(`FULL PATH ${url}`);
    const options = {
      method: "GET",
    };
  
    return fetch(url, options)
      .then((res) => res.json())
      .then((r) => {
        const item = helper.getRandomItem(r.records);
        return item.fields.VoiceResponse;
      });
  }
  
  module.exports = getRandomSpeech;
  