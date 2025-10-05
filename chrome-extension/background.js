// Background service worker for Gemini API integration
let isEnabled = false;

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['enabled', 'apiKey'], (result) => {
    isEnabled = result.enabled || false;
  });
});

// Listen for hotkey command
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-insights') {
    isEnabled = !isEnabled;
    chrome.storage.sync.set({ enabled: isEnabled });

    // Notify all tabs about the state change
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          action: 'toggleInsights',
          enabled: isEnabled
        }).catch(() => {});
      });
    });
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getInsight') {
    handleGetInsight(request.screenshot, request.question)
      .then(response => sendResponse({ success: true, insight: response }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep message channel open for async response
  }

  if (request.action === 'checkEnabled') {
    chrome.storage.sync.get(['enabled'], (result) => {
      sendResponse({ enabled: result.enabled || false });
    });
    return true;
  }

  if (request.action === 'captureVisible') {
    chrome.tabs.captureVisibleTab(sender.tab.windowId, { format: 'png' }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        sendResponse({ error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ dataUrl: dataUrl });
      }
    });
    return true;
  }
});

// Function to call Gemini API
async function handleGetInsight(screenshotDataUrl, question) {
  // Get API key from storage
  const result = await chrome.storage.sync.get(['apiKey']);
  const apiKey = result.apiKey;

  if (!apiKey) {
    throw new Error('API key not set. Please configure it in the extension popup.');
  }

  // Convert data URL to base64 (remove the data:image/png;base64, prefix)
  const base64Image = screenshotDataUrl.split(',')[1];

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [{
      parts: [
        {
          text: `You are an expert content analyzer. Analyze the screenshot and the element context deeply.

Element Context: ${question}

INSTRUCTIONS:
- Read and understand the FULL content visible in the screenshot
- Provide appropriate answer for choices the question based on the content
- Don't describe question or content. just provide the answer
- May be it is about multiple answers, true/false or one single word answer
- Be specific and informative, not generic
- Maximum 3 concise sentences

Give meaningful insights about what this content is actually about.`
        },
        {
          inline_data: {
            mime_type: "image/png",
            data: base64Image
          }
        }
      ]
    }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 200,
    }
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'API request failed');
    }

    const data = await response.json();
    const insight = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No insight available';

    return insight;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}
