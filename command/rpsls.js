const helper = require("../helper.js");

async function rpsls(context) {
    console.log(`<=== command/rpsls.js ===>`);
    const play = ["ROCK", "PAPER", "SCISSORS", "LIZARD", "SPOCK"];
    return `@${context.username} played ${helper.getRandomItem(play)}`;
}

module.exports = rpsls;