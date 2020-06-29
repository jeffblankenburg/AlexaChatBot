const airtable = require("../airtable");
const helper = require("../helper.js");
const _ = require('lodash');

const red = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const black = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 31, 33, 35];
const positionList = ["red", "black", "even", "odd", "bottom", "top", "high", "middle", "low"];

async function roulette(message, context) {
    console.log(`<=== chatsino/roulette.js ===>`);
    //TODO: WE NEED TO THINK ABOUT THE THREE HORIZONTAL ROWS.  NOT CURRENTLY INCLUDED.
    const command = message.replace("!roulette ", "");
    const [wager, position] = command.split(" ");
    console.log(`WAGER ${wager}`);
    console.log(`POSITION ${position}`);
    const username = context.username;

    const user = await airtable.getUserRecord(username);
    const userCoins = user.fields.Currency;

    //IF THE USER PROVIDED BOTH A BET AND A POSITION
    if (wager && position) {
        if (isValidPosition(position)) {
            if (isValidWager(wager, userCoins)) {
                const spinResult = spin();
                console.log(`SPIN RESULT ${spinResult}`);
                if (Number.isNaN(parseInt(position))) {
                    switch(position) {
                        case "red":
                            if (red.includes(spinResult)) return await payout(user, wager, spinResult, position);
                        break;
                        case "black":
                            if (black.includes(spinResult)) return await payout(user, wager, spinResult, position);
                        break;
                        case "even":
                            if (spinResult != 0 && spinResult%2 === 0) return await payout(user, wager, spinResult, position);
                        break;
                        case "odd":
                            if (spinResult%2 === 1) return await payout(user, wager, spinResult, position);
                        break;
                        case "bottom":
                            if (spinResult >= 1 && spinResult <= 18) return await payout(user, wager, spinResult, position);
                        break;
                        case "top":
                            if (spinResult >=19 && spinResult <= 36) return await payout(user, wager, spinResult, position);
                        break;
                        case "high":
                            if (spinResult >=25 && spinResult <= 36) return await payout(user, wager*2, spinResult, position);
                        break;
                        case "middle":
                            if (spinResult >=13 && spinResult <= 24) return await payout(user, wager*2, spinResult, position);
                        break;
                        case "low":
                            if (spinResult >=1 && spinResult <= 12) return await payout(user, wager*2, spinResult, position);
                        break;
                    }
                    return await withdraw(user, wager, spinResult, position);
                }
                else if (spinResult === position) {
                    //TODO: IS THERE A WAY TO HANDLE BETTING ON INTERSECTIONS?
                    return await payout(user, wager * 35, spinResult, position);
                }
                else {
                    return await withdraw(user, wager, spinResult, position);
                }
            }
            else return `@${username} The amount wagered is invalid ("${wager}"). Your bet has not been recorded. You currently have ${userCoins} Alexa Coins available. Please try again.`;

        }
        else return `@${username} The position you indicated is not valid ("${position}"). Your bet has not been recorded. Please try again.`;
    }
    else return `@${username} You need to provide a bet and a position, like this: !roulette <bet> <position>.  Please try again.`;
}

function isValidPosition(position) {
    if (Number.isNaN(parseInt(position)) && positionList.includes(position)) return true;
    else if (_.isNaN(parseInt(position))) return false;
    else if (position >= 0 && position <=36) return true;
    return false;
}

function isValidWager(wager, userCoins) {
    if (_.isNaN(wager)) return false;
    else if (wager < 0) return false;
    else if (wager < userCoins) return true;
    return false;
}

function spin() {
    return Math.floor(Math.random() * (36 - 0 + 1));
}

async function withdraw(user, amount, spinResult, position) {
    console.log(`WITHDRAWING ${amount}`);
    const action = await airtable.updateScore(user, user.fields.Currency - amount);
    return `@${user.fields.Username} lost ${amount} coins on the roulette wheel. New total is ${action.fields.Currency}. Bet was on ${position}, outcome was ${getOutcomeDescription(spinResult)}`;
}

async function payout(user, amount, spinResult, position) {
    console.log(`PAYING OUT ${amount}`);
    console.log(`NEW BALANCE ${parseInt(user.fields.Currency) + parseInt(amount)}`);
    const action = await airtable.updateScore(user, parseInt(user.fields.Currency) + parseInt(amount));
    return `@${user.fields.Username} won ${amount} coins on the roulette wheel. New total is ${action.fields.Currency}. Bet was on ${position}, outcome was ${getOutcomeDescription(spinResult)}`;
}

function getOutcomeDescription(spin) {
    let description = `${spin} [`;
    if (red.includes(spin)) description += `red |`;
    else if (black.includes(spin)) description += `black |`;
    if (spin != 0 && spin%2 === 0) description += ` even |`;
    else if (spin%2 === 1) description += ` odd |`;
    if (spin >= 1 && spin <= 18) description += ` bottom |`;
    else if (spin >= 19 && spin <= 36) description += ` top |`;
    if (spin >= 1 && spin <= 12) description += ` low`;
    else if (spin >= 13 && spin <= 24) description += ` middle`;
    else if (spin >= 25 && spin <= 36) description += ` high`;
    description += "]";
    return description;
}

module.exports = roulette;