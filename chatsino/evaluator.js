const pokerhand = require("./pokerHand.js");

function poker(hand) {
    const sortedHand = hand.sort(function(a, b){return b.value.id - a.value.id});

    if (pokerhand.isRoyalFlush(sortedHand)) return pokerOutcome.RoyalFlush;
    else if (pokerhand.isStraightFlush(sortedHand)) pokerOutcome.StraightFlush;
    else if (pokerhand.isFourOfAKind(sortedHand)) return pokerOutcome.FourOfAKind;
    else if (pokerhand.isFullHouse(sortedHand)) return pokerOutcome.FullHouse;
    else if (pokerhand.isFlush(sortedHand)) return pokerOutcome.Flush;
    else if (pokerhand.isStraight(sortedHand)) return pokerOutcome.Straight;
    else if (pokerhand.isThreeOfAKind(sortedHand)) return pokerOutcome.ThreeOfAKind;
    else if (pokerhand.isTwoPair(sortedHand)) return pokerOutcome.TwoPair;
    else if (pokerhand.isPair(sortedHand)) return pokerOutcome.Pair;
    else return pokerOutcome.Nothing;
}

const pokerOutcome = {
    RoyalFlush: {name: "Royal Flush", odds: 50000},
    StraightFlush: {name:"Straight Flush", odds: 5000},
    FourOfAKind: {name:"Four of a Kind", odds: 400},
    FullHouse: {name:"Full House", odds: 50},
    Flush: {name:"Flush", odds: 25},
    Straight: {name:"Straight", odds: 10},
    ThreeOfAKind: {name:"Three of a Kind", odds: 3},
    TwoPair: {name:"Two Pair", odds: 2},
    Pair: {name:"Pair", odds: 1},
    Nothing: {name:"losing hand.", payout: 0}
};

module.exports = {
    poker
}