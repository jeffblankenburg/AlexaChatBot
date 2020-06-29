const helper = require("../helper.js");
const _ = require('lodash');

async function dice(message, context) {
    console.log(`<=== command/dice.js ===>`);
    let sides = message.replace("!dice", "");
    let description = "";
    if (_.isNil(sides) || _.isEmpty(sides) || _.isNaN(sides)) {
        sides = 20;
    }
    if (sides != 20) description = `(${sides})`;
    const diceRoll = rollDice(sides);
    return `@${context.username} rolled ${diceRoll} ${description}`;
}

function rollDice(sides) {
    return Math.floor(Math.random() * sides) + 1;
}

module.exports = dice;