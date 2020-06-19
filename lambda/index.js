exports.handler = async (event) => {
    console.log("INCOMING EVENT = " + JSON.stringify(event));
    
    // TODO implement
    var slotName = event.currentIntent.name.replace("Intent", "");
    const response = {
        "dialogAction": {
            "type": "Close",
         "fulfillmentState": "Fulfilled",
            "message": {
              "contentType": "CustomPayload",
              "content": slotName + ":" + event.currentIntent.slotDetails[slotName].resolutions[0].value
            }
        }
    }
    console.log("OUTBOUND RESPONSE = " + JSON.stringify(response));
    return response;
};

/*
update-function-code
--function-name <value>
[--zip-file <value>]
*/