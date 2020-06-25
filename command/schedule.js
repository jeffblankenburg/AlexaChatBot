const airtable = require("../airtable");
const external = require("../external");
const _ = require('lodash');

async function schedule(message, context) {
    console.log(`<=== command/schedule.js ===>`);
    return "This is where we will tell you the schedule for this channel."

}

module.exports = schedule;