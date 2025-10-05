// Popup script for settings management
const toggleSwitch = document.getElementById('toggleSwitch');
const apiKeyInput = document.getElementById('apiKey');
const saveBtn = document.getElementById('saveBtn');
const statusDiv = document.getElementById('status');

// Load saved settings
chrome.storage.sync.get(['enabled', 'apiKey'], (result) => {
  if (result.enabled) {
    toggleSwitch.classList.add('active');
  }

  if (result.apiKey) {
    apiKeyInput.value = result.apiKey;
  }
});

// Toggle switch
toggleSwitch.addEventListener('click', () => {
  const isActive = toggleSwitch.classList.toggle('active');

  chrome.storage.sync.set({ enabled: isActive }, () => {
    // Notify content scripts
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          action: 'toggleInsights',
          enabled: isActive
        }).catch(() => {});
      });
    });

    showStatus(isActive ? 'Insights enabled' : 'Insights disabled');
  });
});

// Save button
saveBtn.addEventListener('click', () => {
  const apiKey = apiKeyInput.value.trim();

  if (!apiKey) {
    showStatus('Please enter an API key', true);
    return;
  }

  chrome.storage.sync.set({ apiKey: apiKey }, () => {
    showStatus('Settings saved successfully!');
  });
});

// Show status message
function showStatus(message, isError = false) {
  statusDiv.textContent = message;
  statusDiv.style.background = isError ? 'rgba(239, 83, 80, 0.2)' : 'rgba(102, 126, 234, 0.2)';
  statusDiv.style.color = isError ? '#ff6b6b' : '#667eea';
  statusDiv.style.border = isError ? '1px solid rgba(239, 83, 80, 0.4)' : '1px solid rgba(102, 126, 234, 0.4)';
  statusDiv.classList.add('show');

  setTimeout(() => {
    statusDiv.classList.remove('show');
  }, 3000);
}
