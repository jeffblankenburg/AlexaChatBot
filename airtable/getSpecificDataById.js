const keys = require("../keys.js");
const https = require("https");

async function getSpecificDataById(table, name) {
    const response = await httpGet(keys.airtable_base_data, "&filterByFormula=AND(IsDisabled%3DFALSE(),Name%3D%22" + encodeURIComponent(name) + "%22)", table);
    const data = response.records[0];
    console.log("SPECIFIC ITEM = " + JSON.stringify(data));
    return data;
}

function httpGet(base, filter, table = "Data"){
var options = { host: "api.airtable.com", port: 443, path: "/v0/" + base + "/" + table + "?api_key=" + keys.airtable_api_key + filter, method: "GET"};
//console.log("FULL PATH = http://" + options.host + options.path);
return new Promise(((resolve, reject) => { const request = https.request(options, (response) => { response.setEncoding("utf8");let returnData = "";
    if (response.statusCode < 200 || response.statusCode >= 300) { return reject(new Error(`${response.statusCode}: ${response.req.getHeader("host")} ${response.req.path}`));}
    response.on("data", (chunk) => { returnData += chunk; });
    response.on("end", () => { resolve(JSON.parse(returnData)); });
    response.on("error", (error) => { reject(error);});});
    request.end();
}));
}

  module.exports = getSpecificDataById;