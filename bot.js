//slotName + ":" + event.currentIntent.slotDetails[slotName].resolutions[0].value

const tmi = require('tmi.js');
var AWS = require("aws-sdk");
var https = require("https");
var keys = require("./keys.js");
var Airtable = require('airtable');

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
  console.log("MSG = " + JSON.stringify(msg));
  console.log("SELF = " + JSON.stringify(self));

  var base = new Airtable({apiKey: keys.airtable_api_key}).base("applh8X0qW7POJk9c");
  base("Twitch").create({"Username": context.username, "Message": msg.trim(), "Channel": target},
                  function(err, record) {
                    if (err) {
                      console.error("ERROR = " + err);
                      return;
                    }
                    console.log("RECORDID = " + record.getId());
                  }
                );

  // Remove whitespace from chat message
  const commandName = msg.trim();
  console.log("COMMAND NAME = " + commandName);
    if (commandName.toLowerCase().startsWith("alexa")) {
    // Send content to Lex
    var params = {
        botAlias: 'BETA', /* required */
        botName: 'AlexaChatBot', /* required */
        inputText: commandName.toLowerCase().replace("alexa, ", ""), /* required */
        userId: context.username, /* required */
        requestAttributes: {},
        sessionAttributes: {}
    };

    Lex.postText(params, async function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log("DATA = " + JSON.stringify(data));
            console.log("DATA MESSAGE CONTENT = " + JSON.stringify(data.message));
            data.message = JSON.parse(data.message);
            console.log("DATA UPDATED = " + JSON.stringify(data));

            var tableName = data.intentName.replace("Intent", "");
            var resolvedValues = getResolvedValues(data, tableName);
            console.log("RESOLVED VALUES = " + JSON.stringify(resolvedValues));

            if (resolvedValues != undefined) {
                if (resolvedValues.length === 1) {
                    var item = await getSpecificDataById(tableName, resolvedValues[0].value);
                    var link = buildLinkText(item.fields.LinkPrefix, item.fields.Link);
                    
                    client.say(target, "@" + context.username + " " + item.fields.ChatResponse + " " + link);
                }
                else {
                    client.say(target, "@" + context.username + " Did you mean " + getSpokenDisambiguation(resolvedValues) + "?");
                }
            }
            else {
              client.say(target, "@" + context.username + " I don't seem to know about that.  Sorry.");
            }

            //slotName + ":" + event.currentIntent.slotDetails[slotName].resolutions[0].value

            /*
          var dataSplit = data.message.split(":");
          if (dataSplit[1] === undefined) {
            var errorMessage = "@" + context.username + " I don't think I know about that.";
            client.say(target, errorMessage);
            
          }
          else {
            var item = await getSpecificDataById(dataSplit[0], dataSplit[1]);
            //console.log("DATA MESSAGE = " + JSON.stringify(data.message));
            //console.log("ITEM = " + JSON.stringify(item));
            client.say(target, "@" + context.username + " " + item.fields.CardDescription);
          } 
          */
        }   
    });
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

async function getSpecificDataById(table, name) {
  const response = await httpGet(keys.airtable_base_data, "&filterByFormula=AND(IsDisabled%3DFALSE(),Name%3D%22" + encodeURIComponent(name) + "%22)", table);
  const data = response.records[0];
  console.log("SPECIFIC ITEM = " + JSON.stringify(data));
  return data;
}

function httpGet(base, filter, table = "Data"){
  var options = { host: "api.airtable.com", port: 443, path: "/v0/" + base + "/" + table + "?api_key=" + keys.airtable_api_key + filter, method: "GET"};
  console.log("FULL PATH = http://" + options.host + options.path);
  return new Promise(((resolve, reject) => { const request = https.request(options, (response) => { response.setEncoding("utf8");let returnData = "";
      if (response.statusCode < 200 || response.statusCode >= 300) { return reject(new Error(`${response.statusCode}: ${response.req.getHeader("host")} ${response.req.path}`));}
      response.on("data", (chunk) => { returnData += chunk; });
      response.on("end", () => { resolve(JSON.parse(returnData)); });
      response.on("error", (error) => { reject(error);});});
      request.end();
  }));
}


function changeLampColor(color) {
    console.log("COLOR CHANGE REQUEST = " + color);
    var data = {
        "power": "on",
        "color": color,
        "brightness": 100,
        "duration": 1,
        "fast": true
    };
    
    //https://api.lifx.com/v1/lights/id:d073d5139892/state    
    const options = {
            hostname: "api.lifx.com",
            port: 443,
            path: "v1/lights/id:" + keys.lifx_bulb_id + "/state",
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + keys.lifx_key
            }
    }
        console.log("MAKING HTTPS CALL.");
        const req = https.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`);
            req.write(data);
            res.on('data', d => {process.stdout.write(d)});        req.on('error', error => {console.error(error)});
            req.end();
            });
    }
    

function getResolvedValues(data, slot) {
    if (   data
        && data.message
        && data.message.currentIntent
        && data.message.currentIntent.slotDetails
        && data.message.currentIntent.slotDetails[slot]
        && data.message.currentIntent.slotDetails[slot].resolutions
        && data.message.currentIntent.slotDetails[slot].resolutions) return data.message.currentIntent.slotDetails[slot].resolutions;
    else return undefined;
}

function getSpokenDisambiguation(values) {
    var response = "";
    for (var i=0;i<values.length;i++)
    {
        if (i === values.length-1) response += ", or ";
        else if (i > 0) response += ", ";
        response+= values[i].value
    }
    return response;
}

function buildLinkText(prefix, link) {
  if (link != undefined) {
    if (prefix != undefined) {
      return prefix + " " + link;
    }
    else return link;
  }
}