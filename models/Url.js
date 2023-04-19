class Url {
    constructor(id, key, url, category, expiry_date, created_timestamp) {
      this.id = id;
      this.key = key;
      this.url = url;
      this.category = category;
      this.expiry_date = expiry_date;
      this.created_timestamp = created_timestamp;
    }
  }
  
  function mapRowToUrl(row) {
    return new Url(
      row.id,
      row.key,
      row.url,
      row.category,
      row.expiry_date,
      row.created_timestamp
    );
  }
  
  module.exports = {
    Url,
    mapRowToUrl
  };
  