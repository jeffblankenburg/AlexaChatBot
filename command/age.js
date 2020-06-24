const external = require("../external");
const _ = require('lodash');

async function age(message) {
    console.log(`<=== command/age.js ===>`);
    let username = message.toLowerCase().replace("!age", "").replace(/@/g, "").trim();
    if (_.isNil(username) || _.isEmpty(username) || _.isUndefined(username)) username = 'amazonalexa';
    const twitchAge = await external.getTwitchAge(username);
    let ageText = `@${username} has been on Twitch for ${twitchAge}.`
    if (username === "amazonalexa") ageText = `I have been on Twitch for ${twitchAge}.`;
    if (twitchAge === "404 Page Not Found") ageText = `I couldn't find ${message} on Twitch.`;
    return ageText;
}

module.exports = age;