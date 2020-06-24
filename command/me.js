const airtable = require("../airtable");
const external = require("../external");
const _ = require('lodash');

async function me(message, context) {
    console.log(`<=== command/me.js ===>`);
    //console.log(`CONTEXT ${context}`);
    //console.log(`MESSAGE ${message}`);
    const user = await airtable.getUserRecord(context.username.toLowerCase());
    console.log(`USER ${JSON.stringify(user)}`);
    return `@${context.username} ALEXA COINS:${user.fields.Currency}`;
}

module.exports = me;