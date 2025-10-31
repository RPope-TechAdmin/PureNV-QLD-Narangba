document.getElementById("getValues").addEventListener("click", () => {
    const selections = {};

    document.querySelectorAll(".options-fix").forEach(optionGroup => {
        const groupId = optionGroup.id;
        const checkboxes = fixtotal.querySelectorAll("input[type='checkbox']:checked:not(.group-select)");

        if (checkboxes.length > 0) {
            selections[groupId] = [];
            checkboxes.forEach(cb => selections[groupId].push(cb.value));
        }
    });

    document.querySelectorAll(".options-tclp").forEach(optionGroup => {
        const groupId = optionGroup.id;
        const checkboxes = fixtclp.querySelectorAll("input[type='checkbox']:checked:not(.group-select)");

        if (checkboxes.length > 0) {
            selections[groupId] = [];
            checkboxes.forEach(cb => selections[groupId].push(cb.value));
        }
    });

    document.querySelectorAll(".options-twint").forEach(optionGroup => {
        const groupId = optionGroup.id;
        const checkboxes = optionGroup.querySelectorAll("input[type='checkbox']:checked:not(.group-select)");

        if (checkboxes.length > 0) {
            selections[groupId] = [];
            checkboxes.forEach(cb => selections[groupId].push(cb.value));
        }
    });

    document.querySelectorAll(".options-twext").forEach(optionGroup => {
        const groupId = optionGroup.id;
        const checkboxes = optionGroup.querySelectorAll("input[type='checkbox']:checked:not(.group-select)");

        if (checkboxes.length > 0) {
            selections[groupId] = [];
            checkboxes.forEach(cb => selections[groupId].push(cb.value));
        }
    });
    

    // send this to backend with dates
    console.log("Selected by group:", selections);


  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  fetch("https://narangba-backend-new-d5hne5d0fvaycnfd.australiaeast-01.azurewebsites.net/api/lab-data-download", {
    method: "POST",
    headers: { "Content-Type": "application/json",
                "Accept": "application/json",
     },
    body: JSON.stringify({ selections, startDate, endDate })
  })
  .then(res => {
    if (!res.ok) throw new Error("Server error");
    return res.blob();
  })
  .then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download ="Requested Results.xlsx";
    a.click();
  })
  .catch(err => alert(err.message));
});
