// Global variables for pagination
let currentPage = 1;
let totalPages;
const itemsPerPage = 5; // Change this value according to your needs
let selectedCategory;

// Function to update pagination controls
function updatePaginationControls(totalPages) {
  const paginationSpan = document.getElementById("currentPage");
  paginationSpan.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Function to handle fetching data for the current page and updating the table
function fetchDataAndUpdateTable(category, page) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  fetch(`/get/urls?category=${category}&start=${startIndex}&end=${endIndex}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const table = document.getElementById("url-table");

      // Clear the existing rows from the table
      while (table.rows.length > 1) {
        table.deleteRow(1);
      }

      // Loop through the data and add new rows to the table
      data.urls.forEach((row) => {
        const newRow = table.insertRow();
        newRow.id = `row-${row.id}`;

        const keyCell = newRow.insertCell();
        keyCell.textContent = row.key;

        const urlCell = newRow.insertCell();
        urlCell.textContent = row.url;

        const categoryCell = newRow.insertCell();
        categoryCell.textContent = row.category;

        // Add delete button cell
        const deleteCell = newRow.insertCell();
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
          console.log("row id is ", row.id);
          deleteUrl(row.id); // Call the deleteUrl function with the ID of the row
        });
        deleteCell.appendChild(deleteButton);
      });

      // Update pagination controls
      totalPages = Math.ceil(data.totalCount / itemsPerPage);
      updatePaginationControls(totalPages);
    })
    .catch((error) => {
      console.error(error);
    });
}

// Event listeners for pagination controls
document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchDataAndUpdateTable(selectedCategory, currentPage);
  }
});

// Function to handle dropdown change
function handleCategoryChange() {
  selectedCategory = document.querySelector("#category-dropdown").value;
  currentPage = 1;
  fetchDataAndUpdateTable(selectedCategory, currentPage);
}

function deleteUrl(id) {
  // Confirm deletion with the user
  if (confirm("Are you sure you want to delete this URL?")) {
    // Send a DELETE request to the server
    fetch(`/get/urls/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // If the deletion is successful, remove the corresponding table row
          const rowToRemove = document.getElementById(`row-${id}`);
          if (rowToRemove) {
            rowToRemove.remove();
          } else {
            console.warn("Failed to find the table row to remove");
          }
        } else {
          // If the deletion fails, show an error message
          alert("Failed to delete URL");
        }
      })
      .catch((error) => {
        console.error("Error deleting URL:", error);
        alert("An error occurred while deleting the URL");
      });
  }
}

document.getElementById("nextPage").addEventListener("click", () => {
  // You may need to adjust the logic to handle the last page
  console.log("Selected Category is ", selectedCategory);
  if (currentPage < totalPages) {
    currentPage++;
    fetchDataAndUpdateTable(selectedCategory, currentPage);
  }
});

// Add an event listener to the window's load event
window.addEventListener("load", () => {
  // Call fetchDataAndUpdateTable function with the initial category value and page 1
  const category = document.querySelector("#category-dropdown").value;
  selectedCategory = category;
  fetchDataAndUpdateTable(category, currentPage);
});

// Add event listener to dropdown change
document
  .querySelector("#category-dropdown")
  .addEventListener("change", handleCategoryChange);
