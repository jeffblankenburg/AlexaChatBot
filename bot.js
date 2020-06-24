//TODO: PersonalInfoIntentHandler
//TODO: SpeechConIntentHandler
//TODO: SoundEffectIntentHandler

const tmi = require('tmi.js');
const airtable = require('./airtable');
const command = require("./command");

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

  const [chatMessage, userScore] = await Promise.all([
    airtable.saveChatMessage(context, msg, target),
    airtable.updateUserScore(context, msg, target)
  ]);

  //TODO: PLAY A SPEECHCON WHEN REQUESTED (FROM THE CLOUD)
  //TODO: PLAY A SOUND EFFECT WHEN REQUESTED (FROM THE CLOUD)

  const message = msg.trim();
  const messageArray = message.split(" ");
  console.log("COMMAND NAME = " + messageArray[0]);

  switch(messageArray[0]) {
    case "alexa":
      client.say(target, await command.alexa(message, context));
    break;
    case "!age":
      client.say(target, await command.age(message));
    break;
    case "!followers":
      client.say(target, await command.followers(message));
    break;
    case "!help":
      client.say(target, "Current command list: alexa, !age, !followers");
    break;
    case "!me":
      client.say(target, await command.me(message, context));
    break;
  }
// if (commandName.toLowerCase().startsWith("!followers")) {
//     
//   }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}