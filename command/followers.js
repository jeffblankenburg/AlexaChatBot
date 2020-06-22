const external = require("../external");
const _ = require('lodash');

async function followers(message) {
    let username = message.toLowerCase().replace("!followers", "").trim();
    if (_.isNil(username) || _.isEmpty(username) || _.isUndefined(username)) username = 'amazonalexa';
    const followerCount = await external.getTwitchFollowers(username);
    let followerText = `@${username} currently has ${followerCount} followers on Twitch.`
    if (username === "amazonalexa") followerText = `I currently have ${followerCount} followers on Twitch.`;
    return followerText;
}

module.exports = followers;