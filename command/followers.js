const external = require("../external");
const _ = require('lodash');

async function followers(message) {
    console.log(`<=== command/followers.js ===>`);
    let username = message.toLowerCase().replace("!followers", "").replace(/@/g, "").trim();
    if (_.isNil(username) || _.isEmpty(username) || _.isUndefined(username)) username = 'amazonalexa';
    const followerCount = await external.getTwitchFollowers(username);
    let followerText = `@${username} currently has ${followerCount} followers on Twitch.`
    if (username === "amazonalexa") followerText = `I currently have ${followerCount} followers on Twitch.`;
    if (followerCount === "404 Page Not Found") followerText = `I couldn't find ${message} on Twitch.`;
    return followerText;
}

module.exports = followers;