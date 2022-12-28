module.exports = {
    isValidUrl: isValidUrl
  };

function isValidUrl(inputUrl) {
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    return urlRegex.test(inputUrl);
  }