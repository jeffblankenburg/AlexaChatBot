const helper = require("../helper.js");

async function rps(context) {
    console.log(`<=== command/rps.js ===>`);
    const play = ["ROCK", "PAPER", "SCISSORS"];
    return `@${context.username} played ${helper.getRandomItem(play)}`;
}

module.exports = rps;