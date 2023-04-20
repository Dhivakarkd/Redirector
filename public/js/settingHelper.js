async function importdata() {
  const { value: file } = await Swal.fire({
    title: "Select Json File to Upload",
    input: "file",
    inputAttributes: {
      accept: "application/json",
      "aria-label": "Upload your file",
    },
  });

  if (file) {
    const formData = new FormData();
    formData.append("file", file);

    fetch("/action/import", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Import Successful",
            showConfirmButton: true,
            timer: 1500,
          });
        } else {
          throw new Error("Export Failed");
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Import Failed",
          text: error.message,
          showConfirmButton: true,
          timer: 1500,
        });
      });
  }
}
async function exportFunction() {
  fetch("/action/export", {
    method: "POST",
  })
    .then((response) => {
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Export Successful",
          showConfirmButton: true,
          timer: 1500,
        });
      } else {
        throw new Error("Export Failed");
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Export Failed",
        text: error.message,
        showConfirmButton: true,
        timer: 1500,
      });
    });
}
