module.exports = {
    isValidUrl: isValidUrl
  };

function isValidUrl(inputUrl) {
    const urlRegex = /^[\w.-]+(?:\.[\w\.-]+)?(?=.{1,2048}$)[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    return urlRegex.test(inputUrl);
  }