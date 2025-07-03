function showError(message) {
  const errorDiv = document.getElementById("feedbackError");
  errorDiv.style.display = "block";
  errorDiv.innerText = message;
}

function showSuccess(message) {
  const successDiv = document.getElementById("feedbackSuccess");
  successDiv.style.display = "block";
  successDiv.innerText = message;
}

async function sendFeedback(name, feedback) {
  const res = await fetch("https://narangba-backend-narangba-ctfwesf0d7ebcmcv.australiaeast-01.azurewebsites.net/api/feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ name, feedback })
  });

  if (!res.ok) {
    const errorText = await res.text();
    showError(`Error: ${res.status} - ${errorText}`);
    return;
  }

  showSuccess("Your feedback has been successfully submitted, Thank you!");
  document.getElementById("feedbackForm").reset();
}

document.getElementById("feedbackForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  document.getElementById("feedbackError").style.display = "none";
  document.getElementById("feedbackSuccess").style.display = "none";

  const formData = new FormData(e.target);
  const name = formData.get("name");
  const feedback = formData.get("feedback");

  if (!name || !feedback) {
    showError("Name and feedback are required.");
    return;
  }

  await sendFeedback(name, feedback);
});
