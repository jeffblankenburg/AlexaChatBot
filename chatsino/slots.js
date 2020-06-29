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

async function slots(message, context) {
    console.log(`<=== chatsino/slots.js ===>`);
    const command = message.replace("!slots ", "");
    let wager = parseInt(command);
    if (Number.isNaN(wager)) wager = 1;

    console.log(`WAGER ${wager}`);
    const username = context.username;
    const user = await airtable.getUserRecord(username);
    const userCoins = user.fields.Currency;

    if (isValidWager(wager, userCoins)) {
        const spinResult = spin();
        console.log(`SPIN RESULT ${spinResult}`);
        switch (spinResult) {
            case "💎 💎 💎": return await payout(user, wager, spinResult, 500);
            case "🍋 🍋 🍋": return await payout(user, wager, spinResult, 100)
            case "🍇 🍇 🍇": return await payout(user, wager, spinResult, 50);
            case "🔔 🔔 🔔": return await payout(user, wager, spinResult, 20);
            case "🍊 🍊 🍊": return await payout(user, wager, spinResult, 15);
            case "🍒 🍒 🍒": return await payout(user, wager, spinResult, 10);
            default:
                console.log(`LENGTH ${spinResult.length}`);
                console.log(`SUBSTR 0 1 ${spinResult.substr(0,1)}`);
                console.log(`SUBSTR 1 1 ${spinResult.substr(1,1)}`);
                if (spinResult.substr(0,2) === "🍒" && spinResult.substr(3,2) === "🍒")
                    return await payout(user, wager, spinResult, 5);
                else if (spinResult.substr(0,2) === "🍒")
                    return await payout(user, wager, spinResult, 2);
                else return await withdraw(user, wager, spinResult);
            break;
        }
    }
    else return `@${username} The amount wagered is invalid ("${wager}"). Your bet has not been recorded. You currently have ${userCoins} Alexa Coins available. Please try again.`;
}

function spin() {
    const slot1 = helper.getRandomItem(reel1);
    const slot2 = helper.getRandomItem(reel2);
    const slot3 = helper.getRandomItem(reel3);
    return `${slot1} ${slot2} ${slot3}`;
}

function isValidWager(wager, userCoins) {
    if (_.isNaN(wager)) return false;
    else if (wager < 0) return false;
    else if (wager < userCoins) return true;
    return false;
}

async function withdraw(user, wager, spinResult) {
    console.log(`WITHDRAWING ${wager} ${spinResult}`);
    const action = await airtable.updateScore(user, user.fields.Currency - wager);
    return `${spinResult} @${user.fields.Username} lost ${wager} coins on the slot machine. New total is ${action.fields.Currency}.`;
}

async function payout(user, wager, spinResult, payout) {
    console.log(`PAYING OUT ${wager * payout}`);
    console.log(`NEW BALANCE ${parseInt(user.fields.Currency) + parseInt(wager * payout)}`);
    const action = await airtable.updateScore(user, parseInt(user.fields.Currency) + parseInt(wager * payout));
    return `${spinResult} @${user.fields.Username} bet ${wager} and won ${wager * payout} coins on the slot machine. New total is ${action.fields.Currency}.`;
}

module.exports = slots;