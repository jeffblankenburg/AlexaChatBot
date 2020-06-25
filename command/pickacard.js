const airtable = require("../airtable");
const external = require("../external");
const helper = require("../helper.js");
const _ = require('lodash');

async function pickcard() {
    console.log(`<=== command/pickcard.js ===>`);
    const suit = ["hearts", "diamonds", "spades", "clubs"];
    const value = ["ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king"];
    return `You picked the ${helper.getRandomItem(value)} of ${helper.getRandomItem(suit)}`;
    //return "🂱";

}

module.exports = pickcard;