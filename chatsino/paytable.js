const airtable = require("../airtable");
const helper = require("../helper.js");
const _ = require('lodash');

const reel1 = ["🔔","🍒","🍇","🍊","🍒","🔔","🍋","🍇","🍒","🔔","🍊","🍇","🍋","💎","🍒","🔔","🍇","🍒","🔔","🍒"];
const reel2 = ["💎","🍒","🍊","🍒","🍊","🍒","💎","🍒","🍊","🍒","🔔","🍊","💎","🍇","🍒","🍊","🍒","💎","🍒","🍊"];
const reel3 = ["🍇","🍊","🔔","🍊","🍇","🍋","💎","🍊","🍇","🍊","🍇","🍋","🔔","🍊","🍇","🍋","🔔","🍊","🍇","🍋"];

//PAY TABLE
//🍒 X  X = 2
//🍒 🍒 X = 5
//🍒 🍒 🍒 = 10
//🍊 🍊 🍊 = 15
//🔔 🔔 🔔 = 20
//🍇 🍇 🍇 = 50
//🍋 🍋 🍋 = 100
//💎 💎 💎 = 500

//"🍎🍒🍋🍊🍇🎰🎲🎱💎🔔🎫👑💰🎟"

async function paytable(message, context) {
    console.log(`<=== chatsino/paytable.js ===>`);
    const command = message.replace("!paytable ", "").trim();

    switch(command) {
        case "slots": return "SLOTS PAY TABLE: 💎💎💎[500] 🍋🍋🍋[100] 🍇🍇🍇[50] 🔔🔔🔔[20] 🍊🍊🍊[15] 🍒🍒🍒[10] 🍒🍒🅇[5] 🍒🅇🅇[2]";
        case "poker": return "POKER PAY TABLE: Royal Flush[50,000] Straight Flush[5,000] Four of a Kind[400] Full House[50] Flush[25] Straight[10] Three of a Kind[3] Two Pair[2] Pair[1]";
    }

    return `@${context.username} Please indicate either the poker or slots paytable like this: !paytable <type>`;
}

module.exports = paytable;