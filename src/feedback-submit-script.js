// ----- MSAL Configuration -----
const msalConfig = {
  auth: {
    clientId: "6ed5a94d-6e2f-4804-bf2a-01db3e8027fc",
    authority: "https://login.microsoftonline.com/655e497b-f0e8-44ed-98fb-77680dd02944/",
    redirectUri: "https://victorious-pond-02e3be310.2.azurestaticapps.net/" // ensures redirect returns here
  }
};

const loginRequest = {
  scopes: [
    "api://dc94dd83-ded3-4908-8f4d-1f8fa323abf7/user_impersonation",
    "openid",
    "profile",
    "offline_access"]
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

// ----- UI feedback -----
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

// ----- Acquire Token or Login -----
async function getAccessToken() {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length === 0) {
    // 👇 popup must be inside the user-initiated flow
    return await msalInstance.loginPopup(loginRequest)
      .then(async () => {
        const account = msalInstance.getAllAccounts()[0];
        const result = await msalInstance.acquireTokenSilent({
          ...loginRequest,
          account
        });
        return result.accessToken;
      })
      .catch((err) => {
        console.error("Popup login failed:", err);
        return null;
      });
  }

  try {
    const result = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account: accounts[0]
    });
    return result.accessToken;
  } catch (e) {
    console.warn("Silent failed, trying popup...");
    try {
      const result = await msalInstance.acquireTokenPopup(loginRequest);
      return result.accessToken;
    } catch (err) {
      console.error("Popup token fetch failed:", err);
      return null;
    }
  }
}

    

// ----- Submit Feedback -----
async function sendFeedback(name, feedback) {
  const token = await getAccessToken();
  if (!token) {
    console.error("No Token Available")
    showError("Authentication Failed, No Token Received.")
    return;
  }
  
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  console.log("🪪 Decoded Token Claims:", decodedToken);

    const res = await fetch("https://purenv-narangba-backend-dqcff9bvbzemeyf0.australiaeast-01.azurewebsites.net/api/feedback", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
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

// ----- Form handler -----
document.getElementById("feedbackForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  document.getElementById("feedbackError").style.display = "none";
  document.getElementById("feedbackSuccess").style.display = "none";

  const formData = new FormData(e.target);
  const name = formData.get("name");
  const feedback = formData.get("feedback");

  console.log("[Submit] Name:", name);
  console.log("[Submit] Feedback:", feedback);

  if (!name || !feedback) {
    showError("Name and feedback are required.");
    return;
  }

  await sendFeedback(name, feedback);
});

// ----- Resume flow after login redirect -----
window.addEventListener("DOMContentLoaded", async () => {
  try {
    await msalInstance.handleRedirectPromise(); // required!
  } catch (e) {
    console.error("MSAL redirect error:", e);
  }
});
