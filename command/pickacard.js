const helper = require("../helper.js");

async function pickacard() {
    console.log(`<=== command/pickacard.js ===>`);
    const suit = ["hearts", "diamonds", "spades", "clubs"];
    const value = ["ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king"];
    return `You picked the ${helper.getRandomItem(value)} of ${helper.getRandomItem(suit)}`;
    //return "🂱";

}

module.exports = pickacard;