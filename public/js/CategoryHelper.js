// Global variables for pagination
let currentPage = 1;
let totalPages = 1;
const itemsPerPage = 5; // Change this value according to your needs
let selectedCategory;

// Function to update pagination controls
function updatePaginationControls(totalPages) {
  const paginationSpan = document.getElementById("currentPage");
  paginationSpan.textContent = `Page ${currentPage} of ${totalPages}`;

  // Optional: Disable buttons based on page
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages || totalPages === 0;
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
      const tbody = table.querySelector("tbody"); // Get tbody
      const paginationContainer = document.getElementById("pagination");

      // Clear the existing rows from the tbody (not the whole table, to keep header)
      tbody.innerHTML = '';

      console.log("Data length is ", data.urls.length);

      if (data.urls.length === 0) {
        // If no URLs found, display a message
        const noUrlsRow = tbody.insertRow();
        const cell = noUrlsRow.insertCell();
        cell.colSpan = "4";
        cell.textContent = "No URLs found";
        cell.className = "p-4 text-center text-gray-500 italic"; // Tailwind classes

        // Hide pagination container? Or just disable? Let's hide if empty or 0 pages.
        // But if we are on page 1 and no results, hiding is fine.
        if(page === 1) paginationContainer.style.display = "none";
      } else {
        // Loop through the data and add new rows to the table
        data.urls.forEach((row) => {
          const newRow = tbody.insertRow();
          newRow.id = `row-${row.id}`;
          newRow.className = "hover:bg-gray-100 dark:hover:bg-gray-700 transition";

          const keyCell = newRow.insertCell();
          keyCell.textContent = row.key;
          keyCell.className = "p-4 border-b border-gray-200 dark:border-gray-700";

          const urlCell = newRow.insertCell();
          urlCell.textContent = row.url;
          urlCell.className = "p-4 border-b border-gray-200 dark:border-gray-700 truncate max-w-xs"; // Truncate long URLs

          const categoryCell = newRow.insertCell();
          categoryCell.textContent = row.category;
          categoryCell.className = "p-4 border-b border-gray-200 dark:border-gray-700";

          // Add delete button cell
          const deleteCell = newRow.insertCell();
          deleteCell.className = "p-4 border-b border-gray-200 dark:border-gray-700";
          const deleteButton = document.createElement("button");
          deleteButton.innerHTML = '<i class="fa fa-trash"></i> Delete';
          deleteButton.className = "px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition";
          deleteButton.addEventListener("click", () => {
            console.log("row id is ", row.id);
            deleteUrl(row.id);
          });
          deleteCell.appendChild(deleteButton);

          // Show pagination container
          paginationContainer.style.display = "flex";
        });
      }

      // Update pagination controls
      totalPages = Math.ceil(data.totalCount / itemsPerPage);
      // Handle case where totalCount is 0
      if(totalPages === 0) totalPages = 1;
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
             // Reload table to update pagination if needed, or just remove row.
             // Reloading is safer for pagination consistency.
             fetchDataAndUpdateTable(selectedCategory, currentPage);
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
