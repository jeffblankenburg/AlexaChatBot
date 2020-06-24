const airtable = require("../airtable");
const helper = require("../helper.js");

async function GoodbyeIntent(data, context) {
    console.log(`<=== handler/GoodbyeIntent.js ===>`);
    const goodbye = await airtable.getRandomSpeech("GOODBYE");
    return `@${context.username} ${goodbye}`;
}

module.exports = GoodbyeIntent;