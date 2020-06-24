const airtable = require("../airtable");
const helper = require("../helper.js");

async function NewsIntent(data, context) {
    console.log(`<=== handler/NewsIntent.js ===>`);
    const newsItems = await airtable.getNews("en-US");
    let newsText = "";
    for (var i = 0;i<newsItems.length;i++) {
        newsText += `${newsItems[i].fields.CardHeadline} ${newsItems[i].fields.LinkPrefix} ${newsItems[i].fields.Link} `;
    }
    return newsText;
    //return `@${context.username} ${goodbye}`;
}

module.exports = NewsIntent;