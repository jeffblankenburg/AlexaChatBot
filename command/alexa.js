const handler = require("../handler");
var AWS = require("aws-sdk");

const Lex = new AWS.LexRuntime({
    apiVersion: '2016-11-28',
    region: 'us-east-1'
})

async function alexa(message, context) {
  console.log(`<=== command/alexa.js ===>`);
    const command = message.toLowerCase().replace("alexa,", "").replace("alexa", "").trim();

    var params = {
        botAlias: 'BETA', /* required */
        botName: 'AlexaChatBot', /* required */
        inputText: command, /* required */
        userId: context.username, /* required */
        requestAttributes: {},
        sessionAttributes: {}
    };

    //const LexResults = Lex.postText(params).then()
    
    const LexResults = new Promise((resolve, reject) => {Lex.postText(params, async function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
          const intentName = data.intentName;
          console.log(`INTENT NAME ${intentName}`);
          let messageOut = "";
          switch(intentName) {
            case "AnswerIntent":
              messageOut = await handler.AnswerIntent(data, context);
            break;
            case "GoodbyeIntent":
              messageOut = await handler.GoodbyeIntent(data, context);
            break;
            case "NewsIntent":
              messageOut = await handler.NewsIntent(data, context);
            break;
          }
          console.log(`MESSAGE OUT ${messageOut}`);
          if (messageOut) {
            resolve(messageOut);
          }
          resolve(messageOut);
        }   
    })});

    return LexResults;
}

module.exports = alexa;