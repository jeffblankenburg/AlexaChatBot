const airtable = require("../airtable");
const helper = require("../helper.js");
const evaluator = require("./evaluator.js");
const _ = require('lodash');

//const deck = ["🂡", "🂢", "🂣", "🂤", "🂥", "🂦", "🂧", "🂨", "🂩", "🂪", "🂫", "🂭", "🂮"];

async function poker(message, context) {
    console.log(`<=== chatsino/poker.js ===>`);
    const command = message.replace("!poker ", "");
    let wager = parseInt(command);
    if (Number.isNaN(wager)) wager = 1;
    console.log(`WAGER ${wager}`);
    const username = context.username;
    const user = await airtable.getUserRecord(username);
    const userCoins = user.fields.Currency;

    if (isValidWager(wager, userCoins)) {
        let deck = createNewDeck();
        deck = shuffle(deck);
        let hand = dealNewHand(deck);
        var outcome = evaluator.poker(hand);
        console.log(`OUTCOME ${JSON.stringify(outcome)}`);
        if (outcome.odds > 0) return await payout(user, wager, hand, outcome)
        else return await withdraw(user, wager, hand);
    }
    else return `@${username} The amount wagered is invalid ("${wager}"). Your bet has not been recorded. You currently have ${userCoins} Alexa Coins available. Please try again.`;
}

function createHandText(hand) {
    let text = "";
    for (let i = 0;i<hand.length;i++) {
        text += `${hand[i].value.symbol}${hand[i].suit.symbol} `;
    }
    return text;
}

function createNewDeck() {
    const suits = [{name: "Hearts", id: 1, symbol:"❤"}, {name: "Diamonds", id:2, symbol:"♦️"}, {name: "Clubs", id:3, symbol:"♣️"}, {name: "Spades", id:4, symbol:"♠️"}];
    const values = [{name: "Two", id: 2, symbol:"2"}, {name: "Three", id:3, symbol:"3"}, {name: "Four", id:4, symbol:"4"}, {name: "Five", id:5, symbol:"5"}, {name: "Six", id:6, symbol:"6"}, {name: "Seven", id:7, symbol: "7"}, {name: "Eight", id:8, symbol:"8"}, {name: "Nine", id:9, symbol:"9"}, {name: "Ten", id:10, symbol:"10"}, {name: "Jack", id:11, symbol:"J"}, {name: "Queen", id:12, symbol:"Q"}, {name: "King", id:13, symbol:"K"}, {name: "Ace", id:14, symbol:"A"}];
    let deck = [];
    suits.forEach(suit => {
        values.forEach(value => {
            deck.push({suit:suit, value:value});
        })
    });
    return deck;
}

function dealNewHand(deck) {
    let hand = [];
    for (var i=0;i<=4;i++) {
        hand[i] = deck[i];
    }
    return hand;
}

function shuffle(deck) {
    for(let i = deck.length-1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    return deck;
}

function isValidWager(wager, userCoins) {
    if (_.isNaN(wager)) return false;
    else if (wager < 0) return false;
    else if (wager < userCoins) return true;
    return false;
}

async function withdraw(user, wager, hand) {
    console.log(`WITHDRAWING ${wager} ${createHandText(hand)}`);
    const action = await airtable.updateScore(user, user.fields.Currency - wager);
    return `${createHandText(hand)} @${user.fields.Username} lost ${wager} coins in poker. New total is ${action.fields.Currency}.`;
}

async function payout(user, wager, hand, outcome) {
    console.log(`PAYING OUT ${wager * outcome.odds}`);
    console.log(`NEW BALANCE ${parseInt(user.fields.Currency) + parseInt(wager * outcome.odds)}`);
    const action = await airtable.updateScore(user, parseInt(user.fields.Currency) + parseInt(wager * outcome.odds));
    return `${createHandText(hand)} @${user.fields.Username} bet ${wager} and won ${wager * outcome.odds} coins in poker with a ${outcome.name.toUpperCase()}. New total is ${action.fields.Currency}.`;
}

module.exports = poker;