//TODO: GetNewsIntent
//TODO: StopIntent
//TODO: PersonalInfoIntentHandler
//TODO: SpeechConIntentHandler
//TODO: SoundEffectIntentHandler

const tmi = require('tmi.js');
var AWS = require("aws-sdk");
const airtable = require('./airtable');
const handler = require("./handler");

const Lex = new AWS.LexRuntime({
    apiVersion: '2016-11-28',
    region: 'us-east-1'
})

// Define configuration options
const opts = require('./identity.js')

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
async function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot
  console.log("TARGET = " + JSON.stringify(target));
  console.log("CONTEXT = " + JSON.stringify(context));
  console.log("MESSAGE = " + JSON.stringify(msg));
  console.log("SELF = " + JSON.stringify(self));

  airtable.saveChatMessage(context, msg, target);

  //TODO: PLAY A SPEECHCON WHEN REQUESTED (FROM THE CLOUD)
  //TODO: PLAY A SOUND EFFECT WHEN REQUESTED (FROM THE CLOUD)
  //TODO: GIVE ANSWERS LIKE THE DEV TIPS SKILL DOES.

  const commandName = msg.trim();
  console.log("COMMAND NAME = " + commandName);
  if (commandName.toLowerCase().startsWith("alexa")) {
    const command = commandName.toLowerCase().replace("alexa", "").trim();

    var params = {
        botAlias: 'BETA', /* required */
        botName: 'AlexaChatBot', /* required */
        inputText: command, /* required */
        userId: context.username, /* required */
        requestAttributes: {},
        sessionAttributes: {}
    };

    Lex.postText(params, async function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
          const intentName = data.intentName;
          let messageOut = "";
          switch(intentName) {
            case "AnswerIntent":
              messageOut = await handler.AnswerIntent(data, context);
            break;
          }
          console.log(`MESSAGE OUT ${messageOut}`);
          if (messageOut) {
            client.say(target, messageOut);
          }
        }   
    });
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}