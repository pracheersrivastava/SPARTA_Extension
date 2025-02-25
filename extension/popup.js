document.addEventListener("DOMContentLoaded", () => {
  // Check the current tab when the popup loads
  checkCurrentTab();

  // Add event listener for the manual URL check button
  const checkUrlButton = document.getElementById("check-url");
  if (checkUrlButton) {
    checkUrlButton.addEventListener("click", checkManualUrl);
  }
});

// Function to check the current active tab's URL
function checkCurrentTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    if (currentTab && currentTab.url) {
      const resultDiv = document.getElementById("result");
      resultDiv.textContent = "Checking current website...";

      // Fetch the result from the backend
      fetch(`http://127.0.0.1:5000/check?url=${encodeURIComponent(currentTab.url)}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.is_phishing) {
            resultDiv.innerHTML = `<strong style="color: red;">🚨 Warning:</strong> This site may be phishing!`;
          } else {
            resultDiv.innerHTML = `<strong style="color: green;">✅ Safe:</strong> This site is safe.`;
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          resultDiv.textContent = "Error checking website. Ensure the backend is running.";
        });
    } else {
      document.getElementById("result").textContent = "No active tab with a valid URL found.";
    }
  });
}

// Function to format URL with proper protocol
function formatUrl(url) {
  url = url.trim();
  if (!url.match(/^[a-zA-Z]+:\/\//)) {
    return `https://${url}`;
  }
  return url;
}

// Function to manually check a URL entered by the user
function checkManualUrl() {
  let manualUrl = document.getElementById("manual-url").value;
  manualUrl = formatUrl(manualUrl);

  const resultDiv = document.getElementById("manual-result");
  resultDiv.textContent = "Checking URL...";

  fetch(`http://127.0.0.1:5000/check?url=${encodeURIComponent(manualUrl)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.is_phishing) {
        resultDiv.innerHTML = `<strong style="color: red;">🚨 Warning:</strong> This site may be phishing!`;
      } else {
        resultDiv.innerHTML = `<strong style="color: green;">✅ Safe:</strong> This site is safe.`;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      resultDiv.textContent = "Error checking URL. Ensure the backend is running.";
    });
}