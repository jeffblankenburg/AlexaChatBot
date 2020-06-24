const fetch = require('node-fetch');
const _ = require('lodash');

function getTwitchAge(args) {
  console.log(`<=== external/getTwitchAge.js ===>`);
  let username = args.replace("@", "");
  console.log(`USERNAME ${username}`);

  if (_.isNil(username) || _.isEmpty(username) || _.isUndefined(username)) username = 'amazonalexa';

  const url = `https://decapi.me/twitch/accountage/${username}`;

  const options = {
    method: 'GET',
  };

  return fetch(url, options)
    .then((res) => res.text())
    .then((r) => r);
}

module.exports = getTwitchAge;
