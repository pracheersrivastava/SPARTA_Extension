chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && tab.url.startsWith("http")) {
    console.log("Checking URL:", tab.url);

    fetch(`http://127.0.0.1:5000/check?url=${encodeURIComponent(tab.url)}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Received data from backend:", data);

        // Send message to content script
        chrome.tabs.sendMessage(
          tabId,
          { is_phishing: data.is_phishing },
          (response) => {
            if (chrome.runtime.lastError) {
              console.warn("Could not send message to content script:", chrome.runtime.lastError.message);
            }
          }
        );

        // Show notification
        const notificationId = `phishing-alert-${Date.now()}`;
        const message = data.is_phishing
          ? `⚠️ Warning: ${tab.url} is phishing!`
          : `✔️ ${tab.url} is safe.`;

        chrome.notifications.create(notificationId, {
          type: "basic",
          iconUrl: "icon.png",
          title: "SPARTA Phishing Detector",
          message: message,
        });

        setTimeout(() => chrome.notifications.clear(notificationId), 5000);
      })
      .catch((error) => console.error("Error fetching URL:", error));
  }
});
