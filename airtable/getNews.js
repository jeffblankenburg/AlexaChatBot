const helper = require("../helper");
const fetch = require("node-fetch");
var keys = require("../keys.js");

function getNews(locale) {
  console.log(`<=== airtable/getNews.js ===>`);
  const url = `https://api.airtable.com/v0/${keys.airtable_base_data}/News?api_key=${keys.airtable_api_key}&filterByFormula=AND(IsDisabled%3DFALSE(),FIND(%22${locale}%22%2C+Locale)!%3D0,IS_AFTER(ExpirationDate%2CNOW())%3D1,IS_BEFORE(PublicationDate%2CNOW())%3D1)&sort%5B0%5D%5Bfield%5D=PublicationDate&sort%5B0%5D%5Bdirection%5D=desc`;
  //console.log(`FULL PATH ${url}`);
  const options = {
    method: "GET",
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((r) => {
      return r.records;
    });
}

module.exports = getNews;
