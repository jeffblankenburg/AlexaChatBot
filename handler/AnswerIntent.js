const airtable = require("../airtable");
const helper = require("../helper.js");

async function AnswerIntent(data, context) {
  console.log(`<=== handler/AnswerIntent.js ===>`);
    data.message = JSON.parse(data.message);
    var tableName = data.intentName.replace("Intent", "");
    var resolvedValues = helper.getResolvedValues(data, tableName);
    if (resolvedValues != undefined) {
      if (resolvedValues.length === 1) {
          var item = await airtable.getSpecificDataById(tableName, resolvedValues[0].value);
          var link = helper.buildLinkText(item.fields.LinkPrefix, item.fields.Link);
          return `@${context.username} ${item.fields.ChatResponse} ${link}`;
      }
      else {
          return `@${context.username} Did you mean ${helper.getSpokenDisambiguation(resolvedValues)}?`;
      }
    }
    else {
      return `@${context.username} I don't seem to know about that.  Sorry.`;
    }
}

module.exports = AnswerIntent;