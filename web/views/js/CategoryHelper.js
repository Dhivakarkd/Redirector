function fetchDataAndUpdateTable(category) {
  fetch(`/get/urls?category=${category}`)
    .then((response) => response.json())
    .then((data) => {
      const table = document.getElementById("url-table");

      // Clear the existing rows from the table
      while (table.rows.length > 1) {
        table.deleteRow(1);
      }

      // Loop through the data and add new rows to the table
      data.forEach((row) => {
        const newRow = table.insertRow();

        // Add cells to the new row
        const idCell = newRow.insertCell();
        idCell.textContent = row.id;

        const keyCell = newRow.insertCell();
        keyCell.textContent = row.key;

        const urlCell = newRow.insertCell();
        urlCell.textContent = row.url;

        const categoryCell = newRow.insertCell();
        categoryCell.textContent = row.category;

        // const expiryDateCell = newRow.insertCell();
        // expiryDateCell.textContent = row.expiry_date;

        const createdTimestampCell = newRow.insertCell();
        createdTimestampCell.textContent = row.created_timestamp;
      });
    })
    .catch((error) => {
      console.error(error);
    });
}
