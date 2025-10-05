// Content script for hover detection and insight display
let isEnabled = false;
let hoverTimeout = null;
let currentTooltip = null;
let isProcessing = false;

// Initialize
chrome.storage.sync.get(['enabled'], (result) => {
  isEnabled = result.enabled || false;
});

// Listen for toggle messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleInsights') {
    isEnabled = request.enabled;
    if (!isEnabled && currentTooltip) {
      removeTooltip();
    }
    showNotification(isEnabled ? 'AI Insights Enabled' : 'AI Insights Disabled');
  }
});

// Hover event listener
document.addEventListener('mouseover', (event) => {
  if (!isEnabled || isProcessing) return;

  clearTimeout(hoverTimeout);

  hoverTimeout = setTimeout(() => {
    handleHover(event);
  }, 800); // Wait 800ms before triggering
});

document.addEventListener('mouseout', () => {
  clearTimeout(hoverTimeout);
});

// Handle hover event
async function handleHover(event) {
  const element = event.target;

  // Get element context (tag, text content, etc.)
  const question = getElementContext(element);

  if (!question) return;

  isProcessing = true;
  showTooltip('...', event.clientX, event.clientY);

  try {
    // Capture screenshot of the viewport
    const screenshot = await captureScreenshot();

    // Send to background script for Gemini API call
    chrome.runtime.sendMessage({
      action: 'getInsight',
      screenshot: screenshot,
      question: question
    }, (response) => {
      isProcessing = false;

      if (response && response.success) {
        showTooltip(response.insight, event.clientX, event.clientY);
      } else {
        const errorMsg = response?.error || 'Unknown error';
        showTooltip('Error: ' + errorMsg, event.clientX, event.clientY);
      }
    });
  } catch (error) {
    isProcessing = false;
    showTooltip('Error capturing screen', event.clientX, event.clientY);
  }
}

// Get context about the element
function getElementContext(element) {
  const tagName = element.tagName.toLowerCase();
  const text = element.textContent?.trim().substring(0, 1000) || '';
  const className = element.className || '';
  const id = element.id || '';

  // Skip if element is too generic or empty
  if (!text && !className && !id) return null;

  let context = `Element: ${tagName}`;
  if (id) context += ` id="${id}"`;
  if (className) context += ` class="${className}"`;
  if (text) context += ` text="${text}"`;

  return context;
}

// Capture screenshot using chrome API via content script
async function captureScreenshot() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: 'captureVisible' }, (response) => {
      if (response && response.dataUrl) {
        resolve(response.dataUrl);
      } else if (response && response.error) {
        reject(new Error(response.error));
      } else {
        reject(new Error('Failed to capture screenshot'));
      }
    });
  });
}

// Show tooltip with typewriter effect (one line at a time)
function showTooltip(text, x, y) {
  removeTooltip();

  // Split text into sentences or lines
  const lines = text.split(/[.!?]\s+/).filter(line => line.trim());

  if (lines.length === 0) return;

  let currentLineIndex = 0;

  function showNextLine() {
    if (currentLineIndex >= lines.length) {
      removeTooltip();
      return;
    }

    // Remove previous tooltip
    removeTooltip();

    const tooltip = document.createElement('div');
    tooltip.id = 'ai-insight-tooltip';
    tooltip.textContent = lines[currentLineIndex].trim();
    tooltip.style.cssText = `
      position: fixed;
      bottom: 10px;
      left: 10px;
      background: transparent;
      color: #666;
      padding: 4px 6px;
      border-radius: 0;
      font-size: 12px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      z-index: 2147483647;
      max-width: 400px;
      pointer-events: none;
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `;

    document.body.appendChild(tooltip);
    currentTooltip = tooltip;

    currentLineIndex++;

    // Show next line after 5 seconds (more time to read)
    setTimeout(showNextLine, 5000);
  }

  showNextLine();
}

// Remove tooltip
function removeTooltip() {
  if (currentTooltip) {
    currentTooltip.remove();
    currentTooltip = null;
  }
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.9);
    color: #fff;
    padding: 12px 16px;
    border-radius: 4px;
    font-size: 13px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    z-index: 2147483647;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

// Content script doesn't need this - screenshot is captured in background
