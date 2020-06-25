var Airtable = require('airtable');
var keys = require("../keys.js");

async function saveChatMessage(context, message, target) {
    console.log(`<=== airtable/saveChatMessage.js ===>`);
    var base = new Airtable({apiKey: keys.airtable_api_key}).base("apphoA6LbqHbbkMHK");
    base("ChatLog").create({"Username": context.username, "Message": message.trim(), "Channel": target},
        function(err, record) {
            if (err) {
            console.error("ERROR = " + err);
            return;
            }
            //console.log("RECORDID = " + record.getId());
        }
        );
}

module.exports = saveChatMessage;