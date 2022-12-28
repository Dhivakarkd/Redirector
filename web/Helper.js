module.exports = {
  isValidUrl: isValidUrl,
  isNullOrEmpty: isNullOrEmpty,
};

const url = require('url');

function isValidUrl(inputUrl) {
  const parsedUrl = url.parse(inputUrl);
  return parsedUrl !== null && parsedUrl.hostname !== null;
}

function isNullOrEmpty(input) {
  return input === null || input === "";
}
