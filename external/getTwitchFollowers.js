const fetch = require('node-fetch');
const _ = require('lodash');

function getTwitchFollowers(args) {
  console.log(`<=== external/getTwitchFollowers.js ===>`);
  let username = args.replace("@", "");
  console.log(`USERNAME ${username}`);

  if (_.isNil(username) || _.isEmpty(username) || _.isUndefined(username)) username = 'amazonalexa';

  const url = `https://api.crunchprank.net/twitch/followcount/${username}`;

  const options = {
    method: 'GET',
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((r) => r);
}

module.exports = getTwitchFollowers;
