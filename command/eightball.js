const airtable = require("../airtable");
const external = require("../external");
const _ = require('lodash');

async function eightball(message, context) {
    console.log(`<=== command/eightball.js ===>`);
    const eightballText = await airtable.getRandomSpeech("8BALL");
    return eightballText;

}

module.exports = eightball;